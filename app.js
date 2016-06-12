var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');

var settings = require('./settings');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var fs = require('fs');
var accessLog = fs.createWriteStream('access.log',{flags:'a'});
var errorlog = fs.createWriteStream('error.log',{flags:'a'});




//生成express实例app
var app = express();

// view engine setup
//设置视图存放路径，__dirname是全局变量，存储当前正在执行的脚本所在目录

app.set('port',process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(favicon());
//设置favicon图标
//app.use(favicon(__dirname + '/public/favicon.ico'))
//加载日志中间件
app.use(logger({stream: accessLog}));
app.use(logger({stream: errorlog}));
//加载解析json的中间件
app.use(bodyParser.json());
//加载解析urlencoded请求的中间件
app.use(bodyParser.urlencoded());
//加载解析cookie 的中间件
app.use(cookieParser());
//静态文件路径
app.use(express.static(path.join(__dirname, 'public')));



app.use(function (err,req,res,next){
  var meta = '[' + new Date() +  ']' + req.url + '\n';
  errorlog.write(meta + err.stack + '\n');
  next();
});


var options = {
  "host": "127.0.0.1",
  "port": "6379",
  "ttl": 60 * 60 * 24 * 30,   //Session的有效期为30天
};


//设置将session存入mongodb
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret:settings.cookiesSecret,
  key:settings.db,//cookie的名字
  cookie:{maxAge:1000 * 60 * 60 * 24 * 30},//30天生存期
  //store: new RedisStore(options),
  //设置MongoStore实例
  store:new MongoStore({
    db:settings.db,
    host:settings.host,
    port:settings.port,
    url: 'mongodb://localhost/blog'
  })
}))

app.use(flash());

//路由控制器
//routes(app);
require('./routes.js')(app);

app.use(function(req, res, next){
  res.status(404);
  res.render('404');
});

// 500 error handler (middleware)
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'),function(){
  console.log('Express server listening on port' + app.get('port'));
}).setMaxListeners(0);
