"use strict";

describe("NCMB Operation", function(){
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
  describe("プロパティ設定", function(){
    var user = null;
    context("set", function(){
      beforeEach(function(){
        user = new ncmb.User();
      });
      it("指定したkeyのプロパティにvalueを設定できる", function(done){
        user.set("key", "value");
        expect(user.key).to.be.eql("value");
        done();
      });
      it("指定したkeyが文字列でないとき、エラーが返る", function(done){
        try{
          user.set(["key"], "value");
          done("失敗すべき");
        }catch(err){
          expect(err).to.be.an.instanceof(Error);
          done();
        }
      });
      it("指定したkeyが設定不可だったとき、エラーが返る", function(done){
        try{
          user.set("className", "value");
          done("失敗すべき");
        }catch(err){
          expect(err).to.be.an.instanceof(Error);
          done();
        }
      });
    });
  });

  describe("プロパティ取得", function(){
    var user = null;
    context("get", function(){
      beforeEach(function(){
        user = new ncmb.User();
      });
      it("指定したkeyのプロパティの値を取得できる", function(done){
        user.key = "value";
        expect(user.get("key")).to.be.eql("value");
        done();
      });
      it("undefinedとnullを判別して取得できる", function(done){
        user.isNull = null;
        expect(user.get("isNull")).to.be.eql(null);
        expect(user.get("isUnset")).to.be.eql(undefined);
        done();
      });
      it("指定したkeyが文字列でないとき、エラーが返る", function(done){
        try{
          var value = user.get(["key"]);
          done("失敗すべき");
        }catch(err){
          expect(err).to.be.an.instanceof(Error);
          done();
        }
      });
    });
  });

  describe("更新オペレーション設定", function(){
    var user = null;
    context("setIncrement", function(){
      beforeEach(function(){
        user = new ncmb.User();
      });
      it("keyとamountを指定した場合、keyのプロパティにオペレーションを設定できる", function(done){
        user.setIncrement("key", 2);
        expect(user.key).to.be.eql({__op:"Increment", amount: 2});
        done();
      });
      it("keyのみを指定した場合、keyのプロパティにamountが1のオペレーションを設定できる", function(done){
        user.setIncrement("key");
        expect(user.key).to.be.eql({__op:"Increment", amount: 1});
        done();
      });
      it("複数回実行した場合、amountが各入力値の合計値のオペレーションを設定できる", function(done){
        user.setIncrement("key", 3);
        user.setIncrement("key", 2);
        expect(user.key).to.be.eql({__op:"Increment", amount: 5});
        done();
      });
      it("メソッドチェインで連続実行できる", function(done){
        user.setIncrement("key", 3).setIncrement("key");
        expect(user.key).to.be.eql({__op:"Increment", amount: 4});
        done();
      });
      it("他のオペレーションメソッドを上書きできる", function(done){
        user.add("key", ["apple"]).setIncrement("key");
        expect(user.key).to.be.eql({__op:"Increment", amount: 1});
        done();
      });
      it("amountがnumber以外のとき、エラーが返る", function(done){
        expect(function(){
          user.setIncrement("key","1");
        }).to.throw(Error);
        done();
      });
      it("keyが変更禁止のとき、エラーが返る", function(done){
        expect(function(){
          user.setIncrement("save",1);
        }).to.throw(Error);
        done();
      });
    });
    context("add", function(){
      var arr =  null;
      beforeEach(function(){
        user = new ncmb.User();
      });
      it("keyとobjectsを指定した場合、keyのプロパティにオペレーションを設定できる", function(done){
        user.add("key", [1,2,3]);
        expect(user.key).to.be.eql({__op:"Add", objects: [1,2,3]});
        done();
      });
      it("objectsに配列以外を指定した場合、要素数1の配列に変換してプロパティにオペレーションを設定できる", function(done){
        user.add("key", 1);
        expect(user.key).to.be.eql({__op:"Add", objects: [1]});
        done();
      });
      it("複数回実行した場合、objectsが各入力を連結した配列のオペレーションを設定できる", function(done){
        user.add("key", [1,2,3]);
        user.add("key", [4,5,6]);
        expect(user.key).to.be.eql({__op:"Add", objects: [1,2,3,4,5,6]});
        done();
      });
      it("メソッドチェインで連続実行できる", function(done){
        user.add("key", [1,2,3]).add("key", [4,5,6]);
        expect(user.key).to.be.eql({__op:"Add", objects: [1,2,3,4,5,6]});
        done();
      });
      it("他のオペレーションメソッドを上書きできる", function(done){
        user.remove("key", ["apple"]).add("key", [1,2,3]);
        expect(user.key).to.be.eql({__op:"Add", objects: [1,2,3]});
        done();
      });
      it("keyが変更禁止のとき、エラーが返る", function(done){
        expect(function(){
          user.add("save",[1,2,3]);
        }).to.throw(Error);
        done();
      });
      it("objectsがないとき、エラーが返る", function(done){
        expect(function(){
          user.add("key");
        }).to.throw(Error);
        done();
      });
    });
    context("addUnique", function(){
      var arr =  null;
      beforeEach(function(){
        user = new ncmb.User();
      });
      it("keyとobjectsを指定した場合、keyのプロパティにオペレーションを設定できる", function(done){
        user.addUnique("key", [1,2,3]);
        expect(user.key).to.be.eql({__op:"AddUnique", objects: [1,2,3]});
        done();
      });
      it("objectsに配列以外を指定した場合、要素数1の配列に変換してプロパティにオペレーションを設定できる", function(done){
        user.addUnique("key", 1);
        expect(user.key).to.be.eql({__op:"AddUnique", objects: [1]});
        done();
      });
      it("複数回実行した場合、objectsが各入力を連結した配列のオペレーションを設定できる", function(done){
        user.addUnique("key", [1,2,3]);
        user.addUnique("key", [4,5,6]);
        expect(user.key).to.be.eql({__op:"AddUnique", objects: [1,2,3,4,5,6]});
        done();
      });
      it("メソッドチェインで連続実行できる", function(done){
        user.addUnique("key", [1,2,3]).addUnique("key", [4,5,6]);
        expect(user.key).to.be.eql({__op:"AddUnique", objects: [1,2,3,4,5,6]});
        done();
      });
      it("他のオペレーションメソッドを上書きできる", function(done){
        user.remove("key", ["apple"]).addUnique("key", [1,2,3]);
        expect(user.key).to.be.eql({__op:"AddUnique", objects: [1,2,3]});
        done();
      });
      it("keyが変更禁止のとき、エラーが返る", function(done){
        expect(function(){
          user.addUnique("save",[1,2,3]);
        }).to.throw(Error);
        done();
      });
      it("objectsがないとき、エラーが返る", function(done){
        expect(function(){
          user.addUnique("key");
        }).to.throw(Error);
        done();
      });
      it("重複する値が入力されたとき、エラーが返る", function(done){
        expect(function(){
          user.addUnique("key",[1,2,3])
              .addUnique("key",1);
        }).to.throw(Error);
        done();
      });
    });
    context("remove", function(){
      var arr =  null;
      beforeEach(function(){
        user = new ncmb.User();
      });
      it("keyとobjectsを指定した場合、keyのプロパティにオペレーションを設定できる", function(done){
        user.remove("key", [1,2,3]);
        expect(user.key).to.be.eql({__op:"Remove", objects: [1,2,3]});
        done();
      });
      it("objectsに配列以外を指定した場合、要素数1の配列に変換してプロパティにオペレーションを設定できる", function(done){
        user.remove("key", 1);
        expect(user.key).to.be.eql({__op:"Remove", objects: [1]});
        done();
      });
      it("複数回実行した場合、objectsが各入力を連結した配列のオペレーションを設定できる", function(done){
        user.remove("key", [1,2,3]);
        user.remove("key", [4,5,6]);
        expect(user.key).to.be.eql({__op:"Remove", objects: [1,2,3,4,5,6]});
        done();
      });
      it("メソッドチェインで連続実行できる", function(done){
        user.remove("key", [1,2,3]).remove("key", [4,5,6]);
        expect(user.key).to.be.eql({__op:"Remove", objects: [1,2,3,4,5,6]});
        done();
      });
      it("他のオペレーションメソッドを上書きできる", function(done){
        user.add("key", ["apple"]).remove("key", [1,2,3]);
        expect(user.key).to.be.eql({__op:"Remove", objects: [1,2,3]});
        done();
      });
      it("keyが変更禁止のとき、エラーが返る", function(done){
        expect(function(){
          user.remove("save",[1,2,3]);
        }).to.throw(Error);
        done();
      });
      it("objectsがないとき、エラーが返る", function(done){
        expect(function(){
          user.remove("key");
        }).to.throw(Error);
        done();
      });
    });
  });
});
