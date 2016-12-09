var User = require('../models/user');
//注册
exports.signup = function(req, res){
	var _user = req.body.user;

	User.findOne({name: _user.name}, function(err, user){
		if (err) {console.log(err)}
		if (user) {
			res.redirect('/signin')
		} else{
			var user = new User(_user);
			user.save(function(err, user){
				if (err) {
					console.log(err);
					return;
				} else {
					req.session.user = user;
					res.redirect('/');
				}
			})
		}
	})
}


//用户列表
//不在路由中对用户的权限进行判断，而是单独拎出去，保持业务的独立。
exports.list = function(req, res){
	User.fetch(function(err, users){
		if (err) {
			console.log(err);
			return;
		}
		res.render('userList', {
			title: '用户列表页中心',
			users: users
		})
	})
	
}
//登录
exports.signin = function(req, res){
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;

	User.findOne({name: name}, function(err, user){
		if (err) {console.log(err)}
		if (!user) {
			res.redirect('/signup');
		}
		user.comparePassword(password, function(err, isMatch){
			if (err) {
				console.log(err)
			}
			if (isMatch) {
				//保存登录状态
				req.session.user = user;
				res.redirect('/');
			} else {
				res.redirect('/signin');
				console.log('用户名或者密码错误');
			}
		})
	})
}

//退出
exports.logout = function(req, res){
	delete req.session.user;
	// delete app.locals.user;
	res.redirect('/');
}

//登录页面
exports.showSignin = function(req, res){
	res.render('signin', {
		title: '登录页面'
	})
}

//注册页面
exports.showSignup = function(req, res){
	res.render('signup', {
		title: '注册页面'
	})
}

//登入验证
exports.signinRequired = function(req, res, next){
	var user = req.session.user;

	if(!user){
		return res.redirect('/signin');
	}
	next();
}

//管理员验证
exports.adminRequired = function(req, res, next){
	var user = req.session.user;

	if(user.role <= 10){
		return res.redirect('/signin');
	}
	next();
}