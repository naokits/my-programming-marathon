"use strict";

var Query        = require("./query");
var Operation    = require("./operation");
var Errors       = require("./errors");
var objectAssign = require("object-assign");
var ProviderUtil = require("./provider-util");
var localStorage = null;
if(typeof window !== "undefined"){
  if(window.localStorage){
    localStorage = window.localStorage;
  }else{
    localStorage = require("localforage");
  }
}else{
  localStorage = new require("node-localstorage").LocalStorage("./scratch");
}

/**
* 会員および会員権限によるオブジェクトへのアクセスの管理を扱うクラスです。 
*
* サインアップで登録の後、ログインすることでセッショントークンを取得します。 
* セッショントークンを保持しているユーザをカレントユーザに設定することで、そのユーザの権限でオブジェクトにアクセスできるようになります。
* セッショントークンの有効期限はデフォルトで24時間です。期限切れの場合は一度ログアウトした後再度ログインを行ってください。（有効期限はダッシュボードで変更できます。）
*
* サインアップできるユーザ種別は、ユーザ名/パスワードでの認証、メールアドレス/パスワードでの認証、SNS連携(facebook/twitter/google)での認証があります。
* 認証方法によって登録時・ログイン時に使用するメソッドが変わります。
*
* @class NCMB.User
* @constructor
* @param {Object} attrs インスタンス生成時に設定するプロパティ
*/
var User = module.exports = function(ncmb){
  var reserved = [
    "className", "save",
    "update", "delete", "logout", "requestPasswordReset",
    "signUpByAccount", "signUpWith", "requestSignUpEmail",
    "login", "loginAsAnonymous", "loginWithMailAddress", "loginWith",
    "getCurrentUser", "isCurrentUser",
    "setIncrement", "add", "addUnique", "remove"];

  var isReserved = function(key){
    return reserved.indexOf(key) > -1;
  };

  var unreplaceable =[
    "objectId", "password", "createDate", "updateDate", "mailAddressConfirm", "_id", "sessionToken"
  ];

  var isReplaceable = function(key){
    if(unreplaceable.indexOf(key) === -1) return true;
    return false;
  };

  var CURRENT_USER_PATH  = "currentUser";

  function User(attrs){
    for(var attr in attrs){
      if(attrs.hasOwnProperty(attr)){
        if(!isReserved(attr)){
          this[attr] = attrs[attr];
        }
      }
    }
  }
  var className = User.prototype.className = "/users";

  Object.keys(Query.prototype).forEach(function(attr){
    if(attr !== "batch" && typeof Query.prototype[attr] === "function"){
      User[attr] = function(){
        var query = new Query(ncmb, className);
        return query[attr].apply(query, [].slice.apply(arguments));
      };
    }
  });
  Object.keys(Operation.prototype).forEach(function(attr){
    if(attr !== "batch" && typeof Operation.prototype[attr] === "function"){
      User.prototype[attr] = function(){
        var operation = new Operation(reserved);
        return operation[attr].apply(this, [].slice.apply(arguments));
      };
    }
  });

  /**
  * 現在セッションに使用しているユーザの情報を取得します。
  * セッションにセッショントークンを利用していない場合、nullが返ります。
  * また、画面遷移などでログイン中にセッショントークン情報が失われたしまった場合、
  * getCurrentUserを実行することで、ローカルに保存されているカレントユーザ情報から
  * セッショントークンを設定し直します。
  *
  * @method User.getCurrentUser
  * @return {User} セッション中のユーザオブジェクト
  */
  User.getCurrentUser = function(){
    var currentUser = getItem(CURRENT_USER_PATH);
    if(currentUser){
      var user = null;
      try{
        user = new User(JSON.parse(currentUser));
      }catch(err){
        throw err;
      }
      ncmb.sessionToken = user.sessionToken;
      ncmb.currentUser = user;
      return user;
    }
    return null;
  };

  /**
  * 現在セッションに使用しているユーザかどうかを判別します。
  *
  * @method isCurrentUser
  * @return {boolean} true/false
  */
  User.prototype.isCurrentUser = function(){
    if(this.sessionToken === ncmb.sessionToken) return true;
    return false;
  };

  /**
  * ユーザ名とパスワード認証でユーザを登録します。
  *
  * @method signUpByAccount
  * @param {function} callback コールバック関数
  * @return this
  */
  User.prototype.signUpByAccount = User.prototype.save = function(callback){
    if (!this.userName){
      return ( callback || Promise.reject.bind(Promise))(new Errors.NoUserNameError("To login By Account, userName is necessary."));
    }
    if (!this.password){
      return ( callback || Promise.reject.bind(Promise))(new Errors.NoPasswordError("To login By Account, password is necessary."));
    }

    return ncmb.request({
      path: "/" + ncmb.version + this.className,
      method: "POST",
      data: this
    }).then(function(data){
      var obj = null;
      try{
        obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      objectAssign(this, obj);
      Object.keys(this).forEach(function (key) {
        if(this[key] && this[key].__op) delete this[key];
      }.bind(this));

      if(callback) return callback(null, this);
      return this;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  /**
  * SNS連携認証でユーザを登録します。
  * インスタンスのauthDataプロパティに適切なJSONオブジェクトが設定されている場合、providerおよびdataは省略可能です。
  * 複数のプロバイダ情報を一度に登録することは出来ません。
  *
  * @method signUpWith
  * @param {string} provider 連携するサービスプロバイダ名 facebook/twitter/google
  * @param {Object} data 認証に必要な情報を保持したJSON形式のオブジェクト
  * @param {function} callback コールバック関数
  * @return this
  */
  User.prototype.signUpWith = function(provider, data, callback){
    if(this.userName){
      return ( callback || Promise.reject.bind(Promise))(new Errors.ContentsConflictError("To sign up with SNS account, user cannot have arbitrary userName."));
    }
    if(typeof provider === "function"){
      callback = provider;
      provider = null;
      data = null;
    }
    if(typeof data === "function"){
      callback = data;
      data = null;
    }
    if (!data && (!this.authData || Object.keys(this.authData).length !== 1)){
      return ( callback || Promise.reject.bind(Promise))(new Errors.InvalidAuthInfoError("If provider and its data are not set, user must have an authData."));
    }
    try {
      if(provider){ data = (function(){var _data = {}; _data[provider] = data; return _data;}());}
      provider = ProviderUtil.getProvider(this.authData || data);
    }catch(err){
      return ( callback || Promise.reject.bind(Promise))(err);
    }
    this.authData = this.authData || {};
    this.authData[provider.getName()] = this.authData[provider.getName()] || provider.getAuthData();
    return ncmb.request({
      path: "/" + ncmb.version + this.className,
      method: "POST",
      data: this
    }).then(function(data){
      var obj = null;
      try{
        obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      objectAssign(this, obj);
      Object.keys(this).forEach(function (key) {
        if(this[key] && this[key].__op) delete this[key];
      }.bind(this));
      
      if(callback) return callback(null, this);
      return this;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  /**
  * メールアドレス認証ユーザの登録メールアドレス宛にパスワード再設定のメールを送信します。
  *
  * @method requestPasswordReset
  * @param {function} callback コールバック関数
  * @return APIレスポンス
  */
  User.prototype.requestPasswordReset = function(callback){
    if (! this.mailAddress) {
      return ( callback || Promise.reject.bind(Promise))(new Errors.NoMailAddressError("MailAddress must be set."));
    }
    return ncmb.request({
      path: "/" + ncmb.version + "/requestPasswordReset",
      method: "POST",
      data: {'mailAddress': this.mailAddress }
    }).then(function(data){
      var obj = null;
      try{
        obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      if(callback) return callback(null, obj);
      return obj;
    }).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  /**
  * メールアドレス認証の登録メールを送信します。
  * メール内でパスワード入力を行い、登録が完了した時点で認証が可能となります。
  *
  * @method requestSignUpEmail
  * @param {string} mailAddress 登録するメールアドレス
  * @param {function} callback コールバック関数
  * @return APIレスポンス
  */
  User.requestSignUpEmail = function(mailAddress,callback){
    if (! mailAddress) {
       return ( callback || Promise.reject.bind(Promise))(new Errors.NoMailAddressError("MailAddress must be set."));
    }
    return ncmb.request({
      path: "/" + ncmb.version + "/requestMailAddressUserEntry",
      method: "POST",
      data: {'mailAddress': mailAddress }
    }).then(function(data){
      if(callback) return callback(null, data);
      return data;
    }).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  /**
  * ユーザ情報の更新を行います。
  *
  * @method update
  * @param {function} callback コールバック関数
  * @return this
  */
  User.prototype.update = function(callback){
    if (!this.objectId) {
      return ( callback || Promise.reject.bind(Promise))(new Errors.NoObjectIdError("Updated object must be saved before."));
    }

    var replaceProperties = {};
    Object.keys(this).forEach(function(key){
      if(!isReplaceable(key)) return;
      replaceProperties[key] = this[key];
    }.bind(this));

    return ncmb.request({
      path: "/" + ncmb.version + this.className + "/" + this.objectId,
      method: "PUT",
      data: replaceProperties
    }).then(function(data){
      var obj = null;
      try{
        obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      this.updateDate = obj.updateDate;
      Object.keys(this).forEach(function (key) {
        if(this[key] && this[key].__op) delete this[key];
      }.bind(this));

      if(callback) return callback(null, this);
      return this;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  /**
  * ユーザ情報の削除を行います。
  *
  * @method delete
  * @param {function} callback コールバック関数
  * @return true
  */
  User.prototype.delete = function(callback){
    if (!this.objectId) {
      return ( callback || Promise.reject.bind(Promise))(new Errors.NoObjectIdError("Deleted object must be saved before."));
    }
    return ncmb.request({
      path: "/" + ncmb.version + this.className + "/" + this.objectId,
      method: "DEL"
    }).then(function(){
      if(callback) return callback(null, true);
      return true;
    }).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  /**
  * ログイン（セッショントークンの取得）およびカレントユーザへの設定を行います。
  * userNameおよびpasswordプロパティをもつUserインスタンスを第一引数に設定しそのユーザでログイン可能です。
  * その場合、第二引数を省略可能です。
  * すでにセッショントークンを保持している場合、更新処理は行いません。
  * セッショントークンの期限切れが発生している場合、一度ログアウトしてから再度ログインしてください。
  *
  * @method User.login
  * @param {string} userName ユーザ名
  * @param {string} password パスワード
  * @param {function} callback コールバック関数
  * @return ログインしたUserインスタンス
  */
  User.login = function(userName, password, callback){
    var user = null;
    if(userName instanceof ncmb.User){
      callback = password;
      user = userName;
      userName = user.userName;
      password = user.password;
    }
    if(typeof password === "function"){
      callback = password;
      password = null;
    }
    if(!userName || !password ){
      return (callback || Promise.reject.bind(Promise))(new Errors.NoAuthInfoError("To login by account, userName and password are necessary."));
    }
    if(!user){
      user = new User({userName: userName, password: password});
    }
    removeItem(CURRENT_USER_PATH);
    ncmb.sessionToken = null;

    return user.login().then(function(user){
      setItem(CURRENT_USER_PATH, JSON.stringify(user));
      ncmb.sessionToken = user.sessionToken;
      if(callback) return callback(null, user);
      return user;
    }).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  /**
  * ログイン（セッショントークンの取得）を行います。
  * カレントユーザへの設定は行いません。
  * userNameおよびpasswordプロパティを保持している必要があります。
  * すでにセッショントークンを保持している場合、更新処理は行いません。
  * セッショントークンの期限切れが発生している場合、一度ログアウトしてから再度ログインしてください。
  *
  * @method login
  * @param {function} callback コールバック関数
  * @return true
  */
  User.prototype.login = function(callback){
    if(this.sessionToken){
      if(callback) return callback(null, this);
      return Promise.resolve(this);
    }
    if(!this.userName || !this.password ){
      return (callback || Promise.reject.bind(Promise))(new Errors.NoAuthInfoError("To login by account, userName and password are necessary."));
    }

    return ncmb.request({
      path: "/" + ncmb.version + "/login",
      method: "GET",
      query: {
        userName: this.userName,
        password: this.password
      }
    }).then(function(data){
      var obj = null;
      try{
        obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      Object.keys(obj).forEach(function (key) {
        this[key] = obj[key];
        if(this[key] && this[key].__op) delete this[key];
      }.bind(this));

      if(callback) return callback(null, this);
      return this;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  /**
  * ログイン（セッショントークンの取得）およびカレントユーザへの設定を行います。
  * mailAddressおよびpasswordプロパティをもつUserインスタンスを第一引数に設定し、そのユーザでログイン可能です。
  * その場合、第二引数を省略可能です。
  * すでにセッショントークンを保持している場合、更新処理は行いません。
  * セッショントークンの期限切れが発生している場合、一度ログアウトしてから再度ログインしてください。
  *
  * @method User.loginWithMailAddress
  * @param {string} mailAddress メールアドレス
  * @param {string} password パスワード
  * @param {function} callback コールバック関数
  * @return ログインしたUserインスタンス
  */
  User.loginWithMailAddress = function(mailAddress, password, callback){
    var user = null;
    if(mailAddress instanceof ncmb.User){
      callback = password;
      user = mailAddress;
      mailAddress = user.mailAddress;
      password = user.password;
    }

    if(!mailAddress || !password ){
      return (callback || Promise.reject.bind(Promise))(new Errors.NoAuthInfoError("To login by account with mail address, mailAddress and password are necessary."));
    }
    if(!user){
      user = new User({mailAddress: mailAddress, password: password});
    }
    removeItem(CURRENT_USER_PATH);
    ncmb.sessionToken = null;

    return user.loginWithMailAddress().then(function(user){
      setItem(CURRENT_USER_PATH, JSON.stringify(user));
      ncmb.sessionToken = user.sessionToken;
      if(callback) return callback(null, user);
      return user;
    }).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  /**
  * ログイン（セッショントークンの取得）を行います。
  * カレントユーザへの設定は行いません。
  * mailAddressおよびpasswordプロパティを保持している必要があります。
  * すでにセッショントークンを保持している場合、更新処理は行いません。
  * セッショントークンの期限切れが発生している場合、一度ログアウトしてから再度ログインしてください。
  *
  * @method loginWithMailAddress
  * @param {function} callback コールバック関数
  * @return this
  */
  User.prototype.loginWithMailAddress = function(callback){
    if(this.sessionToken){
      if(callback) return callback(null, this);
      return Promise.resolve(this);
    }
    if(!this.mailAddress || !this.password ){
      return (callback || Promise.reject.bind(Promise))(new Errors.NoAuthInfoError("To login by account with mail address, mailAddress and password are necessary."));
    }

    return ncmb.request({
      path: "/" + ncmb.version + "/login",
      method: "GET",
      query: {
        mailAddress: this.mailAddress,
        password: this.password
      }
    }).then(function(data){
      var obj = null;
      try{
        obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      Object.keys(obj).forEach(function (key) {
        this[key] = obj[key];
        if(this[key] && this[key].__op) delete this[key];
      }.bind(this));

      if(callback) return callback(null, this);
      return this;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  /**
  * 匿名ユーザとしてログイン（セッショントークンの取得）を行います。
  * すでにセッショントークンを保持している場合、更新処理は行いません。
  * UUIDは省略可能です。省略した場合、UUIDを乱数で自動生成します。
  * UUIDにUserのインスタンスを入力し、そのインスタンスでログイン可能です。
  * その場合、userNameもしくはauthDataプロパティを持つインスタンスではログインできません。
  *
  * @method User.loginAsAnonymous
  * @param {string} uuid 端末固有のUUID
  * @param {function} callback コールバック関数
  * @return ログインしたUserインスタンス
  */
  User.loginAsAnonymous = function(uuid, callback){
    var user = null;
    if(typeof uuid === "function"){
      callback = uuid;
      uuid = null;
    }
    if(uuid instanceof ncmb.User){
      user = uuid;
      uuid = null;
    }
    if(!user){
      user = new User();
    }
    removeItem(CURRENT_USER_PATH);
    ncmb.sessionToken = null;

    return user.loginAsAnonymous(uuid).then(function(user){
      setItem(CURRENT_USER_PATH, JSON.stringify(user));
      ncmb.sessionToken = user.sessionToken;
      if(callback) return callback(null, user);
      return user;
    }).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  /**
  * 匿名ユーザとしてログイン（セッショントークンの取得）を行います。
  * すでにセッショントークンを保持している場合、更新処理は行いません。
  * UUIDは省略可能です。省略した場合、UUIDを乱数で自動生成します。
  * userNameもしくはauthDataプロパティを持つインスタンスではログインできません。
  *
  * @method loginAsAnonymous
  * @param {string} uuid 端末固有のUUID
  * @param {function} callback コールバック関数
  * @return this
  */
  User.prototype.loginAsAnonymous = function(uuid, callback){
    if(typeof uuid === "function"){
      callback = uuid;
      uuid = null;
    }
    if(this.sessionToken){
      if(callback) return callback(null, this);
      return Promise.resolve.bind(Promise)(this);
    }
    if(this.userName){
      return ( callback || Promise.reject.bind(Promise))(new Errors.ContentsConflictError("To login as anonymous, user cannot have arbitrary userName."));
    }
    if(this.authData && !this.authData.anonymous){
      return ( callback || Promise.reject.bind(Promise))(new Errors.InvalidAuthInfoError("To login as anonymous, user cannot have other SNS authData."));
    }
    if(!uuid){
      if(this.authData && this.authData.anonymous && this.authData.anonymous.id){
        uuid = this.authData.anonymous.id;
      } else if (this.uuid){
        uuid = this.uuid;
      } else{
        uuid = getDeviceId();
      }
    }
    var regexp = /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/;
    if(!regexp.test(uuid)){
      return ( callback || Promise.reject.bind(Promise))(new Errors.InvalidFormatError("Uuid format is invalid."));
    };
    this.authData = {anonymous: {id: uuid}};

    return ncmb.request({
      path: "/" + ncmb.version + this.className,
      method: "POST",
      data: this
    }).then(function(data){
      var obj = null;
      try{
        obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      Object.keys(obj).forEach(function (key) {
        this[key] = obj[key]
        if(this[key] && this[key].__op) delete this[key];
      }.bind(this));

      if(callback) return callback(null, this);
      return this;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  /**
  * SNS連携認証ユーザとしてログイン（セッショントークンの取得）およびカレントユーザへの設定を行います。
  * authDataプロパティをもつUserインスタンスを第一引数に設定し、そのユーザでログイン可能です。
  * その場合、第二引数を省略可能です。
  * また、authDataに複数のSNS連携情報を持つインスタンスを設定する場合、第二引数で認証に使用するプロバイダを指定する必要があります。
  * すでにセッショントークンを保持している場合、更新処理は行いません。
  * セッショントークンの期限切れが発生している場合、一度ログアウトしてから再度ログインしてください。
  *
  * @method User.loginWith
  * @param {string} provider 連携するサービスプロバイダ名 facebook/twitter/google
  * @param {Object} data 認証に必要な情報を保持したJSON形式のオブジェクト
  * @param {function} callback コールバック関数
  * @return ログインしたUserインスタンス
  */
  User.loginWith = function(provider, data, callback){
    var user = null;
    if(provider instanceof ncmb.User){
      user = provider;
      if(!user.authData){
        return (callback || Promise.reject.bind(Promise))(new Errors.NoOAuthDataError("If user instance is set as first argument, it must have an authData."));
      }
      if(Object.keys(user.authData).length === 1){
        if(typeof data === "function") callback = data;
        provider = null;
        data = null;
      }else{
        if(typeof data === "function"){
          callback = data;
          return (callback || Promise.reject.bind(Promise))(new Errors.NoProviderInfoError("If User that have multiple SNS authData is set as first argument, provider must be specified as second argument."));
        }else{
          provider = data;
          data = null;
        }
      }
    }else{
      user = new User();
    }
    removeItem(CURRENT_USER_PATH);
    ncmb.sessionToken = null;

    return user.loginWith(provider, data).then(function(user){
      setItem(CURRENT_USER_PATH, JSON.stringify(user));
      ncmb.sessionToken = user.sessionToken;
      if(callback) return callback(null, user);
      return user;
    }).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  /**
  * SNS連携認証ユーザとしてログイン（セッショントークンの取得）を行います。
  * authDataプロパティをもつ場合、第一・第二引数を省略可能です。
  * また、authDataに複数のSNS連携情報を持つ場合、第一引数で認証に使用するプロバイダを指定する必要があります。
  * authDataプロパティをもち、かつprovide, dataを入力した場合、入力された情報で認証を行います。
  * すでにセッショントークンを保持している場合、更新処理は行いません。
  * セッショントークンの期限切れが発生している場合、一度ログアウトしてから再度ログインしてください。
  *
  * @method User.loginWith
  * @param {string} provider 連携するサービスプロバイダ名 facebook/twitter/google
  * @param {Object} data 認証に必要な情報を保持したJSON形式のオブジェクト
  * @param {function} callback コールバック関数
  * @return this
  */
  User.prototype.loginWith = function(provider, data, callback){
    if(typeof provider === "function"){
      callback = provider;
      provider = null;
      data = null;
    }
    if(typeof data === "function"){
      callback = data;
      data = null;
    }
    if(this.sessionToken){
      if(callback) return callback(null, this);
      return Promise.resolve(this);
    }
    try {
      var _data = null;
      if(provider){
        _data = {};
        if(data){
          _data[provider] = data;
          data = _data;
        }
      }
      provider = ProviderUtil.getProvider(data || this.authData, provider);
      if(Object.keys(this.authData || data).indexOf(provider.getName()) === -1){
        throw new Errors.InvalidProviderError("This provider cannot be used to login.");
      }
      if(data && data[provider.getName()]){
        _data = this.authData || data;
        Object.keys(_data[provider.getName()]).forEach(function(key){
          if(_data[provider.getName()][key] !== data[provider.getName()][key]){
            throw new Errors.InvalidOAuthDataError("This OAuth data is invalid.");
          }
        }.bind(this));
      }
    }catch(err){
      return ( callback || Promise.reject.bind(Promise))(err);
    }

    var oauthData = { authData: {}};
    oauthData.authData[provider.getName()] = provider.getAuthData();
    return ncmb.request({
      path: "/" + ncmb.version + "/users",
      method: "POST",
      data: oauthData
    }).then(function(data){
      var obj = null;
      try{
        obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      Object.keys(obj).forEach(function (key) {
        this[key] = obj[key];
        if(this[key] && this[key].__op) delete this[key];
      }.bind(this));

      if(callback) return callback(null, this);
      return this;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  /**
  * カレントユーザ情報およびセッショントークンの破棄を行います。
  * カレントユーザに設定されていたインスタンス自体のセッショントークン情報は保持され続けます。
  * 別途プロトタイプメソッドでインスタンスのログアウトを実行してください。
  *
  * @method User.logout
  * @param {function} callback コールバック関数
  * @return ログアウトしたユーザインスタンス
  */
  User.logout = function(callback){
    var user = new ncmb.User({sessionToken:ncmb.sessionToken});
    return user.logout(callback);
  };

  /**
  * インスタンスのセッショントークンの破棄を行います。
  * カレントユーザに設定されているユーザをこのメソッドでログアウトした場合でもカレントユーザ情報は破棄されません。
  * そのままAPIリクエストを行った場合、不正なセッショントークン利用でエラーが返ります。
  *
  * @method logout
  * @param {function} callback コールバック関数
  * @return this
  */
  User.prototype.logout = function(callback){
    if(!this.sessionToken){
      return (callback || Promise.reject.bind(Promise))(new Errors.NoSessionTokenError("This user doesn't login."));
    }
    var currentSessionToken = ncmb.sessionToken;
    if(currentSessionToken !== this.sessionToken) ncmb.sessionToken = this.sessionToken;
    return ncmb.request({
      path: "/" + ncmb.version + "/logout",
      method: "GET"
    }).then(function(){
      if(currentSessionToken === this.sessionToken){
        removeItem(CURRENT_USER_PATH);
        ncmb.sessionToken = null;
      }else{
        ncmb.sessionToken = currentSessionToken;
      }
      this.sessionToken = null;
      if(callback) return callback(null, this);
      return this;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  var monaca = null;
  var getDeviceId = function(){
    if(monaca && monaca.getDeviceId){
      return monaca.getDeviceId();
    }
    var S4 = function(){
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  };

  var makeStoragePath = function(key, apikey){
    var path = "NCMB/" + apikey + "/" + key;
    return path;
  };

  var setItem = function(key, value){
    try{
      localStorage.setItem(makeStoragePath(key, ncmb.apikey), value);
    }catch(err){
      throw err;
    }
  };
  var getItem = function(key){
    try{
      return localStorage.getItem(makeStoragePath(key, ncmb.apikey));
    }catch(err){
      return null;
    }
  };
  var removeItem = function(key){
    try{
      return localStorage.removeItem(makeStoragePath(key, ncmb.apikey));
    }catch(err){
      return null;
    }
  };

  ncmb.collections[className] = User;
  return User;
};
