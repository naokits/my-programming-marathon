"use strict";

describe("NCMB Push", function(){
  this.timeout(5000);
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
            expect(obj).to.have.property("objectId");
            done();
          }
        });
      });
      it("promise で取得できる", function(done){
        
        push.send()
            .then(function(obj){
              expect(obj).to.have.property("objectId");
              done();
            })
            .catch(function(err){
              done(err);
            });
      });
    });
  });
});