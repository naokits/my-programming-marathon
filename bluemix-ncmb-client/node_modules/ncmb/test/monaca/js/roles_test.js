"use strict";

describe("NCMB Role", function(){
  this.timeout(5000);
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
  var callback_id = null;
  var promise_id  = null;
  var belong_user_callback_id = null;
  var belong_user_promise_id  = null;
  var belong_role_callback_id = null;
  var belong_role_promise_id  = null;
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
        it("callback で取得できる", function(done){
          newRole = new ncmb.Role("save_role_callback");
          newRole.save(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj).to.have.property("objectId");
              callback_id = obj.objectId;
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          newRole = new ncmb.Role("save_role_promise");
          newRole.save()
              .then(function(obj){
                expect(obj).to.have.property("objectId");
                promise_id = obj.objectId;
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("存在したロール名を指定し、登録に失敗", function(){
        var newExistRole = null;
        var existRole = null;
        it("callback で取得できる", function(done){
          newExistRole = new ncmb.Role("exist_role_callback");
          existRole    = new ncmb.Role("exist_role_callback");
          newExistRole.save()
                      .then(function(obj){
                          existRole.save(function(err, obj){
                            if(err){
                              expect(err).to.be.an.instanceof(Error);
                              done();
                            }else{
                              done(new Error("失敗すべき"));
                            }
                          });
                      })
                      .catch(function(err){
                          done(err);
                      });
        });
        it("promise で取得できる", function(done){
          newExistRole = new ncmb.Role("exist_role_promise");
          existRole    = new ncmb.Role("exist_role_promise");
          newExistRole.save()
              .then(function(){
                  return existRole.save();
              })
              .then(function(obj){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
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
        it("callback で取得できる", function(done){
          updateRole = new ncmb.Role("save_role_callback",{objectId:callback_id, updated:true });
          updateRole.update(function(err, obj){
            if(err){
                done(err);
            }else{
                expect(obj).to.have.property("updateDate");
                done();
            }
          });
        });
        it("promise で取得できる", function(done){
          updateRole = new ncmb.Role("save_role_promise",{objectId:promise_id, updated:true });
          updateRole.update()
              .then(function(obj){
                expect(obj).to.have.property("updateDate");
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
          noExistRole = new ncmb.Role("save_role_callback", {objectId:"no_exist_role_id"});
        });
        it("callback で取得できる", function(done){
          noExistRole.update(function(err, obj){
            if(!err){
                return done(new Error("error が返されなければならない"));
            }else{
              expect(err).to.be.an.instanceof(Error);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          noExistRole.update()
              .then(function(obj){
                done(new Error("error が返されなければならない"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
        });
      });
      context("objectIdがない場合、更新に失敗", function(){
        var noExistRole = null;
        it("callback で取得できる", function(done){
          noExistRole = new ncmb.Role("save_role_callback");
          noExistRole.update(function(err, obj){
            if(!err) return done(new Error("error が返されなければならない"));
            done();
          });
        });
        it("promise で取得できる", function(done){
          noExistRole = new ncmb.Role("save_role_promise");
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
      context("存在したロール名を指定し、削除に成功して", function(done){
        var deleteRole = null;
        it("callback で取得できる", function(done){
          deleteRole = new ncmb.Role("delete_callback");
          deleteRole.save()
                    .then(function(data){
                      deleteRole.delete(function(err, obj){
                        done(err ? err : null);
                      });
                    })
                    .catch(function(err){
                        done(err);
                    });
        });
        it("promise で取得できる", function(done){
          deleteRole = new ncmb.Role("delete_promise");
          deleteRole.save()
                    .then(function(data){
                      return deleteRole.delete();
                    })
                    .then(function(){
                        done();
                    })
                    .catch(function(err){
                        done(err);
                    });
        });
      });
      context("objectIdが設定されていないとき、削除に失敗して", function(){
        var noExistRole = null;
        it("callback で削除エラーを取得できる", function(done){
          noExistRole = new ncmb.Role("save_role_callback");
          noExistRole.delete(function(err, obj){
            if(!err) return done(new Error("error が返されなければならない"));
            done();
          });
        });
        it("promise で削除エラーを取得できる", function(done){
          noExistRole = new ncmb.Role("save_role_promise");
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
        var acl = null;
        beforeEach(function(){
            acl = new ncmb.Acl();
            acl.setPublicReadAccess(true);
        });
        it("callback で取得できる", function(done){
          role = new ncmb.Role("add_user_callback");
          user = new ncmb.User({userName:"belong_user_callback", password:"password"});
          user.acl = acl;
          role.addUser(user)
              .save(function(err, data){
                if(err){
                  done(err);
                }else{
                  expect(data).to.have.property("createDate");
                  belong_user_callback_id = data.objectId
                  done();
                }
              });
        });
        it("promise で取得できる", function(done){
          role = new ncmb.Role("add_user_promise");
          user = new ncmb.User({userName:"belong_user_promise", password:"password"});
          user.acl = acl;
          role.addUser(user)
              .save()
              .then(function(data){
                expect(data).to.have.property("createDate");
                belong_user_promise_id = data.objectId
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
        it("callback で取得できる", function(done){
          role = new ncmb.Role("add_user_array_callback");
          user  = new ncmb.User({userName:"belong_user_array_callback_1", password:"password"});
          user2 = new ncmb.User({userName:"belong_user_array_callback_2", password:"password"});
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
          role = new ncmb.Role("add_user_array_promise");
          user  = new ncmb.User({userName:"belong_user_array_promise_1", password:"password"});
          user2 = new ncmb.User({userName:"belong_user_array_promise_2", password:"password"});
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
        it("callback で取得できる", function(done){
          role = new ncmb.Role("add_user_multi_callback");
          user  = new ncmb.User({userName:"belong_user_multi_callback_1", password:"password"});
          user2 = new ncmb.User({userName:"belong_user_multi_callback_2", password:"password"});
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
          role = new ncmb.Role("add_user_multi_promise");
          user  = new ncmb.User({userName:"belong_user_multi_promise_1", password:"password"});
          user2 = new ncmb.User({userName:"belong_user_multi_promise_2", password:"password"});
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
        it("callback で取得できる", function(done){
          role = new ncmb.Role("add_role_callback");
          subrole = new ncmb.Role("belong_role_callback");
          role.addRole(subrole)
              .save(function(err, data){
                if(err){
                  done(err);
                }else{
                  expect(data).to.have.property("createDate");
                  belong_role_callback_id = data.objectId
                  done();
                }
              });
        });
        it("promise で取得できる", function(done){
          role = new ncmb.Role("add_role_promise");
          subrole = new ncmb.Role("belong_role_promise");
          role.addRole(subrole)
              .save()
              .then(function(data){
                expect(data).to.have.property("createDate");
                belong_role_promise_id = data.objectId
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
        it("callback で取得できる", function(done){
          role = new ncmb.Role("add_role_array_callback");
          subrole  = new ncmb.Role("belong_role_array_callback1");
          subrole2 = new ncmb.Role("belong_role_array_callback2");
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
          role = new ncmb.Role("add_role_array_promise");
          subrole  = new ncmb.Role("belong_role_array_promise1");
          subrole2 = new ncmb.Role("belong_role_array_promise2");
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
        it("callback で取得できる", function(done){
          role = new ncmb.Role("add_role_multi_callback");
          subrole  = new ncmb.Role("belong_role_multi_callback1");
          subrole2 = new ncmb.Role("belong_role_multi_callback2");
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
          role = new ncmb.Role("add_role_multi_promise");
          subrole  = new ncmb.Role("belong_role_multi_promise1");
          subrole2 = new ncmb.Role("belong_role_multi_promise2");
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
          role = new ncmb.Role("remove_user");
        });
        it("callback で取得できる", function(done){
          role = new ncmb.Role("remove_user_callback");
          user = new ncmb.User({userName:"remove_user_callback", password:"password"});
          role.addUser(user)
              .save()
              .then(function(){
                role.removeUser(user)
                    .update(function(err, data){
                      if(err){
                        done(err);
                      }else{
                        expect(data).to.have.property("updateDate");
                        done();
                      }
                    });
              })
              .catch(function(err){
                done(err);
              });
              
        });
        it("promise で取得できる", function(done){
          role = new ncmb.Role("remove_user_promise");
          user = new ncmb.User({userName:"remove_user_promise", password:"password"});
          role.addUser(user)
              .save()
              .then(function(){
                return role.removeUser(user)
                           .update();
              })
              .then(function(data){
                expect(data).to.have.property("updateDate");
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
        it("callback で取得できる", function(done){
          role = new ncmb.Role("remove_user_array_callback");
          user = new ncmb.User({userName:"remove_user_array_callback1", password:"password"});
          user2 = new ncmb.User({userName:"remove_user_array_callback2", password:"password"});
          role.addUser([user,user2])
              .save()
              .then(function(){
                role.removeUser([user,user2])
                    .update(function(err, data){
                      if(err){
                        done(err);
                      }else{
                        expect(data).to.have.property("updateDate");
                        done();
                      }
                    });
              })
              .catch(function(err){
                done(err);
              });
        });
        it("promise で取得できる", function(done){
          role = new ncmb.Role("remove_user_array_promise");
          user = new ncmb.User({userName:"remove_user_array_promise1", password:"password"});
          user2 = new ncmb.User({userName:"remove_user_array_promise2", password:"password"});
          role.addUser([user,user2])
              .save()
              .then(function(){
                return role.removeUser([user,user2])
                           .update();
              })
              .then(function(data){
                expect(data).to.have.property("updateDate");
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
        it("callback で取得できる", function(done){
          role = new ncmb.Role("remove_user_multi_callback");
          user = new ncmb.User({userName:"remove_user_multi_callback1", password:"password"});
          user2 = new ncmb.User({userName:"remove_user_multi_callback2", password:"password"});
          role.addUser(user)
              .addUser(user2)
              .save()
              .then(function(){
                role.removeUser(user)
                    .removeUser(user2)
                    .update(function(err, data){
                      if(err){
                        done(err);
                      }else{
                        expect(data).to.have.property("updateDate");
                        done();
                      }
                    });
              })
              .catch(function(err){
                done(err);
              });
        });
        it("promise で取得できる", function(done){
          role = new ncmb.Role("remove_user_multi_promise");
          user = new ncmb.User({userName:"remove_user_multi_promise1", password:"password"});
          user2 = new ncmb.User({userName:"remove_user_multi_promise2", password:"password"});
          role.addUser(user)
              .addUser(user2)
              .save()
              .then(function(){
                return role.removeUser(user)
                           .removeUser(user2)
                           .update();
              })
              .then(function(data){
                expect(data).to.have.property("updateDate");
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
        it("callback で取得できる", function(done){
          role = new ncmb.Role("remove_role_callback");
          subrole = new ncmb.Role("remove_subrole_callback");
          role.addRole(subrole)
              .save()
              .then(function(){
                role.removeRole(subrole)
                    .update(function(err, data){
                      if(err){
                        done(err);
                      }else{
                        expect(data).to.have.property("updateDate");
                        done();
                      }
                    });
              })
              .catch(function(err){
                done(err);
              });
        });
        it("promise で取得できる", function(done){
          role = new ncmb.Role("remove_role_promise");
          subrole = new ncmb.Role("remove_subrole_promise");
          role.addRole(subrole)
              .save()
              .then(function(){
                return role.removeRole(subrole)
                           .update();
              })
              .then(function(data){
                expect(data).to.have.property("updateDate");
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
        it("callback で取得できる", function(done){
          role = new ncmb.Role("remove_role_array_callback");
          subrole  = new ncmb.Role("remove_role_array_callback1");
          subrole2 = new ncmb.Role("remove_role_array_callback2");
          role.addRole([subrole, subrole2])
              .save()
              .then(function(){
                role.removeRole([subrole, subrole2])
                    .update(function(err, data){
                      if(err){
                        done(err);
                      }else{
                        expect(data).to.have.property("updateDate");
                        done();
                      }
                    });
              })
              .catch(function(err){
                done(err);
              });
        });
        it("promise で取得できる", function(done){
          role = new ncmb.Role("remove_role_array_promise");
          subrole  = new ncmb.Role("remove_role_array_promise1");
          subrole2 = new ncmb.Role("remove_role_array_promise2");
          role.addRole([subrole, subrole2])
              .save()
              .then(function(){
                return role.removeRole([subrole, subrole2])
                           .update();
              })
              .then(function(data){
                expect(data).to.have.property("updateDate");
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
        it("callback で取得できる", function(done){
          role = new ncmb.Role("remove_role_multi_callback");
          subrole  = new ncmb.Role("remove_role_multi_callback1");
          subrole2 = new ncmb.Role("remove_role_multi_callback2");
          role.addRole(subrole)
              .addRole(subrole2)
              .save()
              .then(function(){
                role.removeRole(subrole)
                    .removeRole(subrole2)
                    .update(function(err, data){
                      if(err){
                        done(err);
                      }else{
                        expect(data).to.have.property("updateDate");
                        done();
                      }
                    });
              })
              .catch(function(err){
                done(err);
              });
        });
        it("promise で取得できる", function(done){
          role = new ncmb.Role("remove_role_multi_promise");
          subrole  = new ncmb.Role("remove_role_promise_promise1");
          subrole2 = new ncmb.Role("remove_role_promise_promise2");
          role.addRole(subrole)
              .addRole(subrole2)
              .save()
              .then(function(){
                return role.removeRole(subrole)
                           .removeRole(subrole2)
                           .update();
              })
              .then(function(data){
                expect(data).to.have.property("updateDate");
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
          role = new ncmb.Role("add_user");
        });
        it("callback で取得できる", function(done){
          role.objectId = belong_user_callback_id;
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
          role.objectId = belong_user_promise_id;
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
          role = new ncmb.Role("add_role");
        });
        it("callback で取得できる", function(done){
          role.objectId = belong_role_callback_id;
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
          role.objectId = belong_role_promise_id;
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
