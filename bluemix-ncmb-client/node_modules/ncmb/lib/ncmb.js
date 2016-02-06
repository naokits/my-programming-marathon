"use strict";

var NCMB = module.exports = (function(){
  var modifiables = [
    "collections", "version", "fqdn", "port", "protocol", "proxy",
    "signatureMethod", "signatureVersion", "apikey", "clientkey"];
  var isModifiable = function(key){
    if(modifiables.indexOf(key) === -1) return false;
    return true;
  };

/**
* すべてのNCMBクラスおよびメソッドを定義します。
* 
* @class NCMB
* @constructor
* @param {string} apikey アプリケーションキー。必須
* @param {string} clientkey クライアントキー。必須
* @param {Object} config 通信設定。省略可能
*/
  function NCMB (apikey, clientkey, config){
    if(!apikey || !clientkey){
      throw new Error("apikey and clientkey required");
    }

    this.apikey           = apikey;
    this.clientkey        = clientkey;

    if(!config) config = {};
    this.collections      = config.collections || {};
    this.version          = config.version || "2013-09-01";
    this.fqdn             = config.fqdn || "mb.api.cloud.nifty.com";
    this.port             = config.port || 443;
    this.protocol         = config.protocol || "https:";
    this.signatureMethod  = config.signatureMethod || "HmacSHA256";
    this.signatureVersion = config.signatureVersion || 2;

    this.__proto__.User         = require("./user")(this);
    this.__proto__.Role         = require("./role")(this);
    this.__proto__.File         = require("./file")(this);
    this.__proto__.Push         = require("./push")(this);
    this.__proto__.Installation = require("./installation")(this);
    this.__proto__.Acl          = require("./acl")(this);
    this.__proto__.GeoPoint     = require("./geopoint")(this);
    this.__proto__.Relation     = require("./relation")(this);
    this.__proto__.Errors       = require("./errors");
  }

  /**
  * 指定したキーに値を設定します。
  *
  * @method set
  * @param {string} key 値を設定したいキー
  * @param value キーに設定する値
  * @return this
  */
  NCMB.prototype.set = function(key, val){
    if(!isModifiable(key))
      throw new this.Errors.UnmodifiableVariableError(key + " cannot be set, it is reserved.");
    this[key] = val;
    return this;
  };

  /**
  * 指定したキー設定されている値を取得します。
  *
  * @method get
  * @param {string} key 値を取得したいキー
  * @return this[key] keyに対応する値 
  */
  NCMB.prototype.get = function(key){
    return this[key];
  };

  NCMB.prototype.createSignature = require("./signature").create;

  NCMB.prototype.request = require("./request");

  NCMB.prototype.DataStore = require("./datastore");
  return NCMB;
})();

if (typeof define === 'function' && define.amd) {
  define([], NCMB);
}
if(typeof window !== "undefined"){
  window.NCMB = NCMB;
}
