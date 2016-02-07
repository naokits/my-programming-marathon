/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// NCMB
var NCMB = require('ncmb');
var ncmb_client = new NCMB("c951b57a31dafc86f076fa9f1baea6e9859bc1dd7f740c77799c051617e7b020",
    "16a39a0a6515afff7ecff9acd16482804ecba67ca36801fe1d49bd737694fd5e");


// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();


app.get('/save.json', function(req, res) {
    res.contentType('application/json');

    var Food = ncmb_client.DataStore("Food");
    // cerate instance and save into ncmb
    var food = new Food({name: "apple"});
    food.save()
        .then(function (apple) {
            var result;
            result = {"name": apple.name};
            res.send(JSON.stringify(result));
            //res.send("<html><body>" + apple.name + "</body></html>");
        })
        .catch(function (err) {
            var e = [{ error: err}];
            res.send(JSON.stringify(e));
        });
});

app.get('/push.json', function (req, res) {
//self.routes['/push'] = function (req, res) {
    res.setHeader('Content-Type', 'text/html');

    // send push notification
    var push = new ncmb_client.Push();
    push.set("immediateDeliveryFlag", true)
        .set("title", "挨拶2/7")
        .set("message", "Hello, World!")
        .set("target", ["ios"]);
    //.set("target", ["ios", "android"]);

    push.send()
        .then(function (push) {
            res.send("<html><body>" + push.title + "</body></html>");
        })
        .catch(function (err) {
            res.send("<html><body>" + err.code + "</body></html>");
        });
});



// send push notification
var push = new ncmb_client.Push();
push.set("immediateDeliveryFlag", true)
    .set("title", "挨拶")
    .set("message", "Hello, World!")
    .set("target", ["ios"]);
//.set("target", ["ios", "android"]);

push.send()
    .then(function(push){
        res.send("<html><body>" + push.title + "</body></html>");
    })
    .catch(function(err){
        res.send("<html><body>" + err.code + "</body></html>");
    });



// JSONを返すサンプル関数
app.get('/people.json', function(request, response) {

    // Normally, the would probably come from a database, but we can cheat:
    var people = [
        { name: 'Dave', location: 'Atlanta' },
        { name: 'Santa Claus', location: 'North Pole' },
        { name: 'Man in the Moon', location: 'The Moon' }
    ];

    // Since the request is for a JSON representation of the people, we
    //  should JSON serialize them. The built-in JSON.stringify() function
    //  does that.
    var peopleJSON = JSON.stringify(people);

    // Now, we can use the response object's send method to push that string
    //  of people JSON back to the browser in response to this request:
    response.send(peopleJSON);
});


// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function () {

    // print a message when the server starts listening
    //console.log("server starting on " + appEnv.url);

    console.log("Express server starting on %s in %s mode", appEnv.url, app.settings.env);
});

/**
 *  Define the sample application.
 */
var MoveApp = function () {

    //  Scope.
    var self = this;

    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function () {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function () {
            console.log('%s: Node server started on %s:%d ...',
                Date(Date.now()), self.ipaddress, self.port);
        });
    };

};

var zapp = new MoveApp();
