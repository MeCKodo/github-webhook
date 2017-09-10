/**
 * Created by appian on 2017/2/28.
 */
const process = require('child_process');
const http = require('http');
const createHandler = require('node-github-webhook');
const handler = createHandler([
  {
    path: '/webhook',
    secret: 'webhook'
  },
]);

handler.on('error', function (err) {
  console.error('Error:', err.message)
});

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404;
    res.end('no such location test 3');
  })
}).listen(4000);


handler.on('push', function (event) {
  let cwd, cmd;
  console.log(
    'Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref
  );
  switch(event.path) {
    case '/webhook':
      cwd = '/home/kodo/github-webhook';
      cmd = 'npm run restart';
      restart(cwd, cmd);
      break;
    case '/kodo-website':
      cwd = '/home/kodo/kodo-website';
      cmd = 'npm run restart';
      restart(cwd, cmd);
      break;
    default:
      break;
  }
});

function restart(cwd, execCmd) {
  gitPull(cwd, () => {
    process.exec(execCmd, { cwd }, function (error) {
      if (error) {
        console.log(`构建失败!!!\n${error}`);
      } else {
        console.log('构建执行成功！');
      }
    });
  });
}

function gitPull(cwd, callback) {
  process.exec('git pull', { 'cwd': cwd }, function (error, stdout, stderr) {
    console.log('stdout========================\n' + stdout);
    console.log('stderr========================\n' + stderr);
    if (error !== null) {
      console.log('' + stdout + error + '');
    } else {
      console.log('done!!!\n' + stdout + '');
      callback && callback();
    }
  });

}

