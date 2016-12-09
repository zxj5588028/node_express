module.exports = function(grunt){
	grunt.initConfig({
		watch: {
			jade: {//jade和下面的js只是一个任务的名字，而不是代表jade文件或者js文件
				files: ['views/**'],
				options: {
					livereload: true//当文件出现改动，重新加载内容
				}
			},
			js: {
				files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
				// tasks: ['jshint'],//修改了文件之后，自动进行脚本检查
				options: {
					livereload: true
				}
			}
		},

		nodemon: {
			dev: {
				script: 'app.js',//入口文件
				options: {
					args: [],
					nodeArgs: ['--debug'],
					ignore: ['README.md', 'node_modules/**', '.DS_Store'],
					ext: 'js',
					watch: ['./'],
					delay: 1000,
					env: {
						port: 3000
					},
					cwd: __dirname//设置当前目录
				}
			}
		},

		
		jshint: {
		  options: {
		    jshintrc: '.jshintrc',
		    ignores: ['public/libs/**/*.js']
		  },
		  all: ['public/js/*.js', 'test/**/*.js', 'app/**/*.js']
		},

		uglify: {
		  development: {
		    files: {
		      'public/build/admin.min.js': 'public/js/admin.js',
		      'public/build/detail.min.js': [
		        'public/js/detail.js'
		      ]
		    }
		  }
		},

		less: {
		  development: {
		    options: {
		      compress: true,
		      yuicompress: true,
		      optimization: 2
		    },
		    files: {
		      'public/build/index.css': 'public/less/index.less'
		    }
		  }
		},

		// mochaTest: {
		//   options: {
		//     reporter: 'spec'
		//   },
		//   src: ['test/**/*.js']
		// },

		concurrent: {
			tasks: ['nodemon', 'watch', 'jshint', 'uglify', 'less'],
			options: {
				logConcurrentOutput: true
			}
		}
	})

	grunt.loadNpmTasks('grunt-contrib-watch');
	//watch 可以监控特定的文件，在添加文件、修改文件、或者删除文件的时候自动执行自定义的任务，比如 livereload 等等。（不一定是重启哦，是自定义任务）
	grunt.loadNpmTasks('grunt-nodemon');//实时监听appjs，如果改变会重启
	grunt.loadNpmTasks('grunt-concurrent');//优化慢任务的时间，比如less等。然后可以组合watch和nodemon。并发执行任务
	// grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-jshint');//jshint
	grunt.loadNpmTasks('grunt-contrib-uglify');//uglify
	grunt.loadNpmTasks('grunt-contrib-less');//less
	grunt.option('force', true);//不会因为grunt的警告等而中断整个任务
	grunt.registerTask('default', ['concurrent']);
	// grunt.registerTask('test', ['mochaTest'])
}