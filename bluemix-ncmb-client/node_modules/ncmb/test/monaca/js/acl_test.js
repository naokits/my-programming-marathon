"use strict";

describe("NCMB ACL", function(){
  var ncmb = new NCMB(config.apikey, config.clientkey );
  if(config.apiserver){
    ncmb
      .set("protocol", config.apiserver.protocol || "http:")
      .set("fqdn", config.apiserver.fqdn)
      .set("port", config.apiserver.port)
      .set("proxy", config.apiserver.port || "");
  }

  var aclObj = null;
  it("権限をconstructorで指定し、取得できる", function() {
    aclObj = new ncmb.Acl({"*":{read: true}});
    expect(aclObj.toJSON()).to.be.eql({"*":{read: true}});
  });

  describe("権限をプロパティで指定し、取得できる", function() {
    beforeEach(function(){
      aclObj = new ncmb.Acl();
    });
    it("permisionをオブジェクトで指定", function() {
      aclObj["*"] = {read: true};
      expect(aclObj.toJSON()).to.be.eql({"*":{read: true}});
    });
    it("permisionをパラメータで指定", function() {
      aclObj["*"] = {};
      aclObj["*"].read = true;
      expect(aclObj.toJSON()).to.be.eql({"*":{read: true}});
    });
  });

  describe("権限の設定チェック", function() {
    describe("Public権限に対して", function(){
      context("正しく設定される場合", function(){
        beforeEach(function(){
          aclObj = new ncmb.Acl();
        });
        it("Readを指定し、取得できる", function() {
          aclObj.setPublicReadAccess(true);
          expect(aclObj.toJSON()).to.be.eql({"*":{read: true}});
        });
        it("Writeを指定し、取得できる", function() {
          aclObj.setPublicWriteAccess(true);
          expect(aclObj.toJSON()).to.be.eql({"*":{write: true}});
        });
        it("Write, Readを指定し、取得できる", function() {
          aclObj.setPublicReadAccess(true);
          aclObj.setPublicWriteAccess(true);
          expect(aclObj.toJSON()).to.be.eql({"*":{read: true, write: true}});
        });
        it("Write true, Write falseを連続指定し、最後に指定したfalseを取得できる", function() {
          aclObj.setPublicWriteAccess(true);
          aclObj.setPublicWriteAccess(false);
          expect(aclObj.toJSON()).to.be.eql({"*":{write: false}});
        });
        it("Read true, Read falseを連続指定し、最後に指定したfalseを取得できる", function() {
          aclObj.setPublicReadAccess(true);
          aclObj.setPublicReadAccess(false);
          expect(aclObj.toJSON()).to.be.eql({"*":{read: false}});
        });
        it("Read, Writeをchain指定し、取得できる", function() {
          aclObj.setPublicReadAccess(true).setPublicWriteAccess(false);
          expect(aclObj.toJSON()).to.be.eql({"*":{read: true, write: false}});
        });
      });
      context("設定に失敗した理由が", function(){
        beforeEach(function(){
          aclObj = new ncmb.Acl();
        });

      });
    });

    var user = null;
    describe("User権限に対して", function(){
      context("正しく設定される場合", function(){
        beforeEach(function(){
          aclObj = new ncmb.Acl();
          user = new ncmb.User({objectId: "object_id"});
        });
        it("Readを指定し、取得できる", function() {
          aclObj.setUserReadAccess(user, true);
          expect(aclObj.toJSON()).to.be.eql({"object_id":{read: true}});
        });
        it("Writeを指定し、取得できる", function() {
          aclObj.setUserWriteAccess(user, true);
          expect(aclObj.toJSON()).to.be.eql({"object_id":{write: true}});
        });
        it("Write, Readを指定し、取得できる", function() {
          aclObj.setUserReadAccess(user, true);
          aclObj.setUserWriteAccess(user, true);
          expect(aclObj.toJSON()).to.be.eql({"object_id":{read: true, write: true}});
        });
        it("Write true, Write falseを連続指定し、最後に指定したfalseを取得できる", function() {
          aclObj.setUserWriteAccess(user, true);
          aclObj.setUserWriteAccess(user, false);
          expect(aclObj.toJSON()).to.be.eql({"object_id":{write: false}});
        });
        it("Read true, Read falseを連続指定し、最後に指定したfalseを取得できる", function() {
          aclObj.setUserReadAccess(user, true);
          aclObj.setUserReadAccess(user, false);
          expect(aclObj.toJSON()).to.be.eql({"object_id":{read: false}});
        });
        it("Read, Writeをchain指定し、取得できる", function() {
          aclObj.setUserReadAccess(user, true).setUserWriteAccess(user, false);
          expect(aclObj.toJSON()).to.be.eql({"object_id":{read: true, write: false}});
        });
      });
      context("権限の設定に失敗した理由が", function(){
        context("ユーザのobjectIdがない時", function(){
          beforeEach(function(){
            aclObj = new ncmb.Acl();
            user = new ncmb.User();
          });
          it("Read権限の設定時にエラーを取得できる", function(done) {
            try{
              aclObj.setUserReadAccess(user, true);
              done(new Error("失敗すべき"));
            }catch(err){
              done();
            }
          });
          it("Write権限の設定時にエラーを取得できる", function(done) {
            try{
              aclObj.setUserWriteAccess(user, true);
              done(new Error("失敗すべき"));
            }catch(err){
              done();
            }
          });
        });
      });
    });
    var role = null;
    describe("Role権限に対して", function(){
      context("第一引数にrole名が設定される場合", function(){
        beforeEach(function(){
          aclObj = new ncmb.Acl();
          role = "roleName"
        });
        it("Readを指定し、取得できる", function() {
          aclObj.setRoleReadAccess(role, true);
          expect(aclObj.toJSON()).to.be.eql({"role:roleName":{read: true}});
        });
        it("Writeを指定し、取得できる", function() {
          aclObj.setRoleWriteAccess(role, true);
          expect(aclObj.toJSON()).to.be.eql({"role:roleName":{write: true}});
        });
        it("Write, Readを指定し、取得できる", function() {
          aclObj.setRoleReadAccess(role, true);
          aclObj.setRoleWriteAccess(role, true);
          expect(aclObj.toJSON()).to.be.eql({"role:roleName":{read: true, write: true}});
        });
        it("Write true, Write falseを連続指定し、最後に指定したfalseを取得できる", function() {
          aclObj.setRoleWriteAccess(role, true);
          aclObj.setRoleWriteAccess(role, false);
          expect(aclObj.toJSON()).to.be.eql({"role:roleName":{write: false}});
        });
        it("Read true, Read falseを連続指定し、最後に指定したfalseを取得できる", function() {
          aclObj.setRoleReadAccess(role, true);
          aclObj.setRoleReadAccess(role, false);
          expect(aclObj.toJSON()).to.be.eql({"role:roleName":{read: false}});
        });
        it("Read, Writeをchain指定し、取得できる", function() {
          aclObj.setRoleReadAccess(role, true).setRoleWriteAccess(role, false);
          expect(aclObj.toJSON()).to.be.eql({"role:roleName":{read: true, write: false}});
        });
      });
      context("第一引数のrole名が不正な場合", function(){
        beforeEach(function(){
          aclObj = new ncmb.Acl();
          role = new ncmb.Role("roleName");
        });
        it("role名にnullを指定した場合、エラーを返す", function() {
          try{
            aclObj.setRoleReadAccess(null, true);
            throw new Error("失敗すべき");
          }catch(err){
          }
          try{
            aclObj.setRoleWriteAccess(null, true);
            throw new Error("失敗すべき");
          }catch(err){
          }
        });
        it("role名にundefinedを指定した場合、エラーを返す", function() {
          try{
            aclObj.setRoleReadAccess(undefined, true);
            throw new Error("失敗すべき");
          }catch(err){
          }
          try{
            aclObj.setRoleWriteAccess(undefined, true);
            throw new Error("失敗すべき");
          }catch(err){
          }
        });
        it("role名に空文字を指定した場合、エラーを返す", function() {
          try{
            aclObj.setRoleReadAccess("", true);
            throw new Error("失敗すべき");
          }catch(err){
          }
          try{
            aclObj.setRoleWriteAccess("", true);
            throw new Error("失敗すべき");
          }catch(err){
          }
        });
        it("role名にroleNameがないオブジェクトを指定した場合、エラーを返す", function() {
          try{
            aclObj.setRoleReadAccess({}, true);
            throw new Error("失敗すべき");
          }catch(err){
          }
          try{
            aclObj.setRoleWriteAccess({}, true);
            throw new Error("失敗すべき");
          }catch(err){
          }
        });
        it("role名にroleNameがnullのroleオブジェクトを指定した場合、エラーを返す", function() {
          role.roleName = null;
          try{
            aclObj.setRoleReadAccess(role, true);
            throw new Error("失敗すべき");
          }catch(err){
          }
          try{
            aclObj.setRoleWriteAccess(role, true);
            throw new Error("失敗すべき");
          }catch(err){
          }
        });
        it("role名にroleNameがundefinedのroleオブジェクトを指定した場合、エラーを返す", function() {
          role.roleName = undefined;
          try{
            aclObj.setRoleReadAccess(role, true);
            throw new Error("失敗すべき");
          }catch(err){
          }
          try{
            aclObj.setRoleWriteAccess(role, true);
            throw new Error("失敗すべき");
          }catch(err){
          }
        });
        it("role名にroleNameがないroleオブジェクトを指定した場合、エラーを返す", function() {
          delete role.roleName;
          try{
            aclObj.setRoleReadAccess(role, true);
            throw new Error("失敗すべき");
          }catch(err){
          }
          try{
            aclObj.setRoleWriteAccess(role, true);
            throw new Error("失敗すべき");
          }catch(err){
          }
        });
        it("role名にroleNameが空文字のroleオブジェクトを指定した場合、エラーを返す", function() {
          role.roleName = "";
          try{
            aclObj.setRoleReadAccess(role, true);
            throw new Error("失敗すべき");
          }catch(err){
          }
          try{
            aclObj.setRoleWriteAccess(role, true);
            throw new Error("失敗すべき");
          }catch(err){
          }
        });
      });
      context("第一引数にroleインスタンスが設定される場合", function(){
        beforeEach(function(){
          aclObj = new ncmb.Acl();
          role = new ncmb.Role("roleName");
        });
        it("Readを指定し、取得できる", function() {
          aclObj.setRoleReadAccess(role, true);
          expect(aclObj.toJSON()).to.be.eql({"role:roleName":{read: true}});
        });
        it("Writeを指定し、取得できる", function() {
          aclObj.setRoleWriteAccess(role, true);
          expect(aclObj.toJSON()).to.be.eql({"role:roleName":{write: true}});
        });
        it("Write, Readを指定し、取得できる", function() {
          aclObj.setRoleReadAccess(role, true);
          aclObj.setRoleWriteAccess(role, true);
          expect(aclObj.toJSON()).to.be.eql({"role:roleName":{read: true, write: true}});
        });
        it("Write true, Write falseを連続指定し、最後に指定したfalseを取得できる", function() {
          aclObj.setRoleWriteAccess(role, true);
          aclObj.setRoleWriteAccess(role, false);
          expect(aclObj.toJSON()).to.be.eql({"role:roleName":{write: false}});
        });
        it("Read true, Read falseを連続指定し、最後に指定したfalseを取得できる", function() {
          aclObj.setRoleReadAccess(role, true);
          aclObj.setRoleReadAccess(role, false);
          expect(aclObj.toJSON()).to.be.eql({"role:roleName":{read: false}});
        });
        it("Read, Writeをchain指定し、取得できる", function() {
          aclObj.setRoleReadAccess(role, true).setRoleWriteAccess(role, false);
          expect(aclObj.toJSON()).to.be.eql({"role:roleName":{read: true, write: false}});
        });
      });
    });
  });

  describe("ACLデータが入っている状態で保存成功", function() {
    var Food = null;
    var aclObj = null;
    var food = null;
    beforeEach(function(){
      Food = ncmb.DataStore("food");
      aclObj = new ncmb.Acl();
      aclObj.setPublicReadAccess(true);
      food = new Food({acl: aclObj});
    });
    it("callback で取得できる", function(done){
      food.name = "acl_callback";
      food.save(function(err, obj){
        if(err) {
          done(err);
        } else {
          Food.where({objectId: obj.objectId}).fetchAll()
          .then(function(foods){
            expect(foods[0].acl).to.be.eql(new ncmb.Acl({'*':{read: true}}));
            done();
          })
          .catch(function(err){
            done(err);
          });
        }
      });
    });
    it("promise で取得できる", function(done){
      food.name = "acl_promise";
      food.save()
        .then(function(newFood){
          return Food.where({objectId: newFood.objectId}).fetchAll()
        })
        .then(function(foods){
          expect(foods[0].acl).to.be.eql(new ncmb.Acl({'*':{read: true}}));
          done();
        })
        .catch(function(err){
          done(err);
        });
    });
  });
  describe("acl情報取得", function(){
    context("get", function(){
      it("targetのtype権限についての設定状態を取得できる", function(done){
        var aclObj = new ncmb.Acl();
        aclObj.setPublicReadAccess(true);
        aclObj.setPublicWriteAccess(false);
        var publicRead  = aclObj.get("public", "read");
        var publicWrite = aclObj.get("public", "write");
        expect(publicRead).to.be.eql(true);
        expect(publicWrite).to.be.eql(false);
        done();
      });
      it("targetに文字列以外が設定されたとき、エラーが返る", function(done){
        var aclObj = new ncmb.Acl();
        aclObj.setPublicReadAccess(true);
        try{
          var publicRead = aclObj.get(["public"], "read");
          done(new Error("失敗すべき"));
        }catch(err){
          expect(err).to.be.an.instanceof(Error);
          done();
        }
      });
      it("typeに文字列以外が設定されたとき、エラーが返る", function(done){
        var aclObj = new ncmb.Acl();
        aclObj.setRoleReadAccess("roleName",true);
        try{
          var publicRead = aclObj.get("roleName", ["read"]);
          done(new Error("失敗すべき"));
        }catch(err){
          expect(err).to.be.an.instanceof(Error);
          done();
        }
      });
      it("typeにread/write以外が設定されたとき、エラーが返る", function(done){
        var aclObj = new ncmb.Acl();
        aclObj.setRoleReadAccess("roleName", true);
        try{
          var publicRead = aclObj.get("roleName", "public");
          done(new Error("失敗すべき"));
        }catch(err){
          expect(err).to.be.an.instanceof(Error);
          done();
        }
      });
      it("targetにacl情報が設定されていないとき、nullが返る", function(done){
        var aclObj = new ncmb.Acl();
        var publicRead  = aclObj.get("public", "read");
        expect(publicRead).to.be.eql(null);
        done();
      });
      it("targetのtypeにacl情報が設定されていないとき、nullが返る", function(done){
        var aclObj = new ncmb.Acl();
        aclObj.setPublicWriteAccess(true);
        var publicRead  = aclObj.get("public", "read");
        expect(publicRead).to.be.eql(null);
        done();
      });
    });
  });
});