'use strict';

var yeoman = require('yeoman-generator');
var fse = require('fs-extra');

module.exports = yeoman.Base.extend({

  constructor: function () {
    yeoman.Base.apply(this, arguments);
  },

  writing: function () {
    this.log("writing threejs project files");
    var self = this;
    var done = self.async();

    var writeProject = new Promise(function (resolve, reject) {
      fse.copy(
        self.templatePath(),
        self.options.destinationPath,
        resolve
      );
    });

    writeProject
      .then(function() {
        done();
      })
      .catch(function (err) {
        throw(err)
      });

  },

  install: function () {
    this.log("installing threejs goodies");
    this.npmInstall(['three', 'stats-js', 'tween.js'], {'save': true});
  }

});
