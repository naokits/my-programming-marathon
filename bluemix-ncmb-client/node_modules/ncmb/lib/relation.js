"use strict";
var errors = require("./errors");

/**
* リレーションについて扱うクラスです。
*
* オブジェクトのプロパティに対してインスタンスを設定することで、同一クラスに限り複数のオブジェクトを関連づけることができます。
* 関連づけるオブジェクトがすべて同一クラスであれば、関連づけられるオブジェクトとは別クラスでも指定可能です。
*
* インスタンス生成時に関連づけるクラス名を指定可能です。指定しなかった場合、最初に追加したオブジェクトのクラスが指定されます。
* 指定した以外のクラスのインスタンスを入力した場合、エラーが返ります。
* 
* @class NCMB.Relation
* @constructor
* @param {string} relatingClass 関連づけるクラス名。省略可能
*/
var Relation = module.exports = function(ncmb){
  function Relation(relatingClass){
    if(relatingClass === "user"){
      this.relatingClass = "/users";
    }else if(relatingClass === "role"){
      this.relatingClass = "/roles";
    }else if(relatingClass === "installation"){
      this.relatingClass = "/installations";
    }else if(relatingClass){
      this.relatingClass = "/classes/" + relatingClass;
    }
  }

  /**
  * 関連オブジェクトに追加するオブジェクトを設定します。
  *
  * @method addRelation
  * @param object 追加するオブジェクト
  * @return this
  */

  /**
  * 関連オブジェクトから削除するオブジェクトを設定します。
  *
  * @method removeRelation
  * @param object 削除するオブジェクト
  * @return this
  */
  ["add", "remove"].forEach(function(method){
    var opName = method[0].toUpperCase() + method.substr(1) + "Relation";
    Relation.prototype[method] = function(object){
      if(this.__op !== opName){
        this.__op = opName;
        this.objects = [];
      }
      if(!Array.isArray(object)) object = [object];
      for (var i = 0, elem; elem = object[i]; i+=1) {
        pushToObjects(this, elem);
      }
      return this;
    };
  });

  var pushToObjects = function(relation, object){
    if(!object.className){
      throw new errors.InvalidArgumentError("Related object must be instance of ncmb providing classes.");
    }
    if(!relation.relatingClass){
        relation.relatingClass = object.className;
    }else if(relation.relatingClass !== object.className){
      throw new errors.DifferentClassError("Relation objects can be input just from instance of same class with first input.");
    }
    relation.objects.push(object);
  };

  ncmb.collections.Relation = Relation;
  return Relation;
};
