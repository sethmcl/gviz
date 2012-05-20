var exec = require('child_process').exec;

function Git( root ) {

  /**
   * Run git log command
   */
  function log(cb) {
    cmd(cb, 'git log',
        '--pretty=format:\'',
        '{',
        '"hash":'       + '"%H",',
        '"parentHash":' + '"%P",',
        '"author":'     + '"%an",',
        '"date":'       + '"%at",',
        '"branch":'     + '"%d",',
        '"subject":'    + '"%s",',
        '"body":'       + '"%b",',
        '"message":'    + '"%s %b"',
        '}\''
    );
  }

  /**
   * Run a shell command
   */
  function cmd(cb) {
    var args, shellCmd;

    args = Array.prototype.slice.call(arguments, 1);
    args.unshift('cd ' + root + ' &&');

    shellCmd = args.join(' ');

    console.log('Executing: '.cyan, shellCmd.yellow);
    exec(shellCmd, {timeout: 5000}, function(error, stdout, stderr) {
      cb(stdout);
    });
  }

  /**
   * Wrap action with callback param
   */
  function action(fn) {
    return function wrappedAction(cb) {
      fn(cb);
    };
  }

  // Expose public properties
  this.log = action(log);
}

module.exports = Git;


