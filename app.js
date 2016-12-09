var express = require('express');
var path = require('path');
var session = require('express-session');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var logger = require('morgan');

var port = process.env.PORT || 3000;
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var dbUrl = 'mongodb://localhost:27017/imooc';
mongoose.connect(dbUrl);

//models loading
var models_path = __dirname + '/app/models';
var walk = function(path){
	fs
	  .readdirSync(path)
	  .forEach(function(file){
	  	var newPath = path + '/' + file;
	  	var stat = fs.statSync(newPath);

	  	if(stat.isFile()){
	  		if(/(.*)\.(js|coffee)/.test(file)){
	  			require(newPath);
	  		}
	  	} else if (stat.isDirectory()) {
	  		walk(newPath);
	  	}
	  })
}

app.set('views', './app/views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');
app.use(cookieParser());
app.use(require('connect-multiparty')());
app.use(session({
	secret: 'nodeTest',
	resave: false,
	saveUninitialized: true,
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	})
}));

if ('development' === app.get('env')) {
	app.set('showStackError', true);//在窗口显示错误
	app.use(logger(':method :url :status'));//显示请求方法，路由，状态、
	app.locals.pretty = true;//格式化html,而不是一行html。
	mongoose.set('debug', true);//显示对数据库的操作
}


require("./config/routes")(app);
app.listen(port);
