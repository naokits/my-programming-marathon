var packageVersion = require('./../package.json').version;
console.log("packageVersion :: " + packageVersion);

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

// 1. ncmbモジュールの読み込み
var NCMB = require("ncmb");
// 2. mobile backendアプリとの連携
var YOUR_APPLICATIONKEY = "eb8b0d30b4a79da1263520921c5f451bf49c5b4aec15cee525ce7ec71a6aad0b"
var YOUR_CLIENTKEY = "79f3d17624fc59b56f18755e3d5b69e0c8c88fab373497d8469456a57aadc4c8"
var ncmb = new NCMB(YOUR_APPLICATIONKEY, YOUR_CLIENTKEY);

// TestClassの作成
var TestClass = ncmb.DataStore("TestClass");
// 3.TestClassへの入出力
TestClass.equalTo("message", "Hello, NCMB!")
         .fetchAll()
         .then(function(results){
           if(results[0] != null){
             console.log(results[0].get("message"));
           }else{
             var testClass = new TestClass();
             testClass.set("message", "Hello, NCMB!");
             testClass.save()
                      .then(function(){
                        console.log("message is saved.");
                      })
                      .catch(function(err){
                        console.log(err.text);
                      });
           }
         })
         .catch(function(err){
           console.log(err.text);
         });

// ------------ Protecting mobile backend with Mobile Client Access start -----------------

// Load passport (http://passportjs.org)
var passport = require('passport');

// Get the MCA passport strategy to use
var MCABackendStrategy = require('bms-mca-token-validation-strategy').MCABackendStrategy;

// Tell passport to use the MCA strategy
passport.use(new MCABackendStrategy())

// Tell application to use passport
app.use(passport.initialize());

// Protect DELETE endpoint so it can only be accessed by HelloTodo mobile samples
app.delete('/api/Items/:id', passport.authenticate('mca-backend-strategy', {session: false}));

// Protect /protected endpoint which is used in Getting Started with Bluemix Mobile Services tutorials
app.get('/protected', passport.authenticate('mca-backend-strategy', {session: false}), function(req, res){
	res.send("Hello, this is a protected resouce of the mobile backend application!");
});
// ------------ Protecting backend APIs with Mobile Client Access end -----------------

app.start = function () {
	// start the web server
	return app.listen(function () {
		app.emit('started');
		var baseUrl = app.get('url').replace(/\/$/, '');
		console.log('Web server listening at: %s', baseUrl);
		var componentExplorer = app.get('loopback-component-explorer');
		if (componentExplorer) {
			console.log('Browse your REST API at %s%s', baseUrl, componentExplorer.mountPath);
		}
	});
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
	if (err) throw err;
	if (require.main === module)
		app.start();
});
