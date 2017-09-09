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
    res.end('no such location test');
  })
}).listen(4000);


handler.on('push', function (event) {
  console.log(
    'Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref
  );
  switch(event.path) {
    case '/webhook':
      update('/home/kodo/github-webhook', () => {
        process.exec('npm run restart', { 'cwd': '/home/kodo/github-webhook' }, function (error) {
          if (error) {
            console.log(`fail!!!\n${error}`);
          } else {
            console.log('npm run restart 执行成功');
          }
        });
      });
      break;
    case '/webhook2':
      // do sth about webhook2
      break;
    default:
      // do sth else or nothing
      break;
  }
});

function update(cwd, callback) {
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

