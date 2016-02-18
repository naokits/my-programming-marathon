"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var NCMB = require("../lib/ncmb");

describe("NCMB Role", function(){
  var ncmb = null;
  before(function(){
    ncmb = new NCMB(config.apikey, config.clientkey);
    if(config.apiserver){
      ncmb.set("protocol", config.apiserver.protocol || "http:")
          .set("fqdn", config.apiserver.fqdn)
          .set("port", config.apiserver.port)
          .set("proxy", config.apiserver.proxy || "");
    }
  });

  describe("ロール登録", function(){
    describe("save", function(){
      it("ロール名を指定せず、登録に失敗", function(done){
        expect(function(){
          new ncmb.Role();
        }).to.throw(Error);
        expect(function(){
          new ncmb.Role({});
        }).to.throw(Error);
        expect(function(){
          new ncmb.Role(undefined);
        }).to.throw(Error);
        expect(function(){
          new ncmb.Role(null);
        }).to.throw(Error);
        expect(function(){
          new ncmb.Role("");
        }).to.throw(Error);
        done();
      });
      context("存在しないロール名を指定し、登録に成功", function(){
        var newRole = null;
        beforeEach(function(){
          newRole = new ncmb.Role("new_role_name");
        });
        it("callback で取得できる", function(done){
          newRole.save(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj.objectId).to.be.eql("role_objectId");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          newRole.save()
              .then(function(obj){
                expect(obj.objectId).to.be.eql("role_objectId");
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("存在したロール名を指定し、登録に失敗", function(){
        var newExistRole = null;
        before(function(){
          newExistRole = new ncmb.Role("new_exist_role_name");
        });
        it("callback で取得できる", function(done){
          newExistRole.save(function(err, obj){
            if(err){
              expect(err.text).to.be.eql('{"code":"E409001","error":"roleName is duplication."}');
              done();
            }else{
              done(new Error("失敗すべき"));
            }
          });
        });
        it("promise で取得できる", function(done){
          newExistRole.save()
              .then(function(obj){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err.text).to.be.eql('{"code":"E409001","error":"roleName is duplication."}');
                done();
              });
        });
      });
    });
  });
  describe("ロール更新", function(){
    describe("update", function(){
      context("存在するロールIDを指定し、更新に成功", function(done){
        var updateRole = null;
        beforeEach(function(){
          updateRole = new ncmb.Role("updated_role_name",{objectId:"update_role_id"});
        });
        it("callback で取得できる", function(done){
          updateRole.update(function(err, obj){
            done(err ? err : null);
          });
        });
        it("promise で取得できる", function(done){
          updateRole.update()
              .then(function(updateRole){
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("存在しないロールIDを指定し、更新に失敗", function(){
        var noExistRole = null;
        before(function(){
          noExistRole = new ncmb.Role("updated_role_name", {objectId:"no_exist_role_id"});
        });
        it("callback で取得できる", function(done){
          noExistRole.update(function(err, obj){
            if(!err) return done(new Error("error が返されなければならない"));
            expect(err.status).to.be.eql(404);
            done();
          });
        });
        it("promise で取得できる", function(done){
          noExistRole.update()
              .then(function(obj){
                done(new Error("error が返されなければならない"));
              })
              .catch(function(err){
                done();
              });
        });
      });
      context("objectIdがない場合、更新に失敗", function(){
        var noExistRole = null;
        before(function(){
          noExistRole = new ncmb.Role("updated_role_name");
        });
        it("callback で取得できる", function(done){
          noExistRole.update(function(err, obj){
            if(!err) return done(new Error("error が返されなければならない"));
            done();
          });
        });
        it("promise で取得できる", function(done){
          noExistRole.update()
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

  describe("ロール削除", function(){
    describe("delete", function(){
      var roleName = "deleted_role_name";
      context("存在したロール名を指定し、削除に成功して", function(done){
        var deleteRole = null;
        beforeEach(function(){
          deleteRole = new ncmb.Role(roleName,{objectId: "delete_role_id"});
        });
        it("callback で取得できる", function(done){
          deleteRole.delete(function(err, obj){
            done(err ? err : null);
          });
        });
        it("promise で取得できる", function(done){
          deleteRole.delete()
              .then(function(){
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("存在しないロール名を指定し、削除に失敗して", function(){
        var noExistRole = null;
        before(function(){
          noExistRole = new ncmb.Role(roleName, {objectId: "no_exist_role_id"});
        });
        it("callback で取得できる", function(done){
          noExistRole.delete(function(err, obj){
            if(!err) return done(new Error("error が返されなければならない"));
            expect(err.status).to.be.eql(404);
            done();
          });
        });
        it("promise で取得できる", function(done){
          noExistRole.delete()
              .then(function(obj){
                done(new Error("error が返されなければならない"));
              })
              .catch(function(err){
                done();
              });
        });
      });
      context("objectIdが設定されていないとき、削除に失敗して", function(){
        var noExistRole = null;
        before(function(){
          noExistRole = new ncmb.Role(roleName, {objectId: null});
        });
        it("callback で削除エラーを取得できる", function(done){
          noExistRole.delete(function(err, obj){
            if(!err) return done(new Error("error が返されなければならない"));
            done();
          });
        });
        it("promise で削除エラーを取得できる", function(done){
          noExistRole.delete()
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
  describe("子会員の追加", function(){
    var role = null;
    describe("addUser", function(){
      context("追加するユーザを指定して登録した結果を取得し、", function(){
        var user = null;
        beforeEach(function(){
          role = new ncmb.Role("mainRole");
          user = new ncmb.User({userName:"Yamada Tarou", password:"password"});
        });
        it("callback で取得できる", function(done){
          role.addUser(user)
              .save(function(err, data){
                if(err){
                  done(err);
                }else{
                  expect(data).to.have.property("createDate");
                  done();
                }
              });
        });
        it("promise で取得できる", function(done){
          role.addUser(user)
              .save()
              .then(function(data){
                expect(data).to.have.property("createDate");
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("追加するユーザを配列で指定して登録した結果を取得し、", function(){
        var user = null;
        var user2 = null;
        beforeEach(function(){
          role = new ncmb.Role("mainRole");
          user = new ncmb.User({userName:"Yamada Tarou", password:"password"});
          user2 = new ncmb.User({userName:"Yamada Hanako", password:"1234"});
        });
        it("callback で取得できる", function(done){
          role.addUser([user,user2])
              .save(function(err, data){
                if(err){
                  done(err);
                }else{
                  expect(data).to.have.property("createDate");
                  done();
                }
              });
        });
        it("promise で取得できる", function(done){
          role.addUser([user,user2])
              .save()
              .then(function(data){
                expect(data).to.have.property("createDate");
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("追加するユーザを連続で指定して登録した結果を取得し、", function(){
        var user = null;
        var user2 = null;
        beforeEach(function(){
          role = new ncmb.Role("mainRole");
          user = new ncmb.User({userName:"Yamada Tarou", password:"password"});
          user2 = new ncmb.User({userName:"Yamada Hanako", password:"1234"});
        });
        it("callback で取得できる", function(done){
          role.addUser(user)
              .addUser(user2)
              .save(function(err, data){
                if(err){
                  done(err);
                }else{
                  expect(data).to.have.property("createDate");
                  done();
                }
              });
        });
        it("promise で取得できる", function(done){
          role.addUser(user)
              .addUser(user2)
              .save()
              .then(function(data){
                expect(data).to.have.property("createDate");
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
    });
  });
  describe("子ロールの追加", function(){
    var role = null;
    describe("addRole", function(){
      context("追加するロールを指定して登録した結果を取得し、", function(){
        var subrole = null;
        beforeEach(function(){
          role = new ncmb.Role("mainRole");
          subrole = new ncmb.Role("subRole");
        });
        it("callback で取得できる", function(done){
          role.addRole(subrole)
              .save(function(err, data){
                if(err){
                  done(err);
                }else{
                  expect(data).to.have.property("createDate");
                  done();
                }
              });
        });
        it("promise で取得できる", function(done){
          role.addRole(subrole)
              .save()
              .then(function(data){
                expect(data).to.have.property("createDate");
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("追加するユーザを配列で指定して登録した結果を取得し、", function(){
        var subrole = null;
        var subrole2 = null;
        beforeEach(function(){
          role = new ncmb.Role("mainRole");
          subrole = new ncmb.Role("subRole");
          subrole2 = new ncmb.Role("subRole2");
        });
        it("callback で取得できる", function(done){
          role.addRole([subrole,subrole2])
              .save(function(err, data){
                if(err){
                  done(err);
                }else{
                  expect(data).to.have.property("createDate");
                  done();
                }
              });
        });
        it("promise で取得できる", function(done){
          role.addRole([subrole,subrole2])
              .save()
              .then(function(data){
                expect(data).to.have.property("createDate");
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("追加するユーザを連続で指定して登録した結果を取得し、", function(){
        var subrole = null;
        var subrole2 = null;
        beforeEach(function(){
          role = new ncmb.Role("mainRole");
          subrole = new ncmb.Role("subRole");
          subrole2 = new ncmb.Role("subRole2");
        });
        it("callback で取得できる", function(done){
          role.addRole(subrole)
              .addRole(subrole2)
              .save(function(err, data){
                if(err){
                  done(err);
                }else{
                  expect(data).to.have.property("createDate");
                  done();
                }
              });
        });
        it("promise で取得できる", function(done){
          role.addRole(subrole)
              .addRole(subrole2)
              .save()
              .then(function(data){
                expect(data).to.have.property("createDate");
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
    });
  });
  describe("子会員の削除", function(){
    var role = null;
    describe("removeUser", function(){
      context("削除するユーザを指定して登録した結果を取得し、", function(){
        var user = null;
        beforeEach(function(){
          role = new ncmb.Role("mainRole");
          user = new ncmb.User({userName:"Yamada Tarou", password:"password"});
        });
        it("callback で取得できる", function(done){
          role.removeUser(user)
              .save(function(err, data){
                if(err){
                  done(err);
                }else{
                  expect(data).to.have.property("createDate");
                  done();
                }
              });
        });
        it("promise で取得できる", function(done){
          role.removeUser(user)
              .save()
              .then(function(data){
                expect(data).to.have.property("createDate");
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("削除するユーザを配列で指定して登録した結果を取得し、", function(){
        var user = null;
        var user2 = null;
        beforeEach(function(){
          role = new ncmb.Role("mainRole");
          user = new ncmb.User({userName:"Yamada Tarou", password:"password"});
          user2 = new ncmb.User({userName:"Yamada Hanako", password:"1234"});
        });
        it("callback で取得できる", function(done){
          role.removeUser([user,user2])
              .save(function(err, data){
                if(err){
                  done(err);
                }else{
                  expect(data).to.have.property("createDate");
                  done();
                }
              });
        });
        it("promise で取得できる", function(done){
          role.removeUser([user,user2])
              .save()
              .then(function(data){
                expect(data).to.have.property("createDate");
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("削除するユーザを連続で指定して登録した結果を取得し、", function(){
        var user = null;
        var user2 = null;
        beforeEach(function(){
          role = new ncmb.Role("mainRole");
          user = new ncmb.User({userName:"Yamada Tarou", password:"password"});
          user2 = new ncmb.User({userName:"Yamada Hanako", password:"1234"});
        });
        it("callback で取得できる", function(done){
          role.removeUser(user)
              .removeUser(user2)
              .save(function(err, data){
                if(err){
                  done(err);
                }else{
                  expect(data).to.have.property("createDate");
                  done();
                }
              });
        });
        it("promise で取得できる", function(done){
          role.removeUser(user)
              .removeUser(user2)
              .save()
              .then(function(data){
                expect(data).to.have.property("createDate");
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
    });
  });
  describe("子ロールの削除", function(){
    var role = null;
    describe("removeRole", function(){
      context("削除するロールを指定して登録した結果を取得し、", function(){
        var subrole = null;
        beforeEach(function(){
          role = new ncmb.Role("mainRole");
          subrole = new ncmb.Role("subRole");
        });
        it("callback で取得できる", function(done){
          role.removeRole(subrole)
              .save(function(err, data){
                if(err){
                  done(err);
                }else{
                  expect(data).to.have.property("createDate");
                  done();
                }
              });
        });
        it("promise で取得できる", function(done){
          role.removeRole(subrole)
              .save()
              .then(function(data){
                expect(data).to.have.property("createDate");
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("削除するユーザを配列で指定して登録した結果を取得し、", function(){
        var subrole = null;
        var subrole2 = null;
        beforeEach(function(){
          role = new ncmb.Role("mainRole");
          subrole = new ncmb.Role("subRole");
          subrole2 = new ncmb.Role("subRole2");
        });
        it("callback で取得できる", function(done){
          role.removeRole([subrole,subrole2])
              .save(function(err, data){
                if(err){
                  done(err);
                }else{
                  expect(data).to.have.property("createDate");
                  done();
                }
              });
        });
        it("promise で取得できる", function(done){
          role.removeRole([subrole,subrole2])
              .save()
              .then(function(data){
                expect(data).to.have.property("createDate");
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("削除するユーザを連続で指定して登録した結果を取得し、", function(){
        var subrole = null;
        var subrole2 = null;
        beforeEach(function(){
          role = new ncmb.Role("mainRole");
          subrole = new ncmb.Role("subRole");
          subrole2 = new ncmb.Role("subRole2");
        });
        it("callback で取得できる", function(done){
          role.removeRole(subrole)
              .removeRole(subrole2)
              .save(function(err, data){
                if(err){
                  done(err);
                }else{
                  expect(data).to.have.property("createDate");
                  done();
                }
              });
        });
        it("promise で取得できる", function(done){
          role.removeRole(subrole)
              .removeRole(subrole2)
              .save()
              .then(function(data){
                expect(data).to.have.property("createDate");
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
    });
  });
  describe("子会員の取得", function(){
    context("fetchUser", function(){
      context("ロールが持つ子会員を検索し、結果を", function(){
        var role = null;
        beforeEach(function(){
          role = new ncmb.Role("mainRole");
          role.objectId = "role_id";
        });
        it("callback で取得できる", function(done){
          role.fetchUser(function(err, data){
                if(err){
                  done(err);
                }else{
                  expect(data.length).to.be.eql(1);
                  done();
                }
              });
        });
        it("promise で取得できる", function(done){
          role.fetchUser()
              .then(function(data){
                expect(data.length).to.be.eql(1);
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
    });
  });
  describe("子ロールの取得", function(){
    context("fetchRole", function(){
      context("ロールが持つ子ロールを検索し、結果を", function(){
        var role = null;
        beforeEach(function(){
          role = new ncmb.Role("mainRole");
          role.objectId = "role_id";
        });
        it("callback で取得できる", function(done){
          role.fetchRole(function(err, data){
                if(err){
                  done(err);
                }else{
                  expect(data.length).to.be.eql(1);
                  done();
                }
              });
        });
        it("promise で取得できる", function(done){
          role.fetchRole()
              .then(function(data){
                expect(data.length).to.be.eql(1);
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
    });
  });
});
