var server = require('./server'),
    router = require('./router'),
    requestHandler = require('./requestHandler'),
    handle = {};

handle['/'] = requestHandler.commit;
handle['/commit'] = requestHandler.commit;

server.start(router.route, handle);
