"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("NCMB core", function(){
  var ncmb = null;
  before(function(){
    ncmb = new NCMB(config.apikey, config.clientkey );
  });

  describe("インスタンス生成", function(){
    it("apikey, clientkeyが設定されるとき、生成に成功する", function(done){
      try{
        var new_ncmb = new NCMB("apikey", "clientkey");
        done();
      }catch(err){
        done(err);
      }
    });
    it("apikey もしくは clientkeyがないとき、生成に失敗", function(done){
      expect(function(){
          new NCMB();
        }).to.throw(Error);
        expect(function(){
          new NCMB({});
        }).to.throw(Error);
        expect(function(){
          new NCMB(undefined, undefined);
        }).to.throw(Error);
        expect(function(){
          new NCMB(null, null);
        }).to.throw(Error);
        expect(function(){
          new NCMB("", "");
        }).to.throw(Error);
        expect(function(){
          new NCMB(undefined, config.clientkey);
        }).to.throw(Error);
        expect(function(){
          new NCMB(config.apikey, undefined);
        }).to.throw(Error);
        done();
    });
  });
  describe("パラメータ設定", function(){
    it("設定可能なキーの場合は成功する", function(done){
      ncmb.set("apikey", "6145f91061916580c742f806bab67649d10f45920246ff459404c46f00ff3e56");
      done();
    });
    it("設定可能でないキーの場合は失敗する", function(done){
      expect(function(){
        ncmb.set("unmodifiablekey","value");
      }).to.throw(Error);
      done();
    });
    it("getメソッドでパラメータを参照できる", function(done){
      ncmb.set("port",443);
      expect(ncmb.get("port")).to.be.eql(443);
      done();
    });
  });

  describe("signature 作成", function(){
    it("[公式ドキュメント](http://bit.ly/1GsvAKL) の通りに成功する", function(){
      ncmb
        .set("apikey", "6145f91061916580c742f806bab67649d10f45920246ff459404c46f00ff3e56")
        .set("clientkey", "1343d198b510a0315db1c03f3aa0e32418b7a743f8e4b47cbff670601345cf75");

      var sig = ncmb.createSignature(
        "https://"+ncmb.fqdn+"/" + ncmb.version +"/classes/TestClass",
        "GET",
        {where: {testKey: "testValue"}},
        "2013-12-02T02:44:35.452Z"
      );
      expect(sig).to.be.equal("/mQAJJfMHx2XN9mPZ9bDWR9VIeftZ97ntzDIRw0MQ4M=");
    });
  });

  describe("低レベル リクエスト API", function(){
    before(function(){
      ncmb
      .set("apikey", config.apikey)
      .set("clientkey", config.clientkey);
      if(config.apiserver){
        ncmb
        .set("protocol", config.apiserver.protocol || "http:")
        .set("fqdn", config.apiserver.fqdn)
        .set("port", config.apiserver.port)
        .set("proxy", config.apiserver.proxy || "");
      }
    });

        context("http method が GET の時に", function(){
      it("callback によりデータを取得できる", function(done){
        ncmb.request({
          path: "/"+ncmb.version+"/classes/TestClass",
          timestamp: "2015-02-25T08:01:08.908Z"
        }, function(err, res){
          if(err) return done(err);
          return done();
        });
      });
      it("promise によりデータを取得できる", function(done){
        ncmb.request({
          path: "/"+ncmb.version+"/classes/TestClass",
          timestamp: "2015-02-25T08:01:08.908Z"
        }).then(function(body){
          done();
        }).catch(function(err){
          done(err);
        });
      });
    });

    context("http method が POST の時に", function(){
      it("callback によりデータを登録できる", function(done){
        ncmb.request({
          method: "POST",
          path: "/"+ ncmb.version +"/classes/TestClass",
          timestamp: "2015-02-25T08:01:08.908Z",
          data: {'key': 'value'}
        }, function(err, res, body){
          if(err) return done(err);
          return done();
        });
      });
      it("promise によりデータを登録できる", function(done){
        ncmb.request({
          method: "POST",
          path: "/"+ncmb.version+"/classes/TestClass",
          timestamp: "2015-02-25T08:01:08.908Z",
          data: {"key": "value"}
        }).then(function(body){
          done();
        }).catch(function(err){
          done(err);
        });
      });
    });

    context("http method が PUT の時に", function(){
      it("callback によりデータを更新できる", function(done){
        ncmb.request({
          method: "PUT",
          path: "/"+ ncmb.version +"/classes/TestClass/object_id",
          timestamp: "2015-02-25T08:01:08.908Z",
          data: {'key': 'value_new'}
        }, function(err, res, body){
          if(err) return done(err);
          return done();
        });
      });
      it("promise によりデータを更新できる", function(done){
        ncmb.request({
          method: "PUT",
          path: "/"+ncmb.version+"/classes/TestClass/object_id",
          timestamp: "2015-02-25T08:01:08.908Z",
          data: {"key": "value_new"}
        }).then(function(body){
          done();
        }).catch(function(err){
          done(err);
        });
      });
    });

    context("http method が DELETE の時に", function(){
      it("callback によりデータを削除できる", function(done){
        ncmb.request({
          method: "DEL",
          path: "/"+ ncmb.version +"/classes/TestClass/object_id",
          timestamp: "2015-02-25T08:01:08.908Z"
        }, function(err, res, body){
          if(err) return done(err);
          return done();
        });
      });
      it("promise によりデータを削除できる", function(done){
        ncmb.request({
          method: "DEL",
          path: "/"+ncmb.version+"/classes/TestClass/object_id",
          timestamp: "2015-02-25T08:01:08.908Z"
        }).then(function(body){
          done();
        }).catch(function(err){
          done(err);
        });
      });
    });
  });
});
