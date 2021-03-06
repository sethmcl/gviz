var server = require('./server'),
    router = require('./router'),
    requestHandler = require('./requestHandler'),
    handle = {};

handle['/'] = requestHandler.home;
handle['/commit'] = requestHandler.commit;
handle['/log'] = requestHandler.log;

server.start(router.route, handle);
