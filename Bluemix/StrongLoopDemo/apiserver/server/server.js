var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();


app.get('/hoge', function(req, res){
  // console.log(session)
  var here = new loopback.GeoPoint({lat: 6.963467, lng: 125.08509});
  var there = new loopback.GeoPoint({lat: 7.019149, lng: 125.083784});
  var result = loopback.GeoPoint.distanceBetween(here, there, {type: 'kilometers'})

  // res.status(200).send(result)
  res.send(200, result);

})



app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
