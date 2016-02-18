"use strict";

var qs = require("qs");
var Errors = require("./errors");

/**
* オブジェクトの検索を行うモジュールです。
*
* DataStore, User, Role, Fileクラスから呼び出し、それぞれのクラスメソッドとして利用します。
* 検索条件を設定するメソッドに続けてfetch/fetchAllをメソッドチェーンで実行して利用します。
* 
* @class Query
* @constructor
*/
var Query = module.exports = (function(){
  function Query(ncmb, className){
    this.__proto__.ncmb = ncmb;
    this._className = className;
    this._where  = {};
    this._limit  = 0;
    this._skip = 0;
  };

  /**
  * クエリを自分で記述して設定します。
  *
  * @method where
  * @param {Object} where JSON形式のクエリオブジェクト
  * @return this
  */
  Query.prototype.where = function(where){
    if(typeof where !== "object")
      throw new Errors.InvalidWhereError("First argument must object.");
    for(var key in where){
      if(where.hasOwnProperty(key)){
        this._where[key] = where[key];
      }
    }
    return this;
  };

  /**
  * 指定したキーの値が条件と等しいオブジェクトを検索します。
  *
  * @method equalTo
  * @param {string} key 値を比較するキー
  * @param value 比較する値
  * @return this
  */
  Query.prototype.equalTo              = function(key, value){
    return setOperand(this, key, value);
  };

  /**
  * 指定したキーの値が条件と等しくないオブジェクトを検索します。
  *
  * @method notEqualTo
  * @param {string} key 値を比較するキー
  * @param value 比較する値
  * @return this
  */
  Query.prototype.notEqualTo           = function(key, value){
    return setOperand(this, key, value, "$ne");
  };

  /**
  * 指定したキーの値が条件より小さいオブジェクトを検索します。
  *
  * @method lessThan
  * @param {string} key 値を比較するキー
  * @param value 比較する値
  * @return this
  */
  Query.prototype.lessThan             = function(key, value){
    return setOperand(this, key, value, "$lt");
  };

  /**
  * 指定したキーの値が条件以下のオブジェクトを検索します。
  *
  * @method lessThanOrEqualTo
  * @param {string} key 値を比較するキー
  * @param value 比較する値
  * @return this
  */
  Query.prototype.lessThanOrEqualTo    = function(key, value){
    return setOperand(this, key, value, "$lte");
  };

  /**
  * 指定したキーの値が条件より大きいオブジェクトを検索します。
  *
  * @method greaterThan
  * @param {string} key 値を比較するキー
  * @param value 比較する値
  * @return this
  */
  Query.prototype.greaterThan          = function(key, value){
    return setOperand(this, key, value, "$gt");
  };

  /**
  * 指定したキーの値が条件以上のオブジェクトを検索します。
  *
  * @method greaterThanOrEqualTo
  * @param {string} key 値を比較するキー
  * @param value 比較する値
  * @return this
  */
  Query.prototype.greaterThanOrEqualTo = function(key, value){
    return setOperand(this, key, value, "$gte");
  };

  /**
  * 指定したキーの値が、条件の配列内のいずれかと等しいオブジェクトを検索します。
  *
  * @method in
  * @param {string} key 値を比較するキー
  * @param {Array} values 比較する値
  * @return this
  */
  Query.prototype.in                   = function(key, values){
    if(!Array.isArray(values)) throw new Errors.InvalidArgumentError();
    return setOperand(this, key, values, "$in");
  };

  /**
  * 指定したキーの値が、条件の配列内のいずれとも等しくないオブジェクトを検索します。
  *
  * @method notIn
  * @param {string} key 値を比較するキー
  * @param {Array} values 比較する値
  * @return this
  */
  Query.prototype.notIn                = function(key, values){
    if(!Array.isArray(values)) throw new Errors.InvalidArgumentError();
    return setOperand(this, key, values, "$nin");
  };

  /**
  * 指定したキーに値が存在するオブジェクトを検索します。
  * valueにfalseが設定されている場合、指定したキーに値が存在しないオブジェクトを検索します。
  *
  * @method exist
  * @param {string} key 値を比較するキー
  * @param {boolean} exist falseを設定した場合、値が存在しないオブジェクトを検索する。省略可能。
  * @return this
  */
  Query.prototype.exists               = function(key, exist){
    if(typeof exist !== "boolean") throw new Errors.InvalidArgumentError();
    return setOperand(this, key, exist, "$exists");
  };

  /**
  * 指定したキーの値が指定した正規表現に合致する存在するオブジェクトを検索します。
  *
  * @method regularExpressionTo
  * @param {string} key 値を比較するキー
  * @param {string} regex 検索する正規表現
  * @return this
  */
  Query.prototype.regularExpressionTo  = function(key, regex){
    if(typeof regex !== "string") throw new Errors.InvalidArgumentError();
    return setOperand(this, key, regex, "$regex");
  };

  /**
  * 指定したキーの配列内の値のいずれかが、条件の配列内のいずれかと等しいオブジェクトを検索します。
  *
  * @method inArray
  * @param {string} key 値を比較するキー
  * @param {Array} values 比較する値
  * @return this
  */
  Query.prototype.inArray              = function(key, values){
    if(!Array.isArray(values)) values = [values];
    return setOperand(this, key, values, "$inArray");
  };

  /**
  * 指定したキーの配列内の値が、条件の配列内のいずれとも等しくないオブジェクトを検索します。
  *
  * @method notInArray
  * @param {string} key 値を比較するキー
  * @param {Array} values 比較する値
  * @return this
  */
  Query.prototype.notInArray           = function(key, values){
    if(!Array.isArray(values)) values = [values];
    return setOperand(this, key, values, "$ninArray");
  };

  /**
  * 指定したキーの配列内の値が、条件の配列内のすべての値を含むオブジェクトを検索します。
  *
  * @method allInArray
  * @param {string} key 値を比較するキー
  * @param {Array} values 比較する値
  * @return this
  */
  Query.prototype.allInArray           = function(key, values){
    if(!Array.isArray(values)) values = [values];
    return setOperand(this, key, values, "$all");
  };

  /**
  * 指定したキーの位置情報が指定した位置に近い順でオブジェクトを検索します。
  *
  * @method near
  * @param {string} key 値を比較するキー
  * @param {ncmb.GeoPoint} location 原点とする位置情報
  * @return this
  */
  Query.prototype.near  = function(key, location){
    if(!(location instanceof this.ncmb.GeoPoint)){
      throw new this.ncmb.Errors.InvalidArgumentError("Second argument must be instance of ncmb.GeoPoint.");
    }
    return setOperand(this, key, location.toJSON(), "$nearSphere");
  };

  /**
  * 検索範囲内(Km)で、指定したキーの位置情報が指定した位置に近い順でオブジェクトを検索します。
  *
  * @method withinKilometers
  * @param {string} key 値を比較するキー
  * @param {ncmb.GeoPoint} location 原点とする位置情報
  * @param {number} maxDistance 原点からの検索範囲(Km)
  * @return this
  */
  Query.prototype.withinKilometers = function(key, location, maxDistance){
    if(!(location instanceof this.ncmb.GeoPoint)){
      throw new Errors.InvalidArgumentError("Location must be instance of ncmb.GeoPoint.");
    }
    setOperand(this, key, location.toJSON(), "$nearSphere");
    this._where[key]["$maxDistanceInKilometers"] = maxDistance;
    return this;
  };

  /**
  * 検索範囲内(ml)で、指定したキーの位置情報が指定した位置に近い順でオブジェクトを検索します。
  *
  * @method withinMiles
  * @param {string} key 値を比較するキー
  * @param {ncmb.GeoPoint} location 原点とする位置情報
  * @param {number} maxDistance 原点からの検索範囲(ml)
  * @return this
  */
  Query.prototype.withinMiles = function(key, location, maxDistance){
    if(!(location instanceof this.ncmb.GeoPoint)){
      throw new Errors.InvalidArgumentError("Location must be instance of ncmb.GeoPoint.");
    }
    setOperand(this, key, location.toJSON(), "$nearSphere");
    this._where[key]["$maxDistanceInMiles"] = maxDistance;
    return this;
  };

  /**
  * 検索範囲内(rad)で、指定したキーの位置情報が指定した位置に近い順でオブジェクトを検索します。
  *
  * @method withinRadians
  * @param {string} key 値を比較するキー
  * @param {ncmb.GeoPoint} location 原点とする位置情報
  * @param {number} maxDistance 原点からの検索範囲(rad)
  * @return this
  */
  Query.prototype.withinRadians = function(key, location, maxDistance){
    if(!(location instanceof this.ncmb.GeoPoint)){
      throw new Errors.InvalidArgumentError("Location must be instance of ncmb.GeoPoint.");
    }
    setOperand(this, key, location.toJSON(), "$nearSphere");
    this._where[key]["$maxDistanceInRadians"] = maxDistance;
    return this;
  };

  /**
  * 検索範囲を南西と北東の位置情報から矩形で設定し、指定したキーの位置情報が指定した位置に近い順でオブジェクトを検索します。
  *
  * @method withinSquare
  * @param {string} key 値を比較するキー
  * @param {ncmb.GeoPoint} southWestVertex 検索矩形の南西側の頂点
  * @param {ncmb.GeoPoint} northEastVertex 検索矩形の北東側の頂点
  * @return this
  */
  Query.prototype.withinSquare = function(key, southWestVertex, northEastVertex){
    if(!(southWestVertex instanceof this.ncmb.GeoPoint) || !(northEastVertex instanceof this.ncmb.GeoPoint)){
      throw new Errors.InvalidArgumentError("Location must be instance of ncmb.GeoPoint.");
    }
    var box = {"$box":[southWestVertex.toJSON(), northEastVertex.toJSON()]};
    setOperand(this, key, box, "$within");
    return this;
  };

  /**
  * 複数の検索条件を設定し、いずれかに合致するオブジェクトを検索します。
  * 配列で複数の条件を一度に設定でき、複数回実行することで検索条件を追加できます。
  *
  * @method or
  * @param {Array/Query} subqueries 検索条件
  * @return this
  */
  Query.prototype.or = function(subqueries){
    if(!Array.isArray(subqueries)){
      subqueries = [subqueries];
    }
    this._where        = this._where        || {};
    this._where["$or"] = this._where["$or"] || [];
    for(var i = 0; i < subqueries.length; i++){
      if(!subqueries[i]._where) throw new Errors.InvalidArgumentError("Argument is invalid. Input query or array of query.");
      this._where["$or"].push(subqueries[i]._where);
    }
    return this;
  };

  /**
  * サブクエリの検索結果が指定したサブキーに持つ値のいずれかと、指定したキーが合致するオブジェクトを検索します。
  *
  * @method select
  * @param {string} key メインクエリのクラスで値を比較するキー
  * @param {string} subkey サブクエリの検索結果で値を比較するキー
  * @param {Array/Query} subqueries 検索条件
  * @return this
  */
  Query.prototype.select = function(key, subkey, subquery){
    if(typeof key !== "string" || typeof subkey !== "string"){
      throw new Errors.InvalidArgumentError("Key and subkey must be string");
    }
    if(!subquery._className) throw new Errors.InvalidArgumentError("Third argument is invalid. Input query.");
    var className = null;
    if(subquery._className === "/users"){
      className = "user";
    }else if(subquery._className === "/roles"){
      className = "role";
    }else if(subquery._className === "/installations"){
      className = "installation";
    }else if(subquery._className === "/files"){
      className = "file";
    }else{
      className = subquery._className.slice(9);
    }
    this._where                 = this._where      || {};
    this._where[key]            = this._where[key] || {};
    this._where[key]["$select"] = {query:{className: className, where: subquery._where} , key: subkey};
    return this;
  };

  /**
  * 入力したオブジェクトの指定したキーに関連づけられているオブジェクトを検索します。
  * objectはmobile backend に保存済みである必要があります。
  *
  * @method relatedTo
  * @param object 
  * @param {string} key オブジェクトが関連づけられているキー
  * @return this
  */
  Query.prototype.relatedTo = function(object, key){
    var className = null;
    if(typeof key !== "string") throw new Errors.InvalidArgumentError("Key must be string.");
    if(!object.className)       throw new Errors.InvalidArgumentError("First argument requires saved object.");
    if(!object.objectId){
      throw new Errors.NoObjectIdError("First argument requires saved object.");
    }
    if(object instanceof this.ncmb.User){
      className = "user";
    }else if(object instanceof this.ncmb.Role){
      className = "role";
    }else if(object instanceof this.ncmb.Installation){
      className = "installation";
    }else{
      className = object.className.slice(9);
    }
    this._where = this._where || {};
    this._where["$relatedTo"] = {object: {__type: "Pointer", className: className, objectId: object.objectId}, key: key};
    return this;
  };

  /**
  * サブクエリの検索結果のいずれかを、指定したキーにポインタで持つオブジェクトを検索します。
  * objectはmobile backend に保存済みである必要がある。
  *
  * @method inQuery
  * @param {string} key ポインタを保存したキー
  * @param {Query} subquery 検索条件
  * @return this
  */
  Query.prototype.inQuery = function(key, subquery){
    if(typeof key !== "string") throw new Errors.InvalidArgumentError("Key must be string.");
    if(!subquery._className)    throw new Errors.InvalidArgumentError("Second argument is invalid. Input query.");
    var className = null;
    if(subquery._className === "/users"){
      className = "user";
    }else if(subquery._className === "/roles"){
      className = "role";
    }else if(subquery._className === "/installations"){
      className = "installation";
    }else if(subquery._className === "/files"){
      className = "file";
    }else{
      className = subquery._className.slice(9);
    }
    this._where = this._where || {};
    this._where[key] = this._where[key] ||{};
    this._where[key]["$inQuery"]= {where: subquery._where, className: className};
    return this;
  };

  /**
  * 指定したキーに設定されているポインタの中身ごと検索結果を取得します。
  * 複数回実行した場合、最後に設定したキーが反映されます。複数のキーを指定することはできません。
  *
  * @method include
  * @param {string} key ポインタの中身を取得するキー
  * @return this
  */
  Query.prototype.include = function(key){
    if(typeof key !== "string") throw new Errors.InvalidArgumentError("Key must be string.");
    this._include = key;
    return this;
  };

  /**
  * 検索結果の配列と共に、検索結果の件数を取得します。
  * 検索結果の配列は最大100件までしか取得しませんが、countは検索結果の総件数を表示します。
  * 検索結果配列にcountプロパティとして付加されます。
  *
  * @method count
  * @return this
  */
  Query.prototype.count = function(){
    this._count = 1;
    return this;
  };

  /**
  * 指定したキーの昇順にソートして検索結果を取得します。
  * 複数回実行することで、複数のキーを指定できます。その場合、先に指定したキーが優先的にソートされます。
  * フラグによって降順ソートも可能です。降順フラグはキーごとに設定できます。
  *
  * @method order
  * @param {string} key ソートするキー
  * @param descending trueを指定した場合、降順でソートされる。省略可能。
  * @return this
  */
  Query.prototype.order = function(key, descending){
    var symbol = "";
    if(typeof key !== "string") throw new Errors.InvalidArgumentError("Key must be string.");
    if(descending && typeof descending !== "boolean"){
      throw new Errors.InvalidArgumentError("Second argument must be boolean.");
    }
    if(descending === true) symbol = "-";
    if(!this._order){
      this._order = symbol + key;
    }else{
      this._order = this._order + "," + symbol + key;
    }
    return this;
  };

  /**
  * 検索結果の最大取得数を設定します。最小設定値は1、最大設定値は1000です。
  *
  * @method limit
  * @param {number} limit 最大取得件数
  * @return this
  */
  Query.prototype.limit = function(limit){
    if(typeof limit !== "number"){
      throw new Errors.InvalidLimitError("Limit must be number.");
    }
    if(limit < 1 || limit >1000){
      throw new Errors.InvalidLimitError("Limit must be renge of 1~1000.");
    }
    this._limit = limit;
    return this;
  };

  /**
  * 検索結果の最初から指定した件数だけ除いた結果を取得するようにします。
  *
  * @method skip
  * @param {number} skip 検索結果から除く件数
  * @return this
  */
  Query.prototype.skip = function(skip){
    if(typeof skip !== "number") throw new Errors.InvalidskipError("Skip must be number.");
    if(skip < 0) throw new Errors.InvalidskipError("Skip must be greater than 0.");
    this._skip = skip;
    return this;
  };

  /**
  * objectIdから一意のオブジェクトを取得します。
  *
  * @method fetchById
  * @param {string} id 取得したいオブジェクトのobjectId
  * @param {function} callback コールバック関数
  * @return オブジェクト
  */
  Query.prototype.fetchById = function(id, callback){
    var path = "/" + this.ncmb.version + this._className + "/" + id;
    var Klass = this.ncmb.collections[this._className];
    if(typeof Klass === "undefined"){
      return Promise.reject(new Error("no class definition `" + this._className +"`"));
    }

    return this.ncmb.request({
      path: path,
      method: "GET"
    }).then(function(data){
      var obj = null;
      try{
        obj = JSON.parse(data);
      }catch(err){
        throw err;
      }
      var object = new Klass(obj);
      if(object.acl) object.acl = new this.ncmb.Acl(object.acl);
      if(callback) return callback(null, object);
      return object;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  /**
  * 検索条件に合致するオブジェクトのうち、先頭の一つだけを取得します。
  *
  * @method fetch
  * @param {function} callback コールバック関数
  * @return {Object} 検索結果に合致したオブジェクト
  */
  Query.prototype.fetch = function(callback){
    this._limit = 1;
    return this.fetchAll().then(function(objects){
      if(!objects[0]){
        if(callback) return callback(null, {});
        return {};
      }
      if(callback) return callback(null, objects[0]);
      return objects[0];
    }).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  /**
  * 検索条件に合致するオブジェクトをすべて取得します。
  *
  * @method fetchAll
  * @param {function} callback コールバック関数
  * @return {Array} 検索結果に合致したオブジェクトの配列
  */
  Query.prototype.fetchAll = function(callback){
    var path = "/" + this.ncmb.version + this._className;
    var opts = [];
    if(Object.keys(this._where).length !== 0) opts.push("where=" + JSON.stringify(this._where));
    if(this._limit)    opts.push("limit="   + this._limit);
    if(this._skip)     opts.push("skip="    + this._skip);
    if(this._count)    opts.push("count="   + this._count);
    if(this._include)  opts.push("include=" + this._include);
    if(this._order)    opts.push("order="   + this._order);

    var Klass = this.ncmb.collections[this._className];
    if(typeof Klass === "undefined"){
      return Promise.reject(new Error("no class definition `" + this._className +"`"));
    }
    return this.ncmb.request({
      path: path,
      method: "GET",
      query: qs.parse(opts.join("&"))
    }).then(function(data){
      var objects = null;
      try{
        objects = JSON.parse(data).results;
        objects = objects.map(function(obj){
          if(Klass.className === "/files") return obj;
          var object = new Klass(obj);
          if(object.acl) object.acl = new this.ncmb.Acl(object.acl);
          return object;
        }.bind(this));
        var parsedData = JSON.parse(data)
        if("count" in parsedData){
          objects.count = parsedData.count;
        }
      }catch(err){
        if(callback) return callback(err, null);
        throw err;
      }
      if(callback) return callback(null, objects);
      return objects;
    }.bind(this)).catch(function(err){
      if(callback) return callback(err, null);
      throw err;
    });
  };

  var setOperand = function(query, key, value, operand){
    if(typeof key !== "string"){
      throw new Errors.InvalidArgumentError("Key must be string.");
    }
    if(value instanceof Date) {
      value = {__type: "Date", iso: value.toJSON()};
    }
    if(operand === undefined){
      query._where      = query._where || {};
      query._where[key] = value;
      return query;
    }
    query._where               = query._where      || {};
    query._where[key]          = query._where[key] || {};
    query._where[key][operand] = value;
    return query;
  };
  return Query;
})();
