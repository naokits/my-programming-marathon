var packageVersion = require('./../package.json').version;
console.log("packageVersion :: " + packageVersion);
var log4js = require('log4js');
var jsonParser = require('body-parser').json();
var cfenv = require('cfenv');

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

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
	console.log(session)
	res.send("Hello, this is a protected resouce of the mobile backend application!");
});

app.get('/protected2', passport.authenticate('mca-backend-strategy', {session: false}), function(req, res){
	console.log(session)
	res.send(200, req.securityContext);
});

// ------------ Protecting backend APIs with Mobile Client Access end -----------------

/*
 POST <base_url>/apps/<tenant_id>/<realm_name>/<request_type>

 base_url: カスタム ID プロバイダー Web アプリケーションのベース URL を指定します。このベース URL は、Mobile Client Access ダッシュボードに登録される URL です。
 tenant_id: テナントの固有 ID を指定します。Mobile Client Access は、この API を起動するときに、常に IBM® Bluemix® アプリ GUID (applicationGUID) を提供します。
 realm_name: Mobile Client Access ダッシュボードで定義されたカスタム・レルム名を指定します。
 request_type: 以下のいずれかを指定します。
   startAuthorization: 認証プロセスの最初のステップを指定します。カスタム ID プロバイダーは、「challenge」、「success」、または「failure」のいずれかの状況とともに応答する必要があります。
   handleChallengeAnswer: モバイル・クライアントからの認証チャレンジ応答を処理します。
 */

app.post('/apps/:tenantId/:realmName/startAuthorization', jsonParser, function(req, res){
	var tenantId = req.params.tenantId;
	var realmName = req.params.realmName;
	var headers = req.body.headers;

	logger.debug("startAuthorization", tenantId, realmName, headers);

	var responseJson = {
		status: "challenge",
		challenge: {
			text: "Enter username and password"
		}
	};

	res.status(200).json(responseJson);
});

app.post('/apps/:tenantId/:realmName/handleChallengeAnswer', jsonParser, function(req, res){
	var tenantId = req.params.tenantId;
	var realmName = req.params.realmName;
	var challengeAnswer = req.body.challengeAnswer;


	logger.debug("handleChallengeAnswer", tenantId, realmName, challengeAnswer);

	var username = req.body.challengeAnswer["username"];
	var password = req.body.challengeAnswer["password"];

	var responseJson = { status: "failure" };

	var userObject = userRepository[username];
	if (userObject && userObject.password == password ){
		logger.debug("Login success for userId ::", username);
		responseJson.status = "success";
		responseJson.userIdentity = {
			userName: username,
			displayName: userObject.displayName,
			attributes: {
				dob: userObject.dob
			}
		}
	} else {
		logger.debug("Login failure for userId ::", username);
	}

	res.status(200).json(responseJson);
});

// app.use(function(req, res, next){
// 	res.status(404).send("This is not the URL you're looking for");
// });


app.post('/login', function(req, res) {
	User.login({
		email: req.body.email,
		password: req.body.password
	}, 'user', function(err, token) {
		if (err) {
			res.render('response', { //render view named 'response.ejs'
				title: 'Login failed',
				content: err,
				redirectTo: '/',
				redirectToLinkText: 'Try again'
			});
			return;
		}

		res.render('home', { //login user and render 'home' view
			email: req.body.email,
			accessToken: token.id
		});
	});
});
///////////////////////////////////////////////////////////////////////////////

app.start = function () {
	// start the web server
	return app.listen(cfenv.getAppEnv().port, function () {
		app.emit('started');
		// logger.info('Server listening at %s:%s', host, port);
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
