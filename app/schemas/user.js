var Mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

var userSchema = new Mongoose.Schema({
	name: {
		type: String,
		unique: true
	},
	password: String,
	//0: normal user
	//1: verified user
	//2: professonal user
	//>10: admin
	//>50: super admin
	role: {
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

userSchema.pre('save', function(next){
	var user = this;
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if (err) {
			return next(err);
		}
		bcrypt.hash(user.password, salt, function(err, hash){
			if (err) {
				return next(err);
			}
			console.log('****hash****');
			console.log(hash);
			user.password = hash;
			next();
		})
	});
})

userSchema.methods = {
	comparePassword: function(_password, cb){
		bcrypt.compare(_password, this.password, function(err, isMatch){
			if (err) {return cb(err)}
			cb(null, isMatch);
		})
	}
}

userSchema.statics = {
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

module.exports = userSchema;


