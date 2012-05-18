var exec = require('child_process').exec;

exports.index = function (response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write('INDEX');
}
exports.log = function (response) {
  exec('git log --pretty=format:"{hash: \'%H\', parentHash: \'%P\', author: \'%an\', date: \'%at\', branch: \'%d\'}"', {timeout: 5000}, function(error, stdout, stderr) {
    var json = '{commits: [' + stdout.replace('\n', ',') + ']}';
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(json);
    console.log(json);
    response.end();
  });
}

exports.commit = function (response) {
  exec('git show --pretty="format:" --name-only d424263edc9324d59f3a7b6d0cf2e9b147285fd3', {timeout: 5000}, function(error, stdout, stderr) {
    var json,
        files = stdout.split('\n');
    json = '{files: ['; 
    for (var i = 0, len = files.length; i < len; i++) {
      json = json + "'" + files[i] + "\'";
      if (i < (len - 1)) {
        json = json + ',';
      }
    }
    json = json + ']}';
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(json);
    console.log(json);
    response.end();
  });
}
