"use strict";

describe("NCMB Query", function(){
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

  describe("オブジェクト検索", function(){
    var QueryTest = null;
    describe("fetchAll", function(){
      context("検索条件に合致するデータがあれば、リストが返り", function(){
        before(function(){
          QueryTest = ncmb.DataStore("QueryTest");
        });
        it("callback で取得できる", function(done){
          QueryTest.fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(2);
              expect(objs[0].name).to.be.equal("fetchAll_object_1");
              expect(objs[1].name).to.be.equal("fetchAll_object_2");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest.fetchAll()
                  .then(function(objs){
                    expect(objs.length).to.be.equal(2);
                    expect(objs[0].name).to.be.equal("fetchAll_object_1");
                    expect(objs[1].name).to.be.equal("fetchAll_object_2");
                    done();
                  })
                  .catch(function(err){
                    done(err);
                  });
        });
      });
      context("検索条件に合致するデータがなければ、空の配列が返り", function(){
        before(function(){
          QueryTest = ncmb.DataStore("EmptyQueryTest");
        });
        it("callback で取得できる", function(done){
          QueryTest.fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(0);
              expect(objs).to.be.eql([]);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest.fetchAll()
                  .then(function(objs){
                    expect(objs.length).to.be.equal(0);
                    expect(objs).to.be.eql([]);
                    done();
                  })
                  .catch(function(err){
                    done(err);
                  });
        });
      });
    });
    describe("fetch", function(){
      context("検索条件に合致するデータがあれば、その中の一つがオブジェクトが返り", function(){
        before(function(){
          QueryTest = ncmb.DataStore("QueryTestFetch");
        });
        it("callback で取得できる", function(done){
          QueryTest.fetch(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj.name).to.be.equal("fetch_object");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest.fetch()
                  .then(function(obj){
                    expect(obj.name).to.be.equal("fetch_object");
                    done();
                  })
                  .catch(function(err){
                    done(err);
                  });
        });
      });
      context("検索条件に合致するデータがなければ、空のオブジェクトが返り", function(){
        before(function(){
          QueryTest = ncmb.DataStore("EmptyQueryTest");
        });
        it("callback で取得できる", function(done){
          QueryTest.fetch(function(err, obj){
            if(err){
              done(err);
            }else{
              expect(obj).to.be.eql({});
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest.fetch()
                  .then(function(obj){
                    expect(obj).to.be.eql({});
                    done();
                  })
                  .catch(function(err){
                    done(err);
                  });
        });
      });
    });
    describe("fetchById", function(){
      context("指定したobjectIdのデータがあれば、オブジェクトが返り", function(){
        var queryTest = null;
        before(function(){
          QueryTest = ncmb.DataStore("QueryTestById");
        });
        beforeEach(function(){
            queryTest = new QueryTest({name:"fetchById_object"});
        });
        it("callback で取得できる", function(done){
          queryTest.save()
                   .then(function(save_obj){
                      QueryTest.fetchById(save_obj.objectId, function(err, obj){
                        if(err){
                          done(err);
                        }else{
                          expect(obj.objectId).to.be.equal(save_obj.objectId);
                          done();
                        }
                      });
                   })
                   .catch(function(err){
                     done(err)
                   });
          
        });
        it("promise で取得できる", function(done){
          var objectId = null;
          queryTest.save()
                   .then(function(save_obj){
                       objectId = save_obj.objectId;
                      return QueryTest.fetchById(save_obj.objectId);
                   })
                   .then(function(obj){
                     expect(obj.objectId).to.be.equal(objectId);
                     done();
                   })
                   .catch(function(err){
                     done(err)
                   });
        });
      });
      context("指定したobjectIdのデータがなければ、404エラーが返り", function(){
        before(function(){
          QueryTest = ncmb.DataStore("EmptyQueryTest");
        });
        it("callback で取得できる", function(done){
          QueryTest.fetchById("empty_id",function(err, obj){
            if(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            }else{
              done(new Error("失敗すべき"));
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest.fetchById("empty_id")
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
  describe("検索条件追加", function(){
    var QueryTest = null;
    describe("where", function(){
      context("検索条件を指定し、データがあれば、リストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .where({number: 1})
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .where({number: 1})
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がオブジェクト以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWhere");
        try{
          QueryTest.where("{number: 1}");
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("equalTo", function(){
      context("keyの値がvalueと等しいデータを検索した結果のリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .equalTo("number", 1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .equalTo("number", 1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索キーが文字列で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWhere");
        try{
          QueryTest.equalTo(["number"], 1);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("notEqualTo", function(){
      context("keyの値がvalueと等しくないデータを検索した結果のリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .notEqualTo("number", 2)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .notEqualTo("number", 2)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("lessThan", function(){
      context("keyの値がvalueより小さいデータを検索した結果のリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .lessThan("number", 2)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .lessThan("number", 2)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("lessThanOrEqualTo", function(){
      context("keyの値がvalue以下のデータを検索した結果のリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .lessThanOrEqualTo("number", 1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .lessThanOrEqualTo("number", 1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("greaterThan", function(){
      context("keyの値がvalueより大きいデータを検索した結果のリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .greaterThan("number", 1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(2);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .greaterThan("number", 1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(2);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("greaterThanOrEqualTo", function(){
      context("keyの値がvalue以上のデータを検索した結果のリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .greaterThanOrEqualTo("number", 2)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(2);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .greaterThanOrEqualTo("number", 2)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(2);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("in", function(){
      context("keyの値がvalue配列のいずれかと等しいデータを検索した結果のリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .in("number", [1,3,4])
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .in("number", [1,3,4])
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件が配列以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWhere");
        try{
          QueryTest.in("number", 1);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("notIn", function(){
      context("keyの値がvalue配列のいずれとも等しくないデータを検索した結果のリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .notIn("number", [2,3,4])
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .notIn("number", [2,3,4])
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件が配列以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWhere");
        try{
          QueryTest.notIn("number", 1);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("exists", function(){
      context("valueがtrueのとき、keyに値が存在するデータを検索した結果のリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .exists("exist", true)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .exists("exist", true)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("valueがfalseのとき、keyに値が存在しないデータを検索した結果のリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .exists("exist", false)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(2);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .exists("exist", false)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(2);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件が真偽値以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWhere");
        try{
          QueryTest.exists("number", 1);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("regularExpressionTo", function(){
      context("keyの値がvalueの正規表現を含むデータを検索した結果のリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .regularExpressionTo("name", "object")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .regularExpressionTo("name", "object")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("前方一致を指定し、データを検索した結果のリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .regularExpressionTo("name", "^abc")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .regularExpressionTo("name", "^abc")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("後方一致を指定し、データを検索した結果のリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .regularExpressionTo("name", "2$")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(2);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .regularExpressionTo("name", "2$")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(2);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件が文字列以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWhere");
        try{
          QueryTest.regularExpressionTo("name", 1);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("inArray", function(){
      context("keyの値がvalue配列のいずれかを含む配列のデータを検索した結果のリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .inArray("array", [1,3,7])
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .inArray("array", [1,3,7])
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("検索条件を配列以外で指定でき、条件に合うデータを検索した結果のリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .inArray("array", 1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .inArray("array", 1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("notInArray", function(){
      context("keyの値がvalue配列のいずれも含まない配列のデータを検索した結果のリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .notInArray("array", [2,4,7])
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .notInArray("array", [2,4,7])
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("検索条件を配列以外で指定でき、条件に合うデータを検索した結果のリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .notInArray("array", 4)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .notInArray("array", 4)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("allInArray", function(){
      context("keyの値がvalue配列のすべてを含む配列のデータを検索した結果のリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .allInArray("array", [1,3,5])
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .allInArray("array", [1,3,5])
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("検索条件を配列以外で指定でき、条件に合致するデータを検索した結果のリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .allInArray("array", 1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .allInArray("array", 1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("near", function(){
      context("keyの値が位置情報のデータがあれば、valueの位置から近い順のリストが返り", function(){
        var geoPoint = null;
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
          geoPoint = new ncmb.GeoPoint(0,0);
        });
        it("callback で取得できる", function(done){
          QueryTest
          .near("location", geoPoint)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(2);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .near("location", geoPoint)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(2);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がncmb.GeoPoint以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWhere");
        try{
          QueryTest.near("location", [0, 0]);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("withinKilometers", function(){
      context("keyの値が位置情報のデータがあれば、指定したKmの範囲内でvalueの位置から近い順のリストが返り", function(){
        var geoPoint = null;
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
          geoPoint = new ncmb.GeoPoint(0,0);
        });
        it("callback で取得できる", function(done){
          QueryTest
          .withinKilometers("location", geoPoint, 1000)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .withinKilometers("location", geoPoint, 1000)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がncmb.GeoPoint以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWhere");
        try{
          QueryTest.withinKilometers("location", [0, 0], 1000);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("withinMiles", function(){
      context("keyの値が位置情報のデータがあれば、指定したマイルの範囲内でvalueの位置から近い順のリストが返り", function(){
        var geoPoint = null;
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
          geoPoint = new ncmb.GeoPoint(0,0);
        });
        it("callback で取得できる", function(done){
          QueryTest
          .withinMiles("location", geoPoint, 1000)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .withinMiles("location", geoPoint, 1000)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がncmb.GeoPoint以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWhere");
        try{
          QueryTest.withinMiles("location", [0, 0], 1000);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("withinRadians", function(){
      context("keyの値が位置情報のデータがあれば、指定したラジアンの範囲内でvalueの位置から近い順のリストが返り", function(){
        var geoPoint = null;
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
          geoPoint = new ncmb.GeoPoint(0,0);
        });
        it("callback で取得できる", function(done){
          QueryTest
          .withinRadians("location", geoPoint, 0.5)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .withinRadians("location", geoPoint, 0.5)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がncmb.GeoPoint以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWhere");
        try{
          QueryTest.withinRadians("location", [0, 0], 0.5);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("withinSquare", function(){
      context("keyの値が指定した矩形内の位置情報のデータを検索した結果のリストが返り", function(){
        var swPoint = null;
        var nePoint = null;
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
          swPoint = new ncmb.GeoPoint(0,0);
          nePoint = new ncmb.GeoPoint(80, 80);
        });
        it("callback で取得できる", function(done){
          QueryTest
          .withinSquare("location", swPoint, nePoint)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .withinSquare("location", swPoint, nePoint)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がncmb.GeoPoint以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWhere");
        try{
          QueryTest.withinSquare("location", [0, 0], [100, 100]);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });

    describe("or", function(){
      context("複数の検索条件を配列で指定し、いずれかに合致するデータの検索結果が返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .or([QueryTest.greaterThan("number",2),
               QueryTest.lessThan("number",2)])
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .or([QueryTest.greaterThan("number",2),
               QueryTest.lessThan("number",2)])
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("複数回条件を指定したとき、すべての条件に合致する検索結果が返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .or([QueryTest.greaterThan("number",2)])
          .or([QueryTest.lessThan("number",2)])
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .or([QueryTest.greaterThan("number",2)])
          .or([QueryTest.lessThan("number",2)])
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("単一条件を配列に入れずに直接追加することができ、条件に合う検索結果が返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .or([QueryTest.greaterThan("number",2)])
          .or(QueryTest.lessThan("number",2))
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .or([QueryTest.greaterThan("number",2)])
          .or(QueryTest.lessThan("number",2))
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がクエリ以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWhere");
        try{
          QueryTest.or({number:1});
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("select", function(){
      var SubQuery = null;
      context("keyの値が、サブクエリの検索結果がsubkeyに持つ値のいずれかと一致するオブジェクトを検索した結果が返り", function(){
        beforeEach(function(){
          SubQuery = ncmb.DataStore("QuerySelect");
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .select("number", "No", SubQuery.greaterThan("No",1))
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(2);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .select("number", "No", SubQuery.greaterThan("No",1))
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(2);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がクエリ以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QuerySelect");
        try{
          QueryTest.select("number", "No", {No:1});
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
      it("keyが文字列以外で指定されたとき、エラーが返る", function(done){
        SubQuery = ncmb.DataStore("SubQuery");
        QueryTest = ncmb.DataStore("QueryTestSelect");
        try{
          QueryTest.select(["number"], "No", SubQuery.greaterThan("No",1));
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
      it("subkeyが文字列以外で指定されたとき、エラーが返る", function(done){
        SubQuery = ncmb.DataStore("SubQuery");
        QueryTest = ncmb.DataStore("QueryTestSelect");
        try{
          QueryTest.select("number", ["No"], SubQuery.greaterThan("No",1));
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
      it("Userクラスの検索条件を指定できる", function(done){
        QueryTest = ncmb.DataStore("QuerySelect");
        try{
          QueryTest.select("Mayer", "name", ncmb.User.equalTo("post","Mayer"));
          done();
        }catch(err){
          done(err);
        }
      });
      it("Roleクラスの検索条件を指定できる", function(done){
        QueryTest = ncmb.DataStore("QuerySelect");
        try{
          QueryTest.select("class", "classname", ncmb.Role.equalTo("course","upper"));
          done();
        }catch(err){
          done(err);
        }
      });
    });
    describe("relatedTo", function(){
      var BaseClass = null;
      var baseObj = null;
      context("設定したオブジェクトのkeyに関連づけられているオブジェクトを検索した結果が返り", function(){
        var relation = null;
        var queryTest = null;
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestRelated");
          BaseClass = ncmb.DataStore("BaseClass");
          queryTest = new QueryTest();
          relation = new ncmb.Relation();
          relation.add(queryTest);
          baseObj = new BaseClass({belongs:relation});
        });
        it("callback で取得できる", function(done){
          queryTest.set("name", "related_callback");
          baseObj.save()
                 .then(function(){
                   QueryTest
                   .relatedTo(baseObj, "belongs")
                   .fetchAll(function(err, objs){
                     if(err){
                       done(err);
                     }else{
                       expect(objs.length).to.be.equal(1);
                       expect(objs[0].name).to.be.equal("related_callback");
                       done();
                     }
                   });  
                 })
                 .catch(function(err){
                     done(err);
                 });
            
          
        });
        it("promise で取得できる", function(done){
          queryTest.set("name", "related_promise");
          baseObj.save()
                 .then(function(){
                   return QueryTest
                          .relatedTo(baseObj, "belongs")
                          .fetchAll();  
                 })
                 .then(function(objs){
                   expect(objs.length).to.be.equal(1);
                   expect(objs[0].name).to.be.equal("related_promise");
                   done();
                 })
                 .catch(function(err){
                     done(err);
                 });
        });
      });
      it("ncmb.Userの関連オブジェクトを検索できる", function(done){
        QueryTest = ncmb.DataStore("QueryTestRelatedTo");
        var user = new ncmb.User();
        user.objectId = "user_id";
        try{
          QueryTest
          .relatedTo(user, "belongs");
          done();
        }catch(err){
          done(err);
        }
      });
      it("ncmb.Roleの関連オブジェクトを検索できる", function(done){
        QueryTest = ncmb.DataStore("QueryTestRelatedTo");
        var role = new ncmb.Role("related_role");
        role.objectId = "role_id";
        try{
          QueryTest
          .relatedTo(role, "belongs");
          done();
        }catch(err){
          done(err);
        }
      });

      it("objectがobjectIdを持たないときエラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestRelatedTo");
        BaseClass = ncmb.DataStore("BaseClass");
        baseObj = new BaseClass();
        try{
          QueryTest
          .relatedTo(baseObj, "belongs");
          done(new Error("失敗すべき"));
        }catch(err){
          done();
        }
      });
      it("objectがncmbオブジェクトでないときエラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestRelatedTo");
        try{
          QueryTest
          .relatedTo({name:"name"}, "belongs");
          done(new Error("失敗すべき"));
        }catch(err){
          done();
        }
      });
      it("keyが文字列でないときエラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestRelatedTo");
        BaseClass = ncmb.DataStore("BaseClass");
        baseObj = new BaseClass();
        baseObj.objectId = "base_id";
        try{
          QueryTest
          .relatedTo(baseObj, ["belongs"]);
          done(new Error("失敗すべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("inQuery", function(){
      var SubQuery = null;
      context("サブクエリの検索結果のいずれかのポインタをkeyに持つオブジェクトを検索した結果が返り", function(){
        var subQuery = null;
        var queryTest = null;
        beforeEach(function(){
          SubQuery = ncmb.DataStore("Pointed");
          QueryTest = ncmb.DataStore("QueryTestInQuery");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .inQuery("pointer", SubQuery.equalTo("status","pointed"))
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .inQuery("pointer", SubQuery.equalTo("status","pointed"))
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("検索条件がクエリ以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestInQuery");
        try{
          QueryTest.inQuery("pointer", {status:"pointed"});
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
      it("keyが文字列以外で指定されたとき、エラーが返る", function(done){
        SubQuery = ncmb.DataStore("SubQuery");
        QueryTest = ncmb.DataStore("QueryTestInQuery");
        try{
          QueryTest.inQuery(["pointer"], SubQuery.equalTo("status","pointed"));
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
      it("Userクラスの検索条件を指定できる", function(done){
        QueryTest = ncmb.DataStore("QueryTestInQuery");
        try{
          QueryTest.inQuery("pointer", ncmb.User.equalTo("status","pointed"));
          done();
        }catch(err){
          done(err);
        }
      });
      it("Roleクラスの検索条件を指定できる", function(done){
        QueryTest = ncmb.DataStore("QueryTestInQuery");
        try{
          QueryTest.inQuery("pointer", ncmb.Role.equalTo("status","pointed"));
          done();
        }catch(err){
          done(err);
        }
      });
    });

    describe("include", function(){
      context("指定したkeyのポインタの中身を含めたオブジェクトが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestInQuery");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .include("pointer")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].pointer.status).to.be.equal("pointed");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .include("pointer")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].pointer.status).to.be.equal("pointed");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("複数のkeyを指定したとき、最後に設定したキーを反映し、", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestInQuery");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .include("pointer")
          .include("object")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              expect(objs[0].object.status).to.be.equal("in_object");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .include("pointer")
          .include("object")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            expect(objs[0].object.status).to.be.equal("in_object");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("keyが文字列以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestInQuery");
        try{
          QueryTest.include(["number"]);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("count", function(){
      context("設定するとリスト共に件数が返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .count()
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(2);
              expect(objs.count).to.be.equal(2);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .count()
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(2);
            expect(objs.count).to.be.equal(2);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
    });
    describe("order", function(){
      context("指定したkeyの昇順でリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .order("number")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(2);
              expect(objs[0].number).to.be.equal(1);
              expect(objs[1].number).to.be.equal(2);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .order("number")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(2);
            expect(objs[0].number).to.be.equal(1);
            expect(objs[1].number).to.be.equal(2);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("descendingフラグをtrueにすると降順でリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .order("number", true)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(2);
              expect(objs[0].number).to.be.equal(2);
              expect(objs[1].number).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .order("number", true)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(2);
            expect(objs[0].number).to.be.equal(2);
            expect(objs[1].number).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("複数の条件を指定して検索するとリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .order("number")
          .order("descending")
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(2);
              expect(objs[0].number).to.be.equal(1);
              expect(objs[1].number).to.be.equal(2);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .order("number")
          .order("createDate")
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(2);
            expect(objs[0].number).to.be.equal(1);
            expect(objs[1].number).to.be.equal(2);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("descendingフラグが真偽値以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWhere");
        try{
          QueryTest.order("number", "true");
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
      it("keyが文字列以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWhere");
        try{
          QueryTest.order(["number"]);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("limit", function(){
      context("指定した件数だけリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .limit(1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .limit(1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("複数回実行すると最後に設定した件数でリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .limit(50)
          .limit(1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .limit(50)
          .limit(1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("件数が数字以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWhere");
        try{
          QueryTest.limit("1");
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
      it("件数が設定可能範囲より大きく指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWhere");
        try{
          QueryTest.limit(1001);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
      it("件数が設定可能範囲より小さく指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWhere");
        try{
          QueryTest.limit(0);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
    describe("skip", function(){
      context("指定した件数だけ取得開始位置を後ろにしたリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .skip(1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .skip(1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("複数回実行すると最後に設定した条件でリストが返り", function(){
        beforeEach(function(){
          QueryTest = ncmb.DataStore("QueryTestWhere");
        });
        it("callback で取得できる", function(done){
          QueryTest
          .skip(50)
          .skip(1)
          .fetchAll(function(err, objs){
            if(err){
              done(err);
            }else{
              expect(objs.length).to.be.equal(1);
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          QueryTest
          .skip(50)
          .skip(1)
          .fetchAll()
          .then(function(objs){
            expect(objs.length).to.be.equal(1);
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      it("引数が負の値で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWhere");
        try{
          QueryTest.skip(-1);
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
      it("引数が数値以外で指定されたとき、エラーが返る", function(done){
        QueryTest = ncmb.DataStore("QueryTestWhere");
        try{
          QueryTest.skip("1");
          done(new Error("失敗するべき"));
        }catch(err){
          done();
        }
      });
    });
  });
});
