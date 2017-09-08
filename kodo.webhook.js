/**
 * Created by appian on 2017/2/28.
 */
const process = require('child_process');
const http = require('http');
const createHandler = require('github-webhook-handler');
const handler = createHandler({ path: '/webhook', secret: 'webhook' });

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404;
    res.end('no such location');
  })
}).listen(4000);

handler.on('error', function (err) {
  console.error('Error:', err.message)
});

handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);
  update('/home/kodo/github-webhook', () => {
    process.exec('npm run build && npm run restart', { 'cwd': '/home/kodo/github-webhook' }, function (error) {
      if (error) {
        console.log(`fail!!!\n${error}`);
      } else {
        console.log('npm run restart 执行成功');
      }
    });
  })
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

