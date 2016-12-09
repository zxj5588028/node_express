var Movie = require('../models/movie');
var Category = require('../models/category');
var Comment = require('../models/comment');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');
//detail page
exports.detail = function(req, res){
	var id = req.params.id;
	Movie.findById(id, function(err, movie){
		Movie.update({_id: id}, {$inc: {pv: 1}}, function(err){
			if (err) {console.log(err)}
		})
		Comment
		.find({movie: id})
		//关联查找；
		//通过from里面的id字段去查找name，并把name填充到comment的from字段里面
		.populate('from', 'name')
		.populate('reply.from reply.to', 'name')
		.exec(function(err, comments){
			console.log('comments' + comments)
			res.render('detail', {
				title: '开始node实战之' + movie.title,
				movie: movie,
				comments: comments
			})
		})
	})
}
//admin page
exports.new = function(req, res){
	//先去查找所有目录
	Category.find({}, function(err, categories){
		res.render('admin', {
			title: '开始node实战之后台',
			categories: categories,
			movie: {
				title: '',
				doctor: '',
				country: '',
				language: '',
				poster: '',
				flash: '',
				year: '',
				summary: ''
			}
		})
	})
	
}

//admin get movie
exports.update = function(req, res){
	var id = req.params.id;
	var _movie;

	if (id !== 'undefined') {
		Movie.findById(id, function(err, movie){
			Category.find({}, function(err, categories){
				if (err) {
					console.log(err);
					return;
				}
				res.render('admin', {
					title: '后台更新页面' + movie.title,
					movie: movie,
					categories: categories
				})
			})
		})
	}
}

//admin poster
exports.savePoster = function(req, res, next){
	var posterData = req.files.uploadPoster;
	var filePath = posterData.path;//相当于服务器缓存图片地址
	var originalFilename = posterData.originalFilename;//原始的图片名字

	console.log(req.files);

	if(originalFilename) {
		//如果图片存在，那么就从该路径下读取资源=>修改文件的名字，用时间戳在上类型写入到新的文件下
		fs.readFile(filePath, function(err, data){
			var timestamp = Date.now();
			var type = posterData.type.split('/')[1];//type: 'image/png'
			var poster = timestamp + '.' + type;
			var newPath = path.join(__dirname, '../../', 'public/upload/' + poster);
			fs.writeFile(newPath, data, function(err){
				req.poster = poster;
				next();
			})
		})
	} else{
		next();
	}
}

//admin post movie
exports.save = function(req, res){
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
	if (req.poster) {
		movieObj.poster = req.poster;
		console.log("如果是post文件")
	}

	if (id) {
		console.log('修改电影');
		//先查找该电影，然后组合，最后进行保存。为什么要先查找呢，可以直接保存。
		Movie.findById(id, function(err, movie){
			if (err) {
				console.log(err);
				return;
			}
			//跟新电影的数据,数据以后面的为准
			_movie = _.extend(movie, movieObj);
			// _movie.category = movieObj.category;
			_movie.save(function(err, movie){
				if (err) {
					console.log(err);
					return;
				}
				res.redirect('/movie/' + movie._id);
			})
		})
	} else {
		console.log('新增电影');
		_movie = new Movie(movieObj);
		var categoryId = movieObj.category;
		var categoryName = movieObj.categoryName;

		_movie.save(function(err, movie){
			if (err) {
				console.log(err);
				return;
			}
			//先根据这个id查找到这个类目数据，插入到这个id中，然后进行保存。
			if (categoryId) {
				Category.findById(categoryId, function(err, category){
					console.log(category);
					category.movies.push(movie._id);
					category.save(function(err, category){
						res.redirect('/movie/' + movie._id);
					})
				})
			} else if(categoryName){
				var category = new Category({
					name: categoryName,
					movies: [movie._id]
				})
				category.save(function(err, category){
					movie.category = category._id;
					movie.save(function(err, movie){
						res.redirect('/movie/' + movie._id);
					})
				})
			}
		})
	}
	
}

//list page
exports.list = function(req, res){
	Movie.fetch(function(err, movies){
		if (err) {
			console.log(err);
			return;
		}
		res.render('list', {
			title: '开始node实战啦',
			movies: movies
		})
	})
	
}

//admin delete movie
exports.del = function(req, res){
	var id = req.query.id;

	if (id) {
		Movie.remove({_id: id}, function(err, movie){
			if (err) {
				console.log(err);
				return;
			} else {
				res.json({success: 1})
			}
		})
	}
}