var exec = require('child_process').exec;

exports.commit = function (response) {
  exec('git log --pretty=format:"{hash: \'%H\', parentHash: \'%P\', author: \'%an\', date: \'%at\', branch: \'%d\'}"', {timeout: 5000}, function(error, stdout, stderr) {
    var json = '{commits: [' + stdout.replace('\n', ',') + ']}';
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write(json);
    console.log(json);
    response.end();
  });
}
