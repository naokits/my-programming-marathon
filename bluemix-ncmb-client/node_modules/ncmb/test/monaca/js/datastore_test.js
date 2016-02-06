"use strict";

describe("NCMB DataStore", function(){
  this.timeout(10000);
  var ncmb = null;
  before(function(){
    ncmb = new NCMB(config.apikey, config.clientkey );
    if(config.apiserver){
      ncmb.set("protocol", config.apiserver.protocol || "http:")
          .set("fqdn", config.apiserver.fqdn)
          .set("port", config.apiserver.port)
          .set("proxy", config.apiserver.proxy || "");
    }
  });

  describe("インスタンス生成", function(){
    var Food = null;
    var food = null;
    it("プロパティをconstructorで指定し、取得できる", function(done){
      Food = ncmb.DataStore("food");
      food = new ncmb.User({name: "orange"});
      expect(food.name).to.be.equal("orange");
      done();
    })
    it("変更許可のないキーを指定した場合、値を変更できない", function(done){
      Food = ncmb.DataStore("food");
      food = new ncmb.User({className: "drink"});
      try{
        expect(food.className).to.be.equal("drink");
        done(new Error("失敗すべき"));
      }catch(err){
        done();
      }
    });
  });
  var data_callback_id = null;
  var data_promise_id  = null;
  describe("オブジェクト登録", function(){
    describe("save", function(){
      context("クラス定義が存在すれば、登録に成功し", function(){
        var Food = null;
        var food = null;
        beforeEach(function(){
          Food = ncmb.DataStore("food");
          food = new Food({status: "success"});
        });
        it("callback で取得できる", function(done){
          food.set("saved", "datastore_callback");
          food.save(function(err, obj){
            expect(obj).to.have.property("objectId");
            data_callback_id = obj.objectId;
            done(err ? err : null);
          });
        });
        it("promise で取得できる", function(done){
          food.set("saved", "datastore_promise");
          food.save()
              .then(function(newFood){
                expect(newFood).to.have.property("objectId");
                data_promise_id = newFood.objectId;
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      
      it("クラス名がなければ、クラス生成に失敗する", function(done){
        expect(function(){
          ncmb.DataStore();
        }).to.throw(Error);
        expect(function(){
          ncmb.DataStore(null);
        }).to.throw(Error);
        expect(function(){
          ncmb.DataStore(undefined);
        }).to.throw(Error);
        done();
      });
      
      context("Dateタイプをプロパティに設定したときオブジェクト保存に成功し", function(){
        var Food = null;
        var aSimpleDate = null;
        var food = null;
        beforeEach(function(){
          Food = ncmb.DataStore("food");
          aSimpleDate = new Date(1999, 11, 31, 23, 59, 59, 999);
          food = new Food({harvestDate: aSimpleDate});
        })
        it("callback で取得できる", function(done){
          food.set("saved", "date_callback");
          food.save(function(err, obj){
            if(err) {
              done(err);
            } else {
              expect(obj).to.have.property("harvestDate");
              expect(obj.harvestDate).to.have.property("__type", "Date");
              expect(obj.harvestDate).to.have.property("iso");
              expect(obj.save).to.be.a("function");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          food.set("saved", "date_promise");
          food.save()
              .then(function(obj){
                expect(obj).to.have.property("harvestDate");
                expect(obj.harvestDate).to.have.property("__type", "Date");
                expect(obj.harvestDate).to.have.property("iso");
                expect(obj.save).to.be.a("function");
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      
      context("未保存のncmb.Dataタイプをプロパティに設定したときオブジェクト保存に成功し", function(){
        var Food = null;
        var Component = null;
        var food = null;
        var component = null;
        beforeEach(function(){
          Food = ncmb.DataStore("food");
          food = new Food();
          Component = ncmb.DataStore("Component");
          component = new Component();
          food.component = component;
        })
        it("callback で取得できる", function(done){
          component.set("name", "pointer_callback");
          food.set("saved", "object_callback");
          food.save(function(err, obj){
            done(err ? err : null);
          });
        });
        it("promise で取得できる", function(done){
          component.set("name", "pointer_promise");
          food.set("saved", "object_promise");
          food.save()
              .then(function(data){
                expect(data).to.have.property("objectId");
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("保存済みのncmb.Dataタイプをプロパティに設定したときオブジェクト保存に成功し", function(){
        var Food = null;
        var Component = null;
        var food = null;
        var component = null;
        beforeEach(function(){
          Food = ncmb.DataStore("food");
          food = new Food({name: "orange"});
          Component = ncmb.DataStore("Component");
          component = new Component();
        })
        it("callback で取得できる", function(done){
          component.set("name", "pointer_presave_callback");
          food.set("saved", "object_preset_callback");
          component.save()
                   .then(function(obj){
                      food.component = obj;
                      food.save(function(err, data){
                        done(err ? err : null);
                      });
                   })
                   .catch(function(err){
                    done(err);
                   });
        });
        it("promise で取得できる", function(done){
          component.set("name", "pointer_presave_promise");
          food.set("saved", "object_preset_promise");
          component.save()
                   .then(function(obj){
                      food.component = obj;
                      return food.save();
                   })
                   .then(function(obj){
                    expect(obj).to.have.property("objectId");
                    done();
                   })
                   .catch(function(err){
                    done(err);
                   });
        });
      });
      context("未保存のncmb.Userタイプをプロパティに設定したときオブジェクト保存に成功し", function(){
        var Food = null;
        var food = null;
        var user = null;
        beforeEach(function(){
          Food = ncmb.DataStore("food");
          food = new Food();
          user = new ncmb.User({password:"password"});
          food.member = user;
        })
        it("callback で取得できる", function(done){
          user.set("userName", "pointer_callback");
          food.set("saved", "user_callback");
          food.save(function(err, obj){
            done(err ? err : null);
          });
        });
        it("promise で取得できる", function(done){
          user.set("userName", "pointer_promise");
          food.set("saved", "user_promise");
          food.save()
              .then(function(data){
                expect(data).to.have.property("objectId");
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("保存済みのncmb.Userタイプをプロパティに設定したときオブジェクト保存に成功し", function(){
        var Food = null;
        var food = null;
        var user = null;
        beforeEach(function(){
          Food = ncmb.DataStore("food");
          food = new Food();
          user = new ncmb.User({password:"password"});
        })
        it("callback で取得できる", function(done){
          user.set("userName", "pointer_preset_callback");
          food.set("saved", "user_preset_callback");
          user.signUpByAccount()
                   .then(function(obj){
                      food.member = obj;
                      food.save(function(err, data){
                        done(err ? err : null);
                      });
                   })
                   .catch(function(err){
                    done(err);
                   });
        });
        it("promise で取得できる", function(done){
          user.set("userName", "pointer_preset_promise");
          food.set("saved", "user_preset_promise");
          user.signUpByAccount()
                   .then(function(obj){
                      food.member = obj;
                      return food.save();
                   })
                   .then(function(obj){
                    expect(obj).to.have.property("objectId");
                    done();
                   })
                   .catch(function(err){
                    done(err);
                   });
        });
      });
      context("未保存のncmb.Userタイプをプロパティに設定したとき、登録に必要なプロパティが足りなければオブジェクト保存に失敗し", function(){
        var Food = null;
        var food = null;
        var user = null;
        beforeEach(function(){
          Food = ncmb.DataStore("food");
          food = new Food();
          user = new ncmb.User({userName:"user_failure"});
          food.member = user;
        })
        it("callback でエラーを取得できる", function(done){
          food.set("saved", "user_failure_callback");
          food.save(function(err, obj){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });
        it("promise でエラーを取得できる", function(done){
          food.set("saved", "user_failure_promise");
          food.save()
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                done();
              });
        });
      });
    });
  });

  describe("オブジェクト取得", function(){
    describe("クラスからオブジェクト１個取得", function(){
      context("fetch", function(){
        var Food = null;
        before(function(){
          Food = ncmb.DataStore("food");
        });

        it("callback で取得できる", function(done){
          Food.fetch(function(err, obj){
            done(err ? err : null);
          });
        });

        it("promise で取得できる", function(done){
          Food.fetch()
              .then(function(obj){
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
    });

    describe("ObjectIdでオブジェクト取得", function(){
      context("fetchById", function(){
        var Food = null;
        before(function(){
          Food = ncmb.DataStore("food");
        });

        it("callback で取得できる", function(done){
          Food.fetchById(data_callback_id, function(err, obj){
            done(err ? err : null);
          });
        });

        it("promise で取得できる", function(done){
          Food.fetchById(data_promise_id)
              .then(function(newFood){
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
    });
  });

  describe("オブジェクト更新", function(){
    context("update成功", function(){
      var Food = null;
      var food = null;
      before(function(){
        Food = ncmb.DataStore("food");
        food = new Food();
      });

      it("callback で取得できる", function(done){
        food.objectId = data_callback_id;
        food.set("updated", "callback");
        food.update(function(err, obj){
          done(err ? err : null);
        });
      });

      it("promise で取得できる", function(done){
        food.objectId = data_promise_id;
        food.set("updated", "promise");
        food.update()
            .then(function(newFood){
              done();
            })
            .catch(function(err){
              done(err);
            });
      });
    });

    context("update失敗", function(){
      context("objectIdがない理由で", function(){
        var Food = null;
        var food = null;
        before(function(){
          Food = ncmb.DataStore("food");
          food = new Food({key: "value_new"});
        });

        it("callback で取得できる", function(done){
          food.update(function(err, obj){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で取得できる", function(done){
          food.update()
              .then(function(newFood){
                done(new Error("Must throw error"));
              })
              .catch(function(err){
                done();
              });
        });
      });
    });
  });

  describe("オブジェクト削除", function(){
    context("成功した場合", function(){
      var Food = null;
      var food = null;
      beforeEach(function(){
        Food = ncmb.DataStore("food");
        food = new Food({deleted:"undeleted"});
      });

      it("callback で削除結果を取得できる", function(done){
        food.save()
            .then(function(){
                food.delete(function(err){
                  done(err ? err : null);
                });
            })
            .catch(function(err){
                done(err);
            });
      });

      it("promise で削除結果を取得できる", function(done){
        food.save()
            .then(function(){
                return food.delete();
            })
            .then(function(){
              done();
            })
            .catch(function(err){
              done(err);
            });
      });
    });

    context("失敗した理由が", function(){
      context("ObjectId がないときに", function(){
        var Food = null;
        var food = null;
        before(function(){
          Food = ncmb.DataStore("food");
          food = new Food({});
        });

        it("callback で削除結果を取得できる", function(done){
          food.delete(function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で削除結果を取得できる", function(done){
          food.delete()
              .then(function(){
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

  describe("オブジェクト複数操作", function(){
    describe("作成処理を", function(){
      describe("2 つの Object (1 frame 内に収まる) を処理", function(){
        context("成功した場合に", function(){
          var Food = null;
          var foods = [];
          before(function(){
            Food = ncmb.DataStore("Batch");
          });

          it("callbackで取得できる", function(done){
            foods.push(new Food({key: "callback_1"}));
            foods.push(new Food({key: "callback_2"}));
            Food.batch(foods, function(err, list){
              if(err) {
                done(err);
              } else {
                expect(list[0]).to.have.property("objectId");
                expect(list[1]).to.have.property("objectId");
                done();
              }
            });
          });

          it("promise取得できる", function(done){
            foods.push(new Food({key: "promise_1"}));
            foods.push(new Food({key: "promise_2"}));
            Food.batch(foods)
                .then(function(list){
                  expect(list[0]).to.have.property("objectId");
                  expect(list[1]).to.have.property("objectId");
                  done();
                })
                .catch(function(err){
                  done(err);
                });
          });
        });

        context("失敗した場合に", function(){
          var Food = null;
          before(function(){
            Food = ncmb.DataStore("Batch");
          })
          it("saveAll (callback取得できる)", function(done){
            Food.batch([], function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("saveAll (promise取得できる)", function(done){
            Food.batch([])
                .then(function(){
                  done(new Error("失敗すべき"));
                })
                .catch(function(err){
                  expect(err).to.be.an.instanceof(Error);
                  done();
                });
          });
        });
      });

      context("60 の Object (1 frame に収まらない) を処理", function(){
        context("成功した場合に", function(){
          var Food = null;
          before(function(){
            Food = ncmb.DataStore("megafood");
          });
          it("callback で取得できる", function(done){
            var foods = [];
            for(var i = 0; i < 60; i++) {
              foods.push(new Food({key: "value" + i}));
            }
            Food.batch(foods, function(err, list){
              if(err) {
                done(err);
              } else {
                expect(list[0]).to.have.property("objectId");
                done();
              }
            });
          });
        });
      });
    });
  });

  describe("オブジェクト検索", function(){
    describe("fetchAll", function(){
      context("クラス定義が存在しなければ、空のリストが返り", function(){
        var Food = null;
        before(function(){
          Food = ncmb.DataStore("UndefinedClass");
        });
        it("callback で補足できる", function(done){
          Food.fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs).to.be.eql([]);
              done();
            }
          });
        });
        it("promise で補足できる", function(done){
          Food.fetchAll()
              .then(function(objs){
                expect(objs).to.be.eql([]);
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });

      context("クラス定義が存在し、データがなければ、空のリストが返り", function(){
        var NonExist = null;
        before(function(){
          NonExist = ncmb.DataStore("NonExist");
        });
        it("callback で取得できる", function(done){
          NonExist.fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs).to.be.eql([]);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          NonExist.fetchAll()
                  .then(function(objs){
                    expect(objs).to.be.eql([]);
                    done();
                  })
                  .catch(function(err){
                    done(err);
                  });
        });
      });

      context("クラス定義が存在し、データがあれば、リストが返り", function(){
        var FetchList = null;
        before(function(){
          FetchList = ncmb.DataStore("fetchAll");
        });
        it("callback で取得できる", function(done){
          FetchList.fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(2);
              expect(objs[0]).to.have.property("objectId");
              expect(objs[1]).to.have.property("objectId");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          FetchList.fetchAll()
                  .then(function(objs){
                    expect(objs.length).to.be.equal(2);
                    expect(objs[0]).to.have.property("objectId");
                    expect(objs[1]).to.have.property("objectId");
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
