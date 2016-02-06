"use strict";
var objectAssign = require('object-assign');
var Errors       = require("./errors");
var Query        = require("./query");
var Operation    = require("./operation");

/**
* プッシュ配信端末の操作を扱うクラスです。
* 
* @class NCMB.Installation
* @constructor
* @param {Object} attrs インスタンス生成時に設定するプロパティ
*/
var Installation = module.exports = function(ncmb){

  var reserved = [
    "update", "delete", "className"
    ];
  var isReserved = function(key){
    return reserved.indexOf(key) > -1;
  };

  var unreplaceable =[
    "objectId", "createDate", "updateDate", "_id"
  ];

  var isReplaceable = function(key){
    if(unreplaceable.indexOf(key) === -1) return true;
    return false;
  };

  function Installation(attrs){
    for(var attr in attrs){
      if(attrs.hasOwnProperty(attr)){
        if(!isReserved(attr)){
          this[attr] = attrs[attr];
        }else{
          throw new Errors.UnmodifiableVariableError(attr + " cannot be set, it is reserved.");
        }
      }
    }
  };
  var className = Installation.prototype.className = "/installations";

  Object.keys(Query.prototype).forEach(function(attr){
    if(attr !== "batch" && typeof Query.prototype[attr] === "function"){
      Installation[attr] = function(){
        var query = new Query(ncmb, className);
        return query[attr].apply(query, [].slice.apply(arguments));
      };
    }
  });
  Object.keys(Operation.prototype).forEach(function(attr){
    if(typeof Operation.prototype[attr] === "function"){
      Installation.prototype[attr] = function(){
        var operation = new Operation(reserved);
        return operation[attr].apply(this, [].slice.apply(arguments));
      };
    }
  });

  /**
  * 配信端末情報を削除します。
  *
  * @method delete
  * @param {function} callback コールバック関数
  * @return true
  */
  Installation.prototype.delete = function(callback){
    if(!this.objectId){
      var err = new Errors.NoObjectIdError("Save the object before deleting");
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
  * 配信端末情報を更新します。
  *
  * @method update
  * @param {function} callback コールバック関数
  * @return this
  */
  Installation.prototype.update = function(callback){
    if(!this.objectId) {
      return (callback || Promise.reject.bind(Promise))(new Errors.NoObjectIdError("Updated object must be saved before."));
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

  ncmb.collections[className] = Installation;
  return Installation;
};
