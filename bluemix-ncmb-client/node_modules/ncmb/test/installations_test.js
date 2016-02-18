"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("NCMB Installation", function(){
  var ncmb = null;
  before(function(){
    ncmb = new NCMB(config.apikey, config.clientkey );
    if(config.apiserver){
      ncmb.set("protocol", config.apiserver.protocol || "http:")
          .set("fqdn", config.apiserver.fqdn)
          .set("port", config.apiserver.port)
          .set("proxy", config.apiserver.port || "");
    }
  });
  var installation = null;
  describe("インスタンス生成", function(){
    it("プロパティをconstructorで指定できる", function(done){
      installation = new ncmb.Installation({flag:1});
      expect(installation.flag).to.be.eql(1);
      done();
    });
    it("変更できないプロパティを指定するとエラーが返る", function(done){
      try{
        installation = new ncmb.Installation({update: true});
        done(new Error("失敗すべき"));
      }catch(err){
        done();
      };
    });
  });

  describe("配信端末情報更新", function(){
    describe("update", function(){
      context("配信端末情報のIDを指定し、更新に成功", function(done){
        var updateInstallation = null;
        beforeEach(function(){
          updateInstallation = new ncmb.Installation({objectId:"update_installation_id", status:"updated"});
        });
        it("callback で取得できる", function(done){
          updateInstallation.update(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj).to.have.property("updateDate");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          updateInstallation.update()
              .then(function(updateRole){
                expect(updateRole).to.have.property("updateDate");
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      it("objectIdがないとき、更新に失敗してエラーが返る", function(done){
        var updateInstallation = new ncmb.Installation({status:"updated"});
        updateInstallation.update()
            .then(function(updateRole){
              done(new Error("error が返されなければならない"));
            })
            .catch(function(err){
              done();
            });
      });
    });
  });

  describe("配信端末情報検索", function(){
    context("配信端末情報を検索したとき、取得に成功して", function(){
      it("callback で取得できる", function(done){
        ncmb.Installation.fetchAll(function(err, objs){
          if(err){
            done(err);
          }else{
            expect(objs.length).to.be.equal(1);
            expect(objs[0].deviceType).to.be.equal("android");
            done();
          }
        });
      });
      it("promise で取得できる", function(done){
        ncmb.Installation.fetchAll()
            .then(function(objs){
              expect(objs.length).to.be.equal(1);
              expect(objs[0].deviceType).to.be.equal("android");
              done();
            })
            .catch(function(err){
              done(err);
            });
      });
    });
  });

  describe("配信端末情報削除", function(){
    describe("delete", function(){
      context("配信端末情報を指定し、削除に成功して", function(done){
        var deleteInstallation = null;
        beforeEach(function(){
          deleteInstallation = new ncmb.Installation({objectId: "delete_installation_id"});
        });
        it("callback で取得できる", function(done){
          deleteInstallation.delete(function(err, obj){
            done(err ? err : null);
          });
        });
        it("promise で取得できる", function(done){
          deleteInstallation.delete()
              .then(function(){
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("objectIdが設定されていないとき、削除に失敗して", function(){
        var noExistInstallation = null;
        before(function(){
          noExistInstallation = new ncmb.Installation({objectId: null});
        });
        it("callback で削除エラーを取得できる", function(done){
          noExistInstallation.delete(function(err, obj){
            if(!err) return done(new Error("error が返されなければならない"));
            done();
          });
        });
        it("promise で削除エラーを取得できる", function(done){
          noExistInstallation.delete()
              .then(function(obj){
                done(new Error("error が返されなければならない"));
              })
              .catch(function(err){
                done();
              });
        });
      });
    });
  });
});
