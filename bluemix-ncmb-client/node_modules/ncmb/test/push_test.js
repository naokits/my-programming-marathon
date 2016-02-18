"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("NCMB Push", function(){
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
  var push = null;
  describe("インスタンス生成", function(){
    it("プロパティをconstructorで指定できる", function(done){
      push = new ncmb.Push({immediateDeliveryFlag: true});
      expect(push.immediateDeliveryFlag).to.be.eql(true);
      done();
    });
    it("変更できないプロパティを指定するとエラーが返る", function(done){
      try{
        push = new ncmb.Push({send: true});
        done(new Error("失敗すべき"));
      }catch(err){
        done();
      };
    });
  });

  describe("プッシュ通知更新", function(){
    describe("update", function(){
      context("存在するプッシュ通知のIDを指定し、更新に成功", function(done){
        var updatePush = null;
        beforeEach(function(){
          updatePush = new ncmb.Push({objectId:"update_push_id", message:"updated"});
        });
        it("callback で取得できる", function(done){
          updatePush.update(function(err, obj){
            done(err ? err : null);
          });
        });
        it("promise で取得できる", function(done){
          updatePush.update()
              .then(function(updateRole){
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("badgeSettingが設定されていてnullでないとき、", function(done){
        var updatePush = null;
        beforeEach(function(){
          updatePush = new ncmb.Push({objectId:"update_push_id", message:"updated"});
          updatePush.set("badgeSetting", 1);
        });
       it("contentAvailableとbadgeIncrementFlagがtrueでなければ更新に成功する", function(done){
          updatePush.set("contentAvailable", false)
                    .set("badgeIncrementFlag", false);
          updatePush.update(function(err, obj){
            done(err ? err : null);
          });
        });
        it("contentAvailableがtrueのとき、エラーが返る", function(done){
          updatePush.set("contentAvailable", true);
          updatePush.update()
              .then(function(updateRole){
                done(new Error("error が返されなければならない"));
              })
              .catch(function(err){
                done();
              });
        });
        it("badgeIncrementFlagがtrueのとき、エラーが返る", function(done){
          updatePush.set("badgeIncrementFlag", true);
          updatePush.update()
              .then(function(updateRole){
                done(new Error("error が返されなければならない"));
              })
              .catch(function(err){
                done();
              });
        });
      });
      it("contentAvailableとbadgeIncrementFlagが共にtrueならば、更新に失敗してエラーが返る", function(done){
        var updatePush = new ncmb.Push({objectId:"update_push_id", message:"updated"});
        updatePush.set("contentAvailable", true)
                  .set("badgeIncrementFlag", true);
        updatePush.update()
            .then(function(updateRole){
              done(new Error("error が返されなければならない"));
            })
            .catch(function(err){
              done();
            });
      });
      it("badgeIncrementFlagがtrueのときに、targetをiosなしで更新しようとした場合、更新に失敗してエラーが返る", function(done){
        var updatePush = new ncmb.Push({objectId:"update_push_id", message:"updated"});
        updatePush.set("target", ['android'])
                  .set("badgeIncrementFlag", true);
        updatePush.update()
            .then(function(updateRole){
              done(new Error("error が返されなければならない"));
            })
            .catch(function(err){
              done();
            });
      });
      it("objectIdがないとき、更新に失敗してエラーが返る", function(done){
        var updatePush = new ncmb.Push({message:"updated"});
        updatePush.update()
            .then(function(updateRole){
              done(new Error("error が返されなければならない"));
            })
            .catch(function(err){
              done();
            });
      });
    });
  });

  describe("プッシュ送信", function(){
    context("プッシュ通知を送信したとき、送信に成功して", function(){
      beforeEach(function(){
        push = new ncmb.Push({immediateDeliveryFlag: true});
      });
      it("callback で取得できる", function(done){
        push.send(function(err, obj){
          if(err){
            done(err);
          }else{
            expect(obj.objectId).to.be.eql("push_id");
            done();
          }
        });
      });
      it("promise で取得できる", function(done){

        push.send()
            .then(function(obj){
              expect(obj.objectId).to.be.eql("push_id");
              done();
            })
            .catch(function(err){
              done(err);
            });
      });
    });
  });

  describe("プッシュ検索", function(){
    context("プッシュ通知を検索したとき、取得に成功して", function(){
      it("callback で取得できる", function(done){
        ncmb.Push.fetchAll(function(err, objs){
          if(err){
            done(err);
          }else{
            expect(objs.length).to.be.equal(1);
            expect(objs[0].target[0]).to.be.equal("ios");
            done();
          }
        });
      });
      it("promise で取得できる", function(done){
        ncmb.Push.fetchAll()
            .then(function(objs){
              expect(objs.length).to.be.equal(1);
              expect(objs[0].target[0]).to.be.equal("ios");
              done();
            })
            .catch(function(err){
              done(err);
            });
      });
    });
  });

  describe("プッシュ削除", function(){
    describe("delete", function(){
      context("未送信のプッシュを指定し、削除に成功して", function(done){
        var deletePush = null;
        beforeEach(function(){
          deletePush = new ncmb.Push({objectId: "delete_push_id"});
        });
        it("callback で取得できる", function(done){
          deletePush.delete(function(err, obj){
            done(err ? err : null);
          });
        });
        it("promise で取得できる", function(done){
          deletePush.delete()
              .then(function(){
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("objectIdが設定されていないとき、削除に失敗して", function(){
        var noExistPush = null;
        before(function(){
          noExistPush = new ncmb.Push({objectId: null});
        });
        it("callback で削除エラーを取得できる", function(done){
          noExistPush.delete(function(err, obj){
            if(!err) return done(new Error("error が返されなければならない"));
            done();
          });
        });
        it("promise で削除エラーを取得できる", function(done){
          noExistPush.delete()
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
