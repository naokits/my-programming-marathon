"use strict";

var Errors = require("./errors");

/**
* 更新時に、既に保存されている値に対して操作を行うオペランドを扱うモジュールです。（set, getは更新時以外も利用可能。）
*
* DataStore, User, Role, Installation クラスから呼び出し、それぞれのプロトタイプメソッドとして利用します。
* 
* @class Operation
* @constructor
*/
var Operation = module.exports = (function(){
  var reserved = [];
  function Operation(reservedWords){
    reserved = reservedWords;
  };
  var isReserved = function(key){
    return reserved.indexOf(key) > -1;
  };

  /**
  * 指定したキー設定されている値を取得します。
  *
  * @method get
  * @param {string} key 値を取得したいキー
  * @return this[key] keyに対応する値 
  */
  Operation.prototype.get = function(key){
    if(typeof key !== "string") throw new Errors.InvalidArgumentError("Key must be string.");
    return this[key];
  };

  /**
  * 指定したキーに値を設定します。
  *
  * @method set
  * @param {string} key 値を設定したいキー
  * @param value キーに設定する値
  * @return this
  */
  Operation.prototype.set = function(key, value){
    if(typeof key !== "string") throw new Errors.InvalidArgumentError("Key must be string.");
    if(isReserved(key))         throw new Errors.UnReplaceableKeyError(key + " cannot be set, it is reserved.");
    this[key] = value;
    return this;
  };

  /**
  * 更新時に、指定したキーの値を指定分だけ増加させる設定をします。
  *
  * @method setIncrement
  * @param {string} key 処理を設定したいキー
  * @param {number} amount 更新時の増加量。省略可能で、その場合は1が設定される
  * @return this
  */
  Operation.prototype.setIncrement = function(key, amount){
    if(isReserved(key)){
      throw new Errors.UnReplaceableKeyError(key + " cannot be set, it is reserved.");
    }
    if(amount && typeof amount !== "number"){
      throw new Errors.InvalidArgumentError("Set amount by number");
    }
    if(this[key] && this[key].__op === "Increment"){
      this[key].amount += amount || 1;
      return this;
    }
    this[key] = {__op: "Increment", amount: amount || 1};
    return this;
  };

  /**
  * 更新時に、指定したキーの配列末尾にオブジェクトを追加する設定をします。
  * objectsは単一オブジェクトおよび配列での複数指定が共に可能。
  * 複数回実行することで、objects末尾にさらにオブジェクトを追加することも可能。
  *
  * @method add
  * @param {string} key 処理を設定したいキー
  * @param  objects 更新時に配列に追加する値もしくは値の配列
  * @return this
  */
  Operation.prototype.add = function(key, objects){
    if(isReserved(key)){
      throw new Errors.UnReplaceableKeyError(key + " cannot be set, it is reserved.");
    }
    if(!objects){
      throw new Error("objects are required");
    }
    if(!Array.isArray(objects)){
      objects = [objects];
    }
    if(this[key] && this[key].__op === "Add"){
      for(var i in objects){
        this[key].objects.push(objects[i]);
      }
      return this;
    }
    this[key] = {__op: "Add", objects: objects};
    return this;
  };

  /**
  * 更新時に、指定したキーの配列末尾に、重複したデータを避けてオブジェクトを追加する設定をします。
  * objectsは単一オブジェクトおよび配列での複数指定が共に可能。
  * 複数回実行することで、objects末尾にさらにオブジェクトを追加することも可能。
  *
  * @method addUnique
  * @param {string} key 処理を設定したいキー
  * @param  objects 配列に追加する値もしくは値の配列。既にobjectsにある値を追加しようとした場合エラーが返る
  * @return this
  */
  Operation.prototype.addUnique = function(key, objects){
    if(isReserved(key)){
      throw new Errors.UnReplaceableKeyError(key + " cannot be set, it is reserved.");
    }
    if(!objects){
      throw new Error("Objects are required.");
    }
    if(!Array.isArray(objects)){
      objects = [objects];
    }
    if(!this[key] || this[key].__op !== "AddUnique"){
      this[key] = {__op: "AddUnique",objects:[]};
    }
    var checkUnique = new Set(this[key].objects);
    var isDuplicated = false;
    for(var i in objects){
      if(checkUnique.has(objects[i])){
        isDuplicated = true;
        continue;
      }
      this[key].objects.push(objects[i]);
      checkUnique.add(objects[i]);
    }
    if(isDuplicated){
      throw new Errors.DuplicatedInputError("Input objects are duplicated.");
    }
    return this;
  };

  /**
  * 更新時に、指定したキーの配列からオブジェクトを削除する設定をします。
  * objectsは単一オブジェクトおよび配列での複数指定が共に可能。
  * 複数回実行することで、objects末尾にさらにオブジェクトを追加することも可能。
  *
  * @method remove
  * @param {string} key 処理を設定したいキー
  * @param  objects 配列から削除する値もしくは値の配列
  * @return this
  */
  Operation.prototype.remove = function(key, objects){
    if(isReserved(key)){
      throw new Errors.UnReplaceableKeyError(key + " cannot be set, it is reserved.");
    }
    if(!objects){
      throw new Error("Objects are required.");
    }
    if(!Array.isArray(objects)){
      objects = [objects];
    }
    if(this[key] && this[key].__op === "Remove"){
      for(var i in objects){
        this[key].objects.push(objects[i]);
      }
      return this;
    }
    this[key] = {__op: "Remove", objects: objects};
    return this;
  };
  return Operation;
})();
