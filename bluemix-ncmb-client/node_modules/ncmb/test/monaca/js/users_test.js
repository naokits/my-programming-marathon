"use strict";

describe("NCMB Users", function(){
  this.timeout(10000);
  var ncmb = null;
  var mailAddress_signup_callback = "signup_callback@email.com";
  var mailAddress_signup_promise  = "signup_promiss@email.com";
  var mailAddress_callback = "callback@email.com";
  var mailAddress_promise  = "promise@email.com";
  before(function(){
    ncmb = new NCMB(config.apikey, config.clientkey );
    if(config.apiserver){
      ncmb
      .set("protocol", config.apiserver.protocol || "http:")
      .set("fqdn", config.apiserver.fqdn)
      .set("port", config.apiserver.port)
      .set("proxy", config.apiserver.port || "");
    }
  });
  
  describe("インスタンス生成", function(){
    it("プロパティをconstructorで指定し、取得できる", function(done){
      var user = new ncmb.User({userName: "username"});
      expect(user.userName).to.be.equal("username");
      done();
    });
    it("変更許可のないキーを指定した場合、値を変更できない", function(done){
      var user = new ncmb.User({save: "overwrite"});
      try{
        expect(user.save).to.be.equal("overwrite");
        done(new Error("失敗すべき"));
      }catch(err){
        done();
      }
    });
  });
  
  var id_callback_objectId = null;
  var id_promise_objectId  = null;

  describe("ID/PWでユーザー登録", function(){
    context("登録に成功した場合", function(){
      var name_user = null;
      beforeEach(function(){
        name_user = new ncmb.User({password:"password"});
      });

      it("callback でレスポンスを取得できる", function(done){
        name_user.set("userName", "id_callback");
        name_user.signUpByAccount(function(err){
          id_callback_objectId = name_user.objectId;
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        name_user.set("userName", "id_promise");
        name_user.signUpByAccount()
        .then(function(){
          id_promise_objectId = name_user.objectId;
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("失敗した理由が", function(){
      var noName_user = null;
      context("userName がないときに", function(){
        beforeEach(function(){
          noName_user = new ncmb.User({password: "password"});
        });

        it("callback で登録時エラーを取得できる", function(done){
          noName_user.signUpByAccount(function(err){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で登録時エラーを取得できる", function(done){
          noName_user.signUpByAccount()
          .then(function(){
             done(new Error("失敗すべき"));
          })
          .catch(function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });
      });

      var noPass_user = null;
      context("password がないときに", function(){
        beforeEach(function(){
          noPass_user = new ncmb.User({userName: "Tarou"});
        });

        it("callback で登録時エラーを取得できる", function(done){
          noPass_user.signUpByAccount(function(err){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で登録時エラーを取得できる", function(done){
          noPass_user.signUpByAccount()
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

  describe("ユーザー登録メール送信", function(){
    context("成功した場合", function(){

      it("callback でレスポンスを取得できる", function(done){
        ncmb.User.requestSignUpEmail(mailAddress_signup_callback, function(err, data){
          done(err ? err : null);
        });
      });

      it("promise でレスポンスを取得できる", function(done){
        ncmb.User.requestSignUpEmail(mailAddress_signup_promise)
        .then(function(data){
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("失敗した理由が", function(){
      context("mailAddress がないときに", function(){

        it("callback で送信時エラーを取得できる", function(done){
          ncmb.User.requestSignUpEmail(null, function(err, data){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で送信時エラーを取得できる", function(done){
          ncmb.User.requestSignUpEmail()
          .then(function(data){
             done(new Error("失敗すべき"));
          })
          .catch(function(err){
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });
      });

      context("mailAddress が登録済みのときに", function(){

        it("callback で送信時エラーを取得できる", function(done){
          ncmb.User.requestSignUpEmail(mailAddress_callback, function(err, data){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で送信時エラーを取得できる", function(done){
          ncmb.User.requestSignUpEmail(mailAddress_promise)
          .then(function(data){
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
  
  var sessionToken_callback = null;
  var sessionToken_promise = null;
  describe("ID/PWユーザでログイン", function(){
    var user = null;
    var userName = null;
    var password = null;
    describe("login", function(){
      context("プロパティにuserName, passwordがあればログインに成功して", function(){
        beforeEach(function(){
          password = "password";
          user = new ncmb.User({password: password});
        });
        it("callback でレスポンスを取得できる", function(done){
          user.set("userName", "id_callback");
          user.login(function(err, data){
            expect(data).to.have.property("sessionToken");
            sessionToken_callback = data.sessionToken;
            done(err ? err : null);
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.set("userName", "id_promise");
          user.login()
          .then(function(data){
            expect(data).to.have.property("sessionToken");
            sessionToken_promise = data.sessionToken;
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("プロパティにsessionTokenがあれば自分自身を返却して", function(){
        beforeEach(function(){
          user = new ncmb.User();
        });
        it("callback で取得できる", function(done){
          user.set("sessionToken", sessionToken_callback);
          user.login(function(err, data){
            if(err){
                done(err);
            }else{
                expect(data).to.have.property("sessionToken");
                done();
            }
          });
        });
        it("promise で取得できる", function(done){
          user.set("sessionToken", sessionToken_callback);
          user.login()
          .then(function(data){
            expect(data).to.have.property("sessionToken");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("失敗した理由が", function(){
        context("username プロパティがない場合", function(){
          beforeEach(function(){
            password = "passwd";
            user = new ncmb.User({password: password});
          });
         
          it("callback でログインエラーを取得できる", function(done){
            user.login(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise でログインエラーを取得できる", function(done){
            user.login()
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });
        context("password プロパティがない場合", function(){
          beforeEach(function(){
            userName = "name";
            user = new ncmb.User({userName: userName});
          });
         
          it("callback でログインエラーを取得できる", function(done){
            user.login(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise でログインエラーを取得できる", function(done){
            user.login()
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });
        context("username プロパティの値がない場合", function(){
          beforeEach(function(){
            userName  = null;
            password = "passwd";
            user = new ncmb.User({userName: userName, password: password}); 
          });
         
          it("callback でログインエラーを取得できる", function(done){
            user.login(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise でログインエラーを取得できる", function(done){
            user.login()
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });
        context("password プロパティの値がない場合", function(){
          beforeEach(function(){
            userName  = "name";
            password = null;
            user = new ncmb.User({userName: userName, password: password}); 
          });
         
          it("callback でログインエラーを取得できる", function(done){
            user.login(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise でログインエラーを取得できる", function(done){
            user.login()
            .then(function(data){
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

    describe("User.login", function(){
      context("ncmb.Userのインスタンスでログインした場合", function(){
        context("プロパティにuserName, passwordがあればログインに成功して", function(){
          beforeEach(function(){
            password = "password";
            user = new ncmb.User({password: password});
          });
          it("callback でレスポンスを取得できる", function(done){
            user.set("userName", "id_callback");
            ncmb.User.login(user, function(err, data){
              expect(data).to.have.property("sessionToken");
              done(err ? err : null);
            });
          });
          it("promise でレスポンスを取得できる", function(done){
            user.set("userName", "id_promise");
            ncmb.User.login(user)
            .then(function(data){
              expect(data).to.have.property("sessionToken");
              done();
            })
            .catch(function(err){
              done(err);
            });
          });
        });
        context("プロパティにsessionTokenがあれば自分自身を返却して", function(){
          beforeEach(function(){
            user = new ncmb.User({userName:"name", password:"password"});
          });
          it("callback で取得できる", function(done){
            user.set("sessionToken", sessionToken_callback);
            ncmb.User.login(user, function(err, data){
              if(err){
                  done(err);
              }else{
                expect(data).to.have.property("sessionToken");
                done();
              }
            });
          });
          it("promise で取得できる", function(done){
            user.set("sessionToken", sessionToken_promise);
            ncmb.User.login(user)
            .then(function(data){
              expect(data).to.have.property("sessionToken");
              done();
            })
            .catch(function(err){
              done(err);
            });
          });
        });
        context("失敗した理由が", function(){
          context("username プロパティがない場合", function(){
            beforeEach(function(){
              password = "passwd";
              user = new ncmb.User({password: password});
            });
           
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.login(user, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });

            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.login(user)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });
          context("password プロパティがない場合", function(){
            beforeEach(function(){
              userName = "name"
              user = new ncmb.User({userName: userName});
            });
           
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.login(user, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });

            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.login(user)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });
          context("username プロパティの値がない場合", function(){
            beforeEach(function(){
              userName  = null;
              password = "passwd";
              user = new ncmb.User({userName: userName, password: password}); 
            });
           
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.login(user, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });

            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.login(user)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });
          context("password プロパティの値がない場合", function(){
            beforeEach(function(){
              userName  = "name";
              password = null;
              user = new ncmb.User({userName: userName, password: password}); 
            });
           
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.login(user, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });

            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.login(user)
              .then(function(data){
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
      
      context("userName, password でログインした場合", function(){
        context("userName, passwordが存在すればログインに成功して", function(){
          beforeEach(function(){
            password = "password";
          });
          it("callback でレスポンスを取得できる", function(done){
            userName = "id_callback";
            ncmb.User.login(userName, password, function(err, data){
              expect(data).to.have.property("sessionToken");
              done(err ? err : null);
            });
          });

          it("promise でレスポンスを取得できる", function(done){
            userName = "id_promise";
            ncmb.User.login(userName, password)
            .then(function(data){
              expect(data).to.have.property("sessionToken");
              done();
            })
            .catch(function(err){
              done(err);
            });
          });
        });
        context("失敗した理由が", function(){
          context("usernameの値がない場合", function(){
            beforeEach(function(){
              userName  = null;
              password = "password";
            });
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.login(userName, password, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.login(userName, password)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });
          context("passwordの値がない場合", function(){
            beforeEach(function(){
              userName  = "name";
              password = null;
            });
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.login(userName, password, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.login(userName, password)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });
          context("引数が足りない場合", function(){
            beforeEach(function(){
              userName  = "name";
            });
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.login(userName, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.login(userName)
              .then(function(data){
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
  });
  
  describe("カレントユーザ確認",function(){
    describe("getCurrentUser", function(){
      context("ログイン中のユーザを取得し、", function(){
        it("存在すれば取得に成功する", function(done){
          var user = new ncmb.User({userName:"id_callback",password:"password"});
          ncmb.User.login(user, function(err, data){
            try{
              expect(ncmb.User.getCurrentUser().userName).to.be.eql("id_callback");
              done();
            }catch(err){
              done(err);
            }
          });
        });
        it("存在しなければ null が返る", function(done){
          ncmb.User.logout(function(){
            try{
              expect(ncmb.User.getCurrentUser()).to.be.eql(null);
              done();
            }catch(err){
              done(err);
            }
          });
        });
      });
    });
    describe("isCurrentUser", function(){
      context("インスタンスがカレントユーザか確認し、", function(){
        var user = null;
        beforeEach(function(){
          user = new ncmb.User({userName:"id_callback",password:"password"});
        });
        it("カレントユーザなら true が返る", function(done){
          ncmb.User.login(user, function(err, data){
            try{
              expect(user.isCurrentUser()).to.be.eql(true);
              done();
            }catch(err){
              done(err);
            }
          });
        });
        it("カレントユーザでなければ false が返る", function(done){
          ncmb.User.logout(function(){
            try{
              expect(user.isCurrentUser()).to.be.eql(false);
              done();
            }catch(err){
              done(err);
            }
          });
        });
      });
    });
  });

  describe("MAIL/PWユーザでログイン", function(){
    var user = null;
    var mailAddress = null;
    var password = null;
    var sessionToken = null;
    describe("loginWithMailAddress", function(){
      context("プロパティにmailAddress, passwordがあればログインに成功して", function(){
        beforeEach(function(){
          password = "password";
          user = new ncmb.User({password: password});
        });
        it("callback でレスポンスを取得できる", function(done){
          user.set("mailAddress", mailAddress_callback);
          user.loginWithMailAddress(function(err, data){
            expect(data).to.have.property("sessionToken");
            done(err ? err : null);
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.set("mailAddress", mailAddress_promise);
          user.loginWithMailAddress()
          .then(function(data){
            expect(data).to.have.property("sessionToken");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("プロパティにsessionTokenがあれば自分自身を返却して", function(){
        beforeEach(function(){
          user = new ncmb.User({mailAddress:"test@email.com", password:"password"});
        });
        it("callback で取得できる", function(done){
          user.set("sessionToken", sessionToken_callback);
          user.loginWithMailAddress(function(err, data){
              if(err){
                done(err);
              }else{
                expect(data).to.have.property("sessionToken");
                done();
              }
          });
        });
        it("promise で取得できる", function(done){
          user.set("sessionToken", sessionToken_promise);
          user.loginWithMailAddress()
          .then(function(data){
            expect(data).to.have.property("sessionToken");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("失敗した理由が", function(){
        context("mailAddress プロパティがない場合", function(){
          beforeEach(function(){
            password = "passwd";
            user = new ncmb.User({password: password});
          });
         
          it("callback でログインエラーを取得できる", function(done){
            user.loginWithMailAddress(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise でログインエラーを取得できる", function(done){
            user.loginWithMailAddress()
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });
        context("password プロパティがない場合", function(){
          beforeEach(function(){
            mailAddress = "mail@example.com";
            user = new ncmb.User({mailAddress: mailAddress});
          });
         
          it("callback でログインエラーを取得できる", function(done){
            user.loginWithMailAddress(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise でログインエラーを取得できる", function(done){
            user.loginWithMailAddress()
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });
        context("mailAddress プロパティの値がない場合", function(){
          beforeEach(function(){
            mailAddress  = null;
            password = "passwd";
            user = new ncmb.User({mailAddress: mailAddress, password: password}); 
          });
         
          it("callback でログインエラーを取得できる", function(done){
            user.loginWithMailAddress(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise でログインエラーを取得できる", function(done){
            user.loginWithMailAddress()
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });
        context("password プロパティの値がない場合", function(){
          beforeEach(function(){
            mailAddress  = "mail@example.com";
            password = null;
            user = new ncmb.User({mailAddress: mailAddress, password: password}); 
          });
         
          it("callback でログインエラーを取得できる", function(done){
            user.loginWithMailAddress(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });

          it("promise でログインエラーを取得できる", function(done){
            user.loginWithMailAddress()
            .then(function(data){
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

    describe("User.loginWithMailAddress", function(){
      context("ncmb.Userのインスタンスでログインした場合", function(){
        context("プロパティにmailAddress, passwordがあればログインに成功して", function(){
          beforeEach(function(){
            password = "password";
            user = new ncmb.User({password: password});
          });
          it("callback でレスポンスを取得できる", function(done){
            user.set("mailAddress", mailAddress_callback);
            ncmb.User.loginWithMailAddress(user, function(err, data){
              expect(data).to.have.property("sessionToken");
              done(err ? err : null);
            });
          });
          it("promise でレスポンスを取得できる", function(done){
            user.set("mailAddress", mailAddress_promise);
            ncmb.User.loginWithMailAddress(user)
            .then(function(data){
              expect(data).to.have.property("sessionToken");
              done();
            })
            .catch(function(err){
              done(err);
            });
          });
        });
        context("プロパティにsessionTokenがあれば自分自身を返却して", function(){
          beforeEach(function(){
            user = new ncmb.User({mailAddress:"test@email.com", password:"password"});
          });
          it("callback で取得できる", function(done){
            user.set("sessionToken", sessionToken_callback);
            ncmb.User.loginWithMailAddress(user, function(err, data){
              if(err){
                done(err);
              }else{
                expect(data).to.have.property("sessionToken");
                done();
              }
            });
          });
          it("promise で取得できる", function(done){
            user.set("sessionToken", sessionToken_promise);
            ncmb.User.loginWithMailAddress(user)
            .then(function(data){
              expect(data).to.have.property("sessionToken");
              done();
            })
            .catch(function(err){
              done(err);
            });
          });
        });
        context("失敗した理由が", function(){
          context("mailAddress プロパティがない場合", function(){
            beforeEach(function(){
              password = "passwd";
              user = new ncmb.User({password: password});
            });

            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(user, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });

            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(user)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });
          context("password プロパティがない場合", function(){
            beforeEach(function(){
              mailAddress = "mail@example.com";
              user = new ncmb.User({mailAddress: mailAddress});
            });
           
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(user, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });

            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(user)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });
          context("mailAddress プロパティの値がない場合", function(){
            beforeEach(function(){
              mailAddress  = null;
              password = "passwd";
              user = new ncmb.User({mailAddress: mailAddress, password: password}); 
            });
           
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(user, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });

            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(user)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });
          context("password プロパティの値がない場合", function(){
            beforeEach(function(){
              mailAddress  = "mail@example.com";
              password = null;
              user = new ncmb.User({mailAddress: mailAddress, password: password}); 
            });
           
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(user, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });

            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(user)
              .then(function(data){
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
      
      context("mailAddress, password でログインした場合", function(){
        context("mailAddress, passwordが存在すればログインに成功して", function(){
          beforeEach(function(){
            password = "password";
          });

          it("callback でレスポンスを取得できる", function(done){
            ncmb.User.loginWithMailAddress(mailAddress_callback, password, function(err, data){
              expect(data).to.have.property("sessionToken");
              done(err ? err : null);
            });
          });

          it("promise でレスポンスを取得できる", function(done){
            ncmb.User.loginWithMailAddress(mailAddress_promise, password)
            .then(function(data){
              expect(data).to.have.property("sessionToken");
              done();
            })
            .catch(function(err){
              done(err);
            });
          });
        });
        context("失敗した理由が", function(){
          context("mailAddressの値がない場合", function(){
            beforeEach(function(){
              mailAddress  = null;
              password = "passwd";
            });
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(mailAddress, password, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(mailAddress, password)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });
          context("passwordの値がない場合", function(){
            beforeEach(function(){
              mailAddress  = "mail@example.com";
              password = null;
            });
            it("callback でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(mailAddress, password, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
            it("promise でログインエラーを取得できる", function(done){
              ncmb.User.loginWithMailAddress(mailAddress, password)
              .then(function(data){
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
  });

  describe("匿名ユーザでログイン", function(){
    var uuid = null;
    var user = null;
    var userName = null;
    var sessionToken = null;   
    var authData = null;
    var uuid_callback = null;
    var uuid_promise = null;
    var uuid_class_callback = null;
    var uuid_class_promise = null;
    describe("loginAsAnonymous", function(){
      context("uuidがなければ自動生成してログインに成功して", function(){
        beforeEach(function(){
          ncmb.sessionToken = null;
          user = new ncmb.User();
        });
        it("callback でレスポンスを取得できる", function(done){
          user.set("name", "anonymous_callback");
          user.loginAsAnonymous(function(err, data){
            if(err){
              done(err);
            }else{
              expect(data).to.have.property("sessionToken");
              uuid_callback = data.authData.anonymous.id;
              done();
            }
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.set("name", "anonymous_promise");
          user.loginAsAnonymous()
          .then(function(data){
            expect(data).to.have.property("sessionToken");
            uuid_promise = data.authData.anonymous.id;
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("uuidを入力した場合、ログインに成功して", function(){
        beforeEach(function(){
          ncmb.sessionToken = null;
          user = new ncmb.User();
        });
        it("callback でレスポンスを取得できる", function(done){
          uuid = uuid_callback;
          user.loginAsAnonymous(uuid, function(err, data){
            if(err){
              done(err);
            }else{
              expect(data).to.have.property("sessionToken");
              uuid_callback = data.authData.anonymous.id;
              done();
            }
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          uuid = uuid_promise;
          user.loginAsAnonymous(uuid)
          .then(function(data){
            expect(data).to.have.property("sessionToken");
            uuid_promise = data.authData.anonymous.id;
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("プロパティにuuidがあればログインに成功して", function(){
        beforeEach(function(){
          user = new ncmb.User();
        });
        it("callback でレスポンスを取得できる", function(done){
          user.set("uuid", uuid_callback);
          
          user.loginAsAnonymous(function(err, data){
            if(err){
              done(err);
            }else{
              expect(data).to.have.property("sessionToken");
              done();
            }
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          user.set("uuid", uuid_promise);
          user.loginAsAnonymous()
          .then(function(data){
            expect(data).to.have.property("sessionToken");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("プロパティにanonymousのauthDataがあればログインに成功して", function(){
        beforeEach(function(){
          authData = {anonymous: {}};
          user = new ncmb.User({authData: authData});
        });
        it("callback でレスポンスを取得できる", function(done){
          authData.anonymous.id = uuid_callback;
          user.loginAsAnonymous(function(err, data){
            if(err){
              done(err);
            }else{
              expect(data).to.have.property("sessionToken");
              done();
            }
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          authData.anonymous.id = uuid_promise;
          user.loginAsAnonymous()
          .then(function(data){
            expect(data).to.have.property("sessionToken");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("プロパティにsessionTokenがあれば自分自身を返却して", function(){
        beforeEach(function(){
          user = new ncmb.User();
        });
        it("callback で取得できる", function(done){
          user.set("sessionToken", sessionToken_callback);
          user.loginAsAnonymous(function(err, data){
            if(err){
              done(err);
            }else{
              expect(data).to.have.property("sessionToken");
              done();
            }
          });
        });
        it("promise で取得できる", function(done){
          user.set("sessionToken", sessionToken_promise);
          user.loginAsAnonymous()
          .then(function(data){
            expect(data).to.have.property("sessionToken");
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("失敗した理由が", function(){
        context("uuidについて", function(){
          context("フォーマットが不正な場合", function(){
            before(function(){
              uuid = "3dc72085-911b-4798-9707";
              user = new ncmb.User();
            });
            it("callback でログイン時エラーを取得できる", function(done){
              user.loginAsAnonymous( uuid, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                  expect(err).to.be.an.instanceof(Error);
                  done();
              });
            });
            it("promise でログイン時エラーを取得できる", function(done){
              user.loginAsAnonymous(uuid)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });
          context("大文字のアルファベットが含まれる場合", function(){
            before(function(){
              uuid = "3dc72085-911b-4798-9707-d69e879A6185";
              user = new ncmb.User();
            });
            it("callback でログイン時エラーを取得できる", function(done){
              user.loginAsAnonymous( uuid, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                  expect(err).to.be.an.instanceof(Error);
                  done();
              });
            });
            it("promise でログイン時エラーを取得できる", function(done){
              user.loginAsAnonymous(uuid)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });
          context("区切り以外の記号が含まれる場合", function(){
            beforeEach(function(){
              uuid = "3dc72085-911b-4798-9707-d69e879a61.5";
              user = new ncmb.User();
            });
            it("callback でログイン時エラーを取得できる", function(done){
              user.loginAsAnonymous( uuid, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                  expect(err).to.be.an.instanceof(Error);
                  done();
              });
            });
            it("promise でログイン時エラーを取得できる", function(done){
              user.loginAsAnonymous(uuid)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });
        });
        context("usernameログインと競合した場合", function(){
          beforeEach(function(){
            userName = "name";
            user = new ncmb.User({userName: userName});
          });
          it("callback でログインエラーを取得できる", function(done){
            user.loginAsAnonymous(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
          it("promise でログインエラーを取得できる", function(done){
            user.loginAsAnonymous()
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });
        context("anonymous以外のauthDataログインと競合した場合", function(){
          beforeEach(function(){
            authData = {facebook: { id: "3dc72085-911b-4798-9707-d69e879a6185"}};
            user = new ncmb.User({authData: authData});
          });
          it("callback でログインエラーを取得できる", function(done){
            user.loginAsAnonymous(function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
          it("promise でログインエラーを取得できる", function(done){
            user.loginAsAnonymous()
            .then(function(data){
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
    describe("User.loginAsAnonymous", function(){
      context("uuidがない場合、自動で生成してログインに成功して", function(){
        it("callback でレスポンスを取得できる", function(done){
          ncmb.User.loginAsAnonymous(function(err, data){
            if(err){
              done(err);
            }else{
              expect(data).to.have.property("sessionToken");
              uuid_class_callback = data.authData.anonymous.id;
              done();
            }
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          ncmb.User.loginAsAnonymous()
          .then(function(data){
            expect(data).to.have.property("sessionToken");
            uuid_class_promise = data.authData.anonymous.id;
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("uuidを入力した場合、ログインに成功して", function(){
        it("callback でレスポンスを取得できる", function(done){
          uuid = uuid_class_callback;
          ncmb.User.loginAsAnonymous(uuid, function(err, data){
            if(err){
              done(err);
            }else{
              expect(data).to.have.property("sessionToken");
              uuid_class_callback = data.authData.anonymous.id;
              done();
            }
          });
        });
        it("promise でレスポンスを取得できる", function(done){
          uuid = uuid_class_promise;
          ncmb.User.loginAsAnonymous(uuid)
          .then(function(data){
            expect(data).to.have.property("sessionToken");
            uuid_class_promise = data.authData.anonymous.id;
            done();
          })
          .catch(function(err){
            done(err);
          });
        });
      });
      context("ncmb.Userのインスタンスを入力した場合", function(){
        context("プロパティにuuidがあればログインに成功して", function(){
          beforeEach(function(){
            user = new ncmb.User();
          });
          it("callback でレスポンスを取得できる", function(done){
            user.set("uuid", uuid_class_callback);
            ncmb.User.loginAsAnonymous(user, function(err, data){
              if(err){
                done(err);
              }else{
                expect(data).to.have.property("sessionToken");
                done();
              }
            });
          });
          it("promise でレスポンスを取得できる", function(done){
            user.set("uuid", uuid_class_promise);
            ncmb.User.loginAsAnonymous(user)
            .then(function(data){
              expect(data).to.have.property("sessionToken");
              done();
            })
            .catch(function(err){
              done(err);
            });
          });
        });
        context("プロパティにanonymousのauthDataがあればログインに成功して", function(){
          beforeEach(function(){
            authData = {anonymous: {}};
            user = new ncmb.User({authData: authData});
          });
          it("callback でレスポンスを取得できる", function(done){
            authData.anonymous.id = uuid_class_callback;
            ncmb.User.loginAsAnonymous(user, function(err, data){
              if(err){
                done(err);
              }else{
                expect(data).to.have.property("sessionToken");
                done();
              }
            });
          });
          it("promise でレスポンスを取得できる", function(done){
            authData.anonymous.id = uuid_class_promise;
            ncmb.User.loginAsAnonymous(user)
            .then(function(data){
              expect(data).to.have.property("sessionToken");
              done();
            })
            .catch(function(err){
              done(err);
            });
          });
        });
        context("プロパティにsessionTokenがあれば自分自身を返却して", function(){
          beforeEach(function(){
            user = new ncmb.User();
          });
          it("callback で取得できる", function(done){
            user.set("sessionToken", sessionToken_callback);
            ncmb.User.loginAsAnonymous(user, function(err, data){
              if(err){
                done(err);
              }else{
                expect(data).to.have.property("sessionToken");
                done();
              }
            });
          });
          it("promise で取得できる", function(done){
            user.set("sessionToken", sessionToken_promise);
            ncmb.User.loginAsAnonymous(user)
            .then(function(data){
              expect(data).to.have.property("sessionToken");
              done();
            })
            .catch(function(err){
              done(err);
            });
          });
        });
      });

      context("失敗した理由が", function(){
        context("uuidについて", function(){
          context("フォーマットが不正な場合", function(){
            before(function(){
              uuid = "3dc72085-911b-4798-9707";
            });
            it("callback でログイン時エラーを取得できる", function(done){
              ncmb.User.loginAsAnonymous( uuid, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                  expect(err).to.be.an.instanceof(Error);
                  done();
              });
            });
            it("promise でログイン時エラーを取得できる", function(done){
              ncmb.User.loginAsAnonymous(uuid)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });
          context("大文字のアルファベットが含まれる場合", function(){
            before(function(){
              uuid = "3dc72085-911b-4798-9707-d69e879A6185";
            });
            it("callback でログイン時エラーを取得できる", function(done){
              ncmb.User.loginAsAnonymous( uuid, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                  expect(err).to.be.an.instanceof(Error);
                  done();
              });
            });
            it("promise でログイン時エラーを取得できる", function(done){
              ncmb.User.loginAsAnonymous(uuid)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });
          context("区切り以外の記号が含まれる場合", function(){
            beforeEach(function(){
              uuid = "3dc72085-911b-4798-9707-d69e879a61.5";
            });
            it("callback でログイン時エラーを取得できる", function(done){
              ncmb.User.loginAsAnonymous( uuid, function(err, data){
                if(!err) done(new Error("失敗すべき"));
                  expect(err).to.be.an.instanceof(Error);
                  done();
              });
            });
            it("promise でログイン時エラーを取得できる", function(done){
              ncmb.User.loginAsAnonymous(uuid)
              .then(function(data){
                done(new Error("失敗すべき"));
              })
              .catch(function(err){
                expect(err).to.be.an.instanceof(Error);
                done();
              });
            });
          });
        });
        context("usernameログインと競合した場合", function(){
          beforeEach(function(){
            userName = "name";
            user = new ncmb.User({userName: userName});
          });
          it("callback でログインエラーを取得できる", function(done){
            ncmb.User.loginAsAnonymous(user, function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
          it("promise でログインエラーを取得できる", function(done){
            ncmb.User.loginAsAnonymous(user)
            .then(function(data){
              done(new Error("失敗すべき"));
            })
            .catch(function(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
        });
        context("anonymous以外のauthDataログインと競合した場合", function(){
          beforeEach(function(){
            authData = {facebook: { id: "3dc72085-911b-4798-9707-d69e879a6185"}};
            user = new ncmb.User({authData: authData});
          });
          it("callback でログインエラーを取得できる", function(done){
            ncmb.User.loginAsAnonymous(user, function(err, data){
              if(!err) done(new Error("失敗すべき"));
              expect(err).to.be.an.instanceof(Error);
              done();
            });
          });
          it("promise でログインエラーを取得できる", function(done){
            ncmb.User.loginAsAnonymous(user)
            .then(function(data){
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
  
  describe("ユーザ情報更新", function(){
    var user = null;
    context("成功した場合", function(){
      beforeEach(function(){
        user = new ncmb.User({password:"password"});
      });
      it("callback でレスポンスを取得できる", function(done){
        user.set("userName", "id_callback");
        ncmb.User.login(user)
            .then(function(){
              user.set("status", "updated");
              user.update(function(err, data){
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

      it("promise でレスポンスを取得できる", function(done){
        user.set("userName", "id_promise");
        ncmb.User.login(user)
            .then(function(){
              user.set("status", "updated");
              return user.update();
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

    context("失敗した理由が", function(){
      context("objectId がないときに", function(){
        beforeEach(function(){
          user = new ncmb.User({field: "updated"});
        });
        it("callback で更新時エラーを取得できる", function(done){
          user.update(function(err, data){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で更新時エラーを取得できる", function(done){
          user.update()
          .then(function(data){
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

  describe("パスワード再発行メール送信", function(){
    var user = null;
    context("成功した場合", function(){
      beforeEach(function(){
        user = new ncmb.User();
      });
      it("callback でレスポンスを取得できる", function(done){
        user.set("mailAddress", mailAddress_callback);
        user.requestPasswordReset(function(err, data){
          done(err ? err : null);
        });
      });
      it("promise でレスポンスを取得できる", function(done){
        user.set("mailAddress", mailAddress_promise);
        user.requestPasswordReset()
        .then(function(data){
          done();
        })
        .catch(function(err){
          done(err);
        });
      });
    });

    context("失敗した理由が", function(){
      context("mailAddress がないときに", function(){
        beforeEach(function(){
          user = new ncmb.User({});
        });

        it("callback で送信時エラーを取得できる", function(done){
          user.requestPasswordReset(function(err, data){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で送信時エラーを取得できる", function(done){
          user.requestPasswordReset()
          .then(function(data){
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

  describe("ユーザーログアウト", function(){
    context("ncmb.User.logout", function(){
      context("成功した場合", function(){
        var user = null;
        beforeEach(function(){
          user = new ncmb.User({password:"password"});
        });
        it("callback でレスポンスを取得できる", function(done){
          user.set("userName", "id_callback");
          ncmb.User.login(user)
              .then(function(){
                ncmb.User.logout(function(err, res){
                  if(err){
                      done(err);
                  }else{
                    expect(ncmb.User.getCurrentUser()).to.be.eql(null);
                    done(); 
                  }
                });
              })
              .catch(function(err){
                done(err);
              });
        });

        it("promise でレスポンスを取得できる", function(done){
          user.set("userName", "id_promise");
          ncmb.User.login(user)
              .then(function(){
                return ncmb.User.logout();
              })
              .then(function(res){
                expect(ncmb.User.getCurrentUser()).to.be.eql(null);
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
    });
    context("logout", function(){
      context("currentUserでログアウトした場合、currentUser情報ごとインスタンスのログイン情報の削除に成功し、", function(){
        var user = null;
        beforeEach(function(){
          user = new ncmb.User({password:"password"});
        });
        it("callback でレスポンスを取得できる", function(done){
          user.set("userName", "id_callback");
          ncmb.User.login(user)
              .then(function(){
                user.logout(function(err, res){
                  if(err){
                      done(err);
                  }else{
                    expect(ncmb.User.getCurrentUser()).to.be.eql(null);
                    expect(user.sessionToken).to.be.eql(null);
                    done(); 
                  }
                });
              })
              .catch(function(err){
                done(err);
              });
        });

        it("promise でレスポンスを取得できる", function(done){
          user.set("userName", "id_promise");
          ncmb.User.login(user)
              .then(function(){
                return user.logout();
              })
              .then(function(res){
                expect(ncmb.User.getCurrentUser()).to.be.eql(null);
                expect(user.sessionToken).to.be.eql(null);
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("currentUserでないログイン中のユーザでログアウトした場合、インスタンスのログイン情報のみ削除に成功し、", function(){
        var user = null;
        var currentuser = null;
        beforeEach(function(){
          user = new ncmb.User({password:"password"});
          currentuser = new ncmb.User({password:"password"});
        });
        it("callback でレスポンスを取得できる", function(done){
          user.set("userName", "id_callback");
          user.login()
              .then(function(){
                currentuser.set("mailAddress", mailAddress_callback);
                return currentuser.loginWithMailAddress();
              })
              .then(function(){
                return ncmb.User.login(currentuser);
              })
              .then(function(){
                user.logout(function(err, res){
                  if(err){
                    done(err);
                  }else{
                    expect(ncmb.User.getCurrentUser()).to.not.eql(null);
                    expect(user.sessionToken).to.be.eql(null);
                    done();
                  }
                });
              })
              .catch(function(err){
                done(err);
              });
        });

        it("promise でレスポンスを取得できる", function(done){
          user.set("userName", "id_promise");
          user.login()
              .then(function(){
                currentuser.set("mailAddress", mailAddress_promise);
                return currentuser.loginWithMailAddress();
              })
              .then(function(){
                return ncmb.User.login(currentuser);
              })
              .then(function(){
                return user.logout();
              })
              .then(function(res){
                expect(ncmb.User.getCurrentUser()).to.not.eql(null);
                expect(user.sessionToken).to.be.eql(null);
                done();
              })
              .catch(function(err){
                done(err);
              });
        });
      });
      context("ログイン中でないユーザでログアウトした場合エラーが返り、", function(){
        var user = null;
        beforeEach(function(){
          user = new ncmb.User({password:"password"});
        });
        it("callback でレスポンスを取得できる", function(done){
          user.set("userName", "id_callback");
          user.logout(function(err, res){
            if(err){
              expect(err).to.be.an.instanceof(Error);
              done();
            }else{
              done(new Error("失敗すべき"));
            }
          });
        });

        it("promise でレスポンスを取得できる", function(done){
          user.set("userName", "id_promise");
          user.logout()
              .then(function(data){
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
  
  describe("ユーザー削除", function(){
    var del_user = null;
    context("成功した場合", function(){
      beforeEach(function(){
        del_user = new ncmb.User({password:"password"});
      });
      afterEach(function(){
        ncmb.sessionToken = null;
      });
      it("callback でレスポンスを取得できる", function(done){
        del_user.set("userName", "delete_callback");
        del_user.signUpByAccount()
                .then(function(){
                  return ncmb.User.login(del_user);
                })
                .then(function(){
                  del_user.delete(function(err){
                    if(err){
                      done(err);
                    }else{
                      done();
                    }
                  });
                })
                .catch(function(err){
                  done(err);
                });
      });

      it("promise でレスポンスを取得できる", function(done){
        del_user.set("userName", "delete_promise");
        del_user.signUpByAccount()
                .then(function(data){
                  return ncmb.User.login(del_user);
                })
                .then(function(data){
                  return del_user.delete();
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
        beforeEach(function(){
          del_user = new ncmb.User({});
        });

        it("callback で削除時エラーを取得できる", function(done){
          del_user.delete(function(err){
            if(!err) done(new Error("失敗すべき"));
            expect(err).to.be.an.instanceof(Error);
            done();
          });
        });

        it("promise で削除時エラーを取得できる", function(done){
          del_user.delete()
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

