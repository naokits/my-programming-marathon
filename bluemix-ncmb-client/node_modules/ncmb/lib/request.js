"use strict";

require("babel/polyfill");
var Url     = require("url");
var qs      = require("qs");
var request = require("superagent");

var toPointer = function(obj, ncmb){
  var className = null;
  if(obj instanceof ncmb.User){
    className = "user";
  }else if(obj instanceof ncmb.Role){
    className = "role";
  }else if(obj instanceof ncmb.Installation){
    className = "installation";
  }else if(obj.className.indexOf("/classes/") !== -1){
    className = obj.className.slice(9);
  }else if(obj.className.indexOf("/") !== -1){
    className = obj.className.slice(1);
  }else{
    className = obj.className;
  }
  return {__type: "Pointer", className: className, objectId: obj.objectId};
};

var presavePointerObjects = function(data, ncmb){
  return Promise.all(Object.keys(data).map(function(key){
    var obj = data[key];

    if(obj === null) return null;
    if(obj instanceof Date) {
      return [key, {__type: "Date", iso: obj.toJSON()}];
    }
    if(obj instanceof ncmb.GeoPoint) {
      return [key, obj.toJSON()];
    }
    if(obj instanceof ncmb.Relation) {
      return Promise.all(obj.objects.map(function(elem){
        if(elem.objectId) return toPointer(elem, ncmb);
        return elem.save().then(function(res){
          return toPointer(elem, ncmb);
        });
      }))
      .then(function(objs){
        obj.objects = objs;
        delete obj.relatingClass;
        return [key, obj];
      });
    }
    if(typeof obj !== "object" || !obj.className || obj.className === "/files" ){
      return null;
    }
    if(obj.objectId) return [key, toPointer(obj, ncmb)];

    return obj.save().then(function(res){
      return [key, toPointer(obj, ncmb)];
    });
  })).then(function(presavedPointerObjects){
    for(var i = 0, l = presavedPointerObjects.length; i < l; i++){
      if(presavedPointerObjects[i]){
        data[presavedPointerObjects[i][0]] = presavedPointerObjects[i][1];
      }
    }
    return data;
  });
};

module.exports = function(opts, callback){
  if(typeof opts.path != "string"){
    return callback(new Error("Path is required."), null);
  }

  var path = opts.path;
  var timestamp = opts.timestamp || new Date().toISOString();
  var method = (opts.method || "GET").toUpperCase();

  var parsedUrl = Url.parse(path);
  parsedUrl.hostname = opts.fqdn || this.fqdn;
  parsedUrl.port     = opts.port || this.port;
  parsedUrl.protocol = opts.protocol || this.protocol;
  var url = parsedUrl.format();
  var query = opts.query;
  var data  = opts.data;
  var proxy = null;
  var file  = opts.file;

  var sig = (this.createSignature || require("./signature").create)(
    parsedUrl.format(), method, opts.query || "", timestamp,
    opts.signatureMethod || this.signatureMethod,
    opts.signatureVersion || this.signatureVersion,
    opts.fqdn || this.fqdn,
    opts.apikey || this.apikey, opts.clientkey || this.clientkey
  );

  var headers = {
    "X-NCMB-Application-Key":    opts.apikey || this.apikey,
    "X-NCMB-Signature":          sig,
    "X-NCMB-Timestamp":          timestamp,
    "Content-Type":              opts.contentType || "application/json",
    "X-NCMB-SDK-Version":        "javascript-2.0.2"
  };

  if(this.sessionToken) headers["X-NCMB-Apps-Session-Token"] = this.sessionToken;

  if(parsedUrl.protocol === "https:") var secureProtocol = "TLSv1_method";
  if(typeof (opts.proxy || this.proxy) === "undefined"){
    proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || "";
  }

  return new Promise(function(resolve, reject){
    var _callback = function(err, res){
      if(err) return (callback && callback(err, null)) || reject(err);
      if(res.statusCode >= 400 || res.status >= 400) return reject(res.error || new Error(res.text));
      return (callback && callback(null, res.text)) || resolve(res.text, res);
    };
    var r = request[method.toLowerCase()](url);
    Object.keys(headers).forEach(function(key){
      r.set(key, headers[key]);
    });

    if(typeof file == "object"){
      if(file.acl !== undefined){
        r.field("acl", JSON.stringify(file.acl));
      }
      r.attach("file", file.fileData, file.fileName);
      r.end(_callback);
    }else{
      if(typeof data == "object"){
        presavePointerObjects(data, this)
        .then(function(data){
          r.send(data);
          r.end(_callback);
        })
        .catch(function(err){
          return _callback(err, null);
        });
      }else{
        if(typeof query == "object") r.query(query);
        r.end(_callback);
      }
    }
  }.bind(this));
};
