/*
 * slush-boast-generator
 * https://github.com/holtmansfield/slush-boast-generator
 *
 * Copyright (c) 2015, Holt Mansfield
 * Licensed under the MIT license.
 */

'use strict';

var     gulp = require('gulp');
var  install = require('gulp-install');
var conflict = require('gulp-conflict');
var template = require('gulp-template');
var   rename = require('gulp-rename');
var        _ = require('underscore.string');
var inquirer = require('inquirer');
var    shell = require('gulp-shell');
var        Q = require('q');
var runSequence = require('run-sequence');

function format(string) {
    if(string) {
        var username = string.toLowerCase();
        return username.replace(/\s/g, '');
    } else {
        return "";
    }
}

var defaults = (function () {
  var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,
      workingDirName = process.cwd().split('/').pop().split('\\').pop(),
      osUserName = homeDir && homeDir.split('/').pop() || 'root',
      configFile = homeDir + '/.gitconfig',
      user = {};
  if (require('fs').existsSync(configFile)) {
      user = require('iniparser').parseSync(configFile).user;
  }
  return {
      appName: workingDirName,
      userName: format(user.name) || osUserName,
      authorEmail: user.email || ''
  };
})();

gulp.task('bower', shell.task([
  'bower install angular --save',
  'bower install ui-router --save',
  'echo angular installed...'
]));

gulp.task('default', function(done) {
  runSequence('bower', 'main');
});

gulp.task('main', function (done) {
    var prompts = [{
        name: 'appName',
        message: 'What is the name of your project?',
        default: defaults.appName
    }, {
        type: 'confirm',
        name: 'moveon',
        message: 'Continue?'
    }];
    //Ask
    inquirer.prompt(prompts,
        function (answers) {
            if (!answers.moveon) {
                return done();
            }

            var inputData = {};
            inputData.answers = answers;
            inputData.answers.appNameSlug = _.slugify(answers.appName);
            inputData.cwd = process.cwd();

            gulp.src(__dirname + '/templates/**')
                .pipe(template(inputData))
                .pipe(rename(function (file) {
                    console.log(JSON.stringify(file));
                    if(file.basename.indexOf('_') === 0) {
                        file.basename = file.basename.replace('_','.');
                    }
                }))
                .pipe(conflict('./'))
                .pipe(gulp.dest('./client/public'))
                .pipe(install())
                .on('end', function () {
                    //gulp.start('bower');
                    done();
                });
        }); // end inquirer callback
});// end default task
