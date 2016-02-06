"use strict";

var config   = require("config");
var expect   = require("chai").expect;

var signature = require("../lib/signature");

describe("NCMB signature", function(){
  describe("create", function(){
    it("[公式ドキュメント](http://bit.ly/1GsvAKL) の通りに成功する", function(){
      var sig = signature.create(
        "https://mb.api.cloud.nifty.com/2013-09-01/classes/TestClass",
        "GET",
        {where: {testKey: "testValue"}},
        "2013-12-02T02:44:35.452Z",
        "HmacSHA256", 2,
        "mb.api.cloud.nifty.com",
        "6145f91061916580c742f806bab67649d10f45920246ff459404c46f00ff3e56",
        "1343d198b510a0315db1c03f3aa0e32418b7a743f8e4b47cbff670601345cf75"
      );
      expect(sig).to.be.equal("/mQAJJfMHx2XN9mPZ9bDWR9VIeftZ97ntzDIRw0MQ4M=");
    });
  });
});
