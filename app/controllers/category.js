var Category = require('../models/category');

//category
exports.new = function(req, res){
	res.render('category_admin', {
		title: '分类录入',
		category: {
			name:'',
		}
	})
}

exports.save = function(req, res){
	var _category = req.body.category;
	var category = new Category(_category);
	category.save(function(err, category){
		if (err) {console.log(err)}
		res.redirect('/admin/categorylist');
	})
}

exports.list = function(req, res){
	Category.fetch(function(err, categories){
		if (err) {console.log(err)};
		res.render('categorylist', {
			title: '类别汇总',
			categories: categories
		})
	})
}