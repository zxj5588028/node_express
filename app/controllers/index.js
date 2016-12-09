var Movie = require('../models/movie');
var Category = require('../models/category');
//index page
exports.index = function(req, res){
	Category
	.find({})
	.populate({path: 'movies', options: {limit: 20}})
	.exec(function(err, categories){
		console.log('categories');
		console.log(categories);
		if (err) {
			console.log(err);
			return;
		}
		res.render('index', {
			title: '开始node实战啦',
			categories: categories
		})
	})

}

//search
exports.search = function(req, res){
  var catId = req.query.cat;
  var q = req.query.q;
  var page = parseInt(req.query.p, 10) || 0;
  var limit = 2;
  var offset = page * limit;

  if (catId) {
	  Category
		.find({_id: catId})
		.populate({
			path: 'movies'
		})
		.exec(function(err, categories){
			if (err) {
				console.log(err);
				return;
			}
			var category = categories[0] || {};
			var movies = category.movies || [];
			var results = movies.slice(offset, offset + limit);
			res.render('results', {
				title: '单个类目的电影',
				keyword: category.name,
				currentPage: (page + 1),
				query: 'cat=' + catId,
				totalPage: Math.ceil(movies.length / limit),
				movies: results
			})
		})
  } else {
  	Movie
  	  .find({title: new RegExp(q + '.*', 'i')})//正则匹配
  	  .exec(function(err, movies){
  	  	console.log('movies***********************');
  	  	console.log(movies);
  	  	if (err) {
  	  		console.log(err);
  	  	}
		var results = movies.slice(offset, offset + limit);
		res.render('results', {
			title: '单个类目的电影',
			keyword: q,
			currentPage: (page + 1),
			query: 'q=' + q,
			totalPage: Math.ceil(movies.length / limit),
			movies: results
		})
  	  })
  }

}