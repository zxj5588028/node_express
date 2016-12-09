var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var categorySchema = new Schema({
	name: String,
	//movies字段是动态添加
	movies: [{
		type: ObjectId,
		ref: 'Movie'
	}],
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	},
});

categorySchema.pre('save', function(next){
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
})

categorySchema.statics = {
	fetch: function(cb){
		return this
		  .find({})
		  .sort('meta.updateAt')
		  .exec(cb);
	},
	findById: function(id, cb){
		return this
		  .findOne({_id: id})
		  .sort('meta.updateAt')
		  .exec(cb);
	}
}

module.exports = categorySchema;


