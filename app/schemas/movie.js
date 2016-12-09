var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var movieSchema = new Schema({
	doctor: String,
	title: String,
	year: Number,
	language: String,
	country: String,
	summary: String,
	flash: String,
	poster: String,
	category: {
		type: ObjectId,
		ref: 'Category'
	},
	pv: {
		type: Number,
		default: 0
	},
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

movieSchema.pre('save', function(next){
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
})

movieSchema.statics = {
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

module.exports = movieSchema;


