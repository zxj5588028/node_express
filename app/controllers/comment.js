var Comment = require('../models/comment');

//comment
exports.save = function(req, res){
	var _comment = req.body.comment;
	console.log('_comment');
	console.log(_comment);
	//依赖于在表单里面定义的字段
	var movieId = _comment.movie;

	if (_comment.cid) {
		Comment.findById(_comment.cid, function(err, comment){
			var reply = {
				from: _comment.from,//当前用户id
				to: _comment.tid,//主评论人的id
				content: _comment.content
			};

			comment.reply.push(reply);

			comment.save(function(err, comment){
				if (err) {
					console.log(err);
					return;
				}
				res.redirect('/movie/' + movieId);
			})
		})
	} else {
		var comment = new Comment(_comment);
		comment.save(function(err, comment){
			if (err) {
				console.log(err);
				return;
			}
			res.redirect('/movie/' + movieId);
		})
	}

}