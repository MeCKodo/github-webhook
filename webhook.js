/**
 * Created by appian on 2017/2/28.
 */
const express = require('express');
const bodyParser = require('body-parser');
const process = require('child_process');
const ejs = require('ejs');
const app = express();
app.engine('html', ejs.__express);
app.set('view engine', 'html');
app.set('views', __dirname);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  res.send('kodo webhook ok');
});

app.post('/webhook', (req, res) => {
  webhook(req, res, 'webhook', '/home/kodo/github-webhook');
});

/*app.post('/multi', function (req, res) {
  webhook(req, res, '', '/home/kodo/',function() {
    process.exec('npm run build && npm run restart', { 'cwd': '/home/kodo/' }, function (error, stdout, stderr) {
      if (error) {
        res.send(`<pre>fail!!!\n${error}</pre>`);
      } else {
        console.log('npm run restart 执行成功');
      }
    });
  });
});*/

function webhook(req, res, token, cwd, callback) {
  if (token === req.body['token']) {
    // console.info(process);
    process.exec('git pull', { 'cwd': cwd }, function (error, stdout, stderr) {
      console.log('stdout========================\n' + stdout);
      console.log('stderr========================\n' + stderr);
      if (error !== null) {
        res.send('<pre>fail!!!\n' + stdout + error + '</pre>');
      } else {
        res.send('<pre>done!!!\n' + stdout + '</pre>');
        callback && callback()
      }
    });
  } else {
    console.log(' failed token ');
    res.send('<pre>token不正确?</pre>');
  }
}

app.set('port', 4000);

const server = app.listen(4000, function () {
  console.log('Listening on port %d', server.address().port);
});
