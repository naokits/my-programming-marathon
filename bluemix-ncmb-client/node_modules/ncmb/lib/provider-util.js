"use strict";

var Errors = require("./errors");
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }, hasProp = {}.hasOwnProperty;

var capitalize = function(str){
  return str[0].toUpperCase() + str.substr(1);
};

var Provider = (function(){
  function Provider (authData){
    this.validate(authData);
    this._data = authData;
  }
  Provider.prototype.getName = function(){
    return this.providerName;
  };
  Provider.prototype.getAuthData = function(){
    return this._data;
  };
  Provider.prototype.validate = function(){
    throw new Errors.NotImplementedProviderValidationError();
  };
  return Provider;
}());

var Facebook = (function(superClass){
  extend(Facebook, superClass);
  function Facebook (){
    this.providerName = "facebook";
    return Facebook.__super__.constructor.apply(this, arguments);
  }
  Facebook.prototype.validate = function(authData){
    if(!authData.id || !authData.access_token || !authData.expiration_date){
      throw new Errors.InvalidOAuthDataError("AuthData doesn't have any necessary parameter.");
    }
  };
  return Facebook;
}(Provider));

var Twitter = (function(superClass){
  extend(Twitter, superClass);
  function Twitter (){
    this.providerName = "twitter";
    return Twitter.__super__.constructor.apply(this, arguments);
  }
  Twitter.prototype.validate = function(authData){
    if(!authData.id || !authData.screen_name || !authData.oauth_consumer_key|| !authData.consumer_secret || !authData.oauth_token || !authData.oauth_token_secret){
      throw new Errors.InvalidOAuthDataError("AuthData doesn't have any necessary parameter.");
    }
  };
  return Twitter;
}(Provider));

var Google = (function(superClass){
  extend(Google, superClass);
  function Google (){
    this.providerName = "google";
    return Google.__super__.constructor.apply(this, arguments);
  }
  Google.prototype.validate = function(authData){
    if(!authData.id || !authData.access_token){
      throw new Errors.InvalidOAuthDataError("AuthData doesn't have any necessary parameter.");
    }
  };
  return Google;
}(Provider));

var ProviderUtil = module.exports = {
  Facebook: Facebook,
  Google:   Google,
  Twitter:  Twitter,
  getProvider: function(authData, providerName){
    if(Object.keys(authData).length === 0) throw new Errors.NoOAuthDataError("AuthData is required.");
    if(Object.keys(authData).length > 1 && !providerName) throw new Errors.NoProviderInfoError("If User that have multiple SNS authData is set as first argument, provider must be specified as second argument.");

    var name = providerName || Object.keys(authData)[0];
    if(!name){
      throw new Errors.NoProviderError("ProviderName is required.");
    }
    var provider = new this[capitalize(name)](authData[name]);
    if(!provider){
      throw new Errors.UnknownAuthProviderError("This ProviderName cannnot be used.");
    }
    return provider;
  }
};