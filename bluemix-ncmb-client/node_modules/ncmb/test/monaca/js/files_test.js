"use strict";

describe("NCMB Files", function(){
  this.timeout(20000);
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

  describe("ファイル取得", function(){
    context("クラスメソッドで呼び出し", function(){
      context("成功した場合", function(){
        it("callback でレスポンスを取得できる", function(done){
          ncmb.File.download("fetch_file.text", function(err, file){
            done(err ? err : null);
          });
        });

        it("promise でレスポンスを取得できる", function(done){
          ncmb.File.download("fetch_file.text")
          .then(function(file){
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });

      context("失敗した理由が", function(){
        context("fileName がないときに", function(){

          it("callback で取得時エラーを取得できる", function(done){
            ncmb.File.download(null, function(err, file){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise で取得時エラーを取得できる", function(done){
            ncmb.File.download()
            .then(function(file){
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
  });

describe("ファイルACL更新", function(){
    context("成功した場合", function(){
      var fileName = null;
      var acl = null;
      beforeEach(function(){
        acl = new ncmb.Acl();
      });

      it("callback でレスポンスを取得できる", function(done){
        acl.setRoleWriteAccess("relation_sub", true);
        fileName = "update_callback.text";
        ncmb.File.updateACL(fileName, acl, function(err, data){
          if(err){
            done(err);
          }else{
            expect(data).to.have.property("updateDate");
            done();
          }
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        acl.setRoleReadAccess("relation_sub", true);
        fileName = "update_promise.text";
        ncmb.File.updateACL(fileName, acl)
        .then(function(data){
          expect(data).to.have.property("updateDate");
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("失敗した理由が", function(){
      var fileName = null;
      var acl = null;
      context("fileName がないときに", function(){
        beforeEach(function(){
          fileName = null;
          acl = new ncmb.Acl();
          acl.setRoleWriteAccess("relation_sub", false)
             .setRoleReadAccess("relation_sub", true);
        });

        it("callback で更新時エラーを取得できる", function(done){
          ncmb.File.updateACL(fileName, acl, function(err){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で更新時エラーを取得できる", function(done){
          ncmb.File.updateACL(fileName, acl)
          .then(function(){
            done(new Error("失敗すべき"));
          })
          .catch(function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });
      });

      context("acl がないときに", function(){
        beforeEach(function(){
          fileName = "update_file.text";
          acl = null;
        });

        it("callback で更新時エラーを取得できる", function(done){
          fileName = "update_callback.text";
          ncmb.File.updateACL(fileName, acl, function(err){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で更新時エラーを取得できる", function(done){
          fileName = "update_promise.text";
          ncmb.File.updateACL(fileName, acl)
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

  describe("ファイル削除", function(){
    context("成功した場合", function(){

      it("callback でレスポンスを取得できる", function(done){
        ncmb.File.delete("upload_callback.text", function(err){
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        ncmb.File.delete("upload_promise.text")
        .then(function(){
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("失敗した理由が", function(){
      context("fileName がないときに", function(){

        it("callback で削除時エラーを取得できる", function(done){
          ncmb.File.delete(null, function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で削除時エラーを取得できる", function(done){
          ncmb.File.delete(null)
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
});
