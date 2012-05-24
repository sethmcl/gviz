function Gviz( args ) {
  'use strict';
  var PORT      = 1985,
      express   = require('express'),
      crypto    = require('crypto'),
      hostname  = require('os').hostname(),
      colors    = require('colors'),
      path      = require('path'),
      app       = express.createServer(),
      io        = require('socket.io'),
      _         = require('underscore'),
      jade      = require('jade'),
      git       = new (require('./git'))( process.env.PWD ),
      homeFolder,
      port;

  initEnvironment();
  initRoutes();
  initSocketIO();
  start();

  /**
   * Set up application environment
   */
  function initEnvironment() {
    homeFolder = __dirname;
    console.log('   info  -'.cyan, 'Application root'.yellow, homeFolder);

    // express config
    app.set('view engine', 'jade');
    app.set('views', homeFolder + '/views');
    app.set('views');
    app.set('view options', { layout: 'layout' });

    app.use (function(req, res, next) {
        var data='';
        req.setEncoding('utf8');
        req.on('data', function(chunk) { 
           data += chunk;
        });

        req.on('end', function() {
            req.body = data;
            next();
        });
    });

    // static resources
    app.use('/js', express.static(homeFolder + '/js'));
    app.use('/css', express.static(homeFolder + '/css'));
    app.use('/img', express.static(homeFolder + '/img'));

    // port
    //port = parseInt(process.argv[2], 10) || PORT;
    port = parseInt(process.argv[2], 10) || Math.round( (Math.random() * 1000) + 1000 );
  }

  /**
   * Set up routes
   */
  function initRoutes() {

    /** index **/
    app.get('/', function(request, response) {
      response.render('index');
    });
    /** git log **/
    app.get('/log', function(request, response) {
      git.log(function(data) {
        var json = '{"commits": {' + data.replace(/\n/g, ',') + '}}';
        response.render('log', JSON.parse(json));
      });
    });

  }

  /**
   * Set up socket IO server
   */
  function initSocketIO() {
    io = io.listen(app);
    io.set('log level', 1);
    io.sockets.on('connection', function(socket) {
      console.log('Socket connected'.red);
    });
  }

  /**
   * Start server
   */
  function start() {
    app.listen(port);
    console.log('Application started on'.yellow, (hostname + ':' + port).cyan);
  }
}

module.exports = Gviz;
