"use strict";
var objectAssign = require('object-assign');
var Errors       = require("./errors");
var Query        = require("./query");

/**
* プッシュ通知の操作を扱うクラスです。
* 
* @class NCMB.Push
* @constructor
* @param {Object} attrs インスタンス生成時に設定するプロパティ
*/
var Push = module.exports = function(ncmb){
  var modifiables = [
    "deliveryTime", "immediateDeliveryFlag", "target", "searchCondition",
    "message", "userSettingValue", "deliveryExpirationDate",
    "deliveryExpirationTime", "action", "title", "dialog",
    "badgeIncrementFlag", "badgeSetting", "sound",
    "contentAvailable", "richUrl", "category", "acl"];
  var isModifiable = function(key){
    return modifiables.indexOf(key) > -1;
  };

  var reserved = ["send", "set", "update", "className"];
  var isReserved = function(key){
    return reserved.indexOf(key) > -1;
  };

  var unreplaceable =[
    "objectId", "createDate", "updateDate", "_id", "status",
    "deliveryPlanNumber", "deliveryNumber", "error"
  ];

  var isReplaceable = function(key){
    if(unreplaceable.indexOf(key) === -1) return true;
    return false;
  };

  function Push(attrs){
    for(var attr in attrs){
      if(attrs.hasOwnProperty(attr)){
        if(!isReserved(attr)){
          this[attr] = attrs[attr];
        }else{
          throw new ncmb.Errors.UnmodifiableVariableError(attr + " cannot be set, it is reserved.");
        }
      }
    }
  };
  var className = Push.prototype.className = "/push";

  Object.keys(Query.prototype).forEach(function(attr){
    if(attr !== "batch" && typeof Query.prototype[attr] === "function"){
      Push[attr] = function(){
        var query = new Query(ncmb, className);
        return query[attr].apply(query, [].slice.apply(arguments));
      };
    }
  });

  /**
  * プッシュ通知をmobile backendに登録します。
  * 即時配信フラグがtrueの場合はすぐに配信されます。
  *
  * @method send
  * @param {function} callback コールバック関数
  * @return this
  */
  Push.prototype.send = function(callback){
    return ncmb.request({
      path:   "/" + ncmb.version + this.className,
      method: "POST",
      data:   this
    }).then(function(data){
      var obj = null;
      try{
        obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      Object.keys(this).forEach(function (key) {
        if(this[key] && this[key].__op) delete this[key];
      }.bind(this));
      objectAssign(this, obj);
      if(callback) return callback(null, this);
      return this;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  /**
  * 未送信のプッシュ通知を削除します。
  *
  * @method delete
  * @param {function} callback コールバック関数
  * @return true
  */
  Push.prototype.delete = function(callback){
    if(!this.objectId){
      var err = new Errors.NoObjectIdError();
      return callback ? callback(err) : Promise.reject(err);
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
  * 未送信のプッシュ通知の内容を更新します。
  *
  * @method update
  * @param {function} callback コールバック関数
  * @return this
  */
  Push.prototype.update = function(callback){
    if(!this.objectId) {
      return (callback || Promise.reject.bind(Promise))(new Errors.NoObjectIdError("Updated object must be saved before."));
    }
    if((this.badgeSetting !== null) && (this.contentAvailable || this.badgeIncrementFlag)){
      return (callback || Promise.reject.bind(Promise))(new Errors.InvalidArgumentError("badgeSetting must be null when set with contentAvailable or badgeIncrementFlag."));
    }
    if(this.contentAvailable && this.badgeIncrementFlag){
      return (callback || Promise.reject.bind(Promise))(new Errors.InvalidArgumentError("Set true either contentAvailable or badgeIncrementFlag only."));
    }
    if(this.badgeIncrementFlag && this.target && Array.isArray(this.target) && (this.target.indexOf("ios") == -1)){
      return (callback || Promise.reject.bind(Promise))(new Errors.InvalidArgumentError("badgeIncrementFlag cannot set without target 'ios'."));
    }

    var dataToUpdate = {};
    Object.keys(this).forEach(function (key) {
      if(!isReplaceable(key)) return;
      dataToUpdate[key] = this[key];
    }.bind(this));
    return ncmb.request({
      path:   "/" + ncmb.version + this.className + "/" + this.objectId,
      method: "PUT",
      data:   dataToUpdate
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
  * 指定したキーに値を設定します。
  * 設定可能なキーはREST APIリファレンスを参照してください。
  *
  * @method set
  * @param {string} key 値を設定するキー。
  * @param value キーに設定する値
  * @return this
  */
  Push.prototype.set = function(key, val){
    if(!key) return this;
    if(typeof val === "undefined" && typeof key === "object"){
      Object.keys(key).forEach(function(k){
        this.set(k, key[k]);
      }.bind(this));
    }else{
      if(isModifiable(key)){
        this[key] = val;
      }else{
        throw new ncmb.Errors.UnmodifiableVariableError(key + " cannot be set, it is reserved.");
      }
    }
    return this;
  };

  ncmb.collections[className] = Push;
  return Push;
};
