'use strict';

var yeoman = require('yeoman-generator');
var fse = require('fs-extra');

module.exports = yeoman.Base.extend({

  prompting: function () {
    var prompts = [
      {
        type: "confirm",
        name: "threejs",
        required: true,
        message: "Is this a ThreeJS project?",
        default: false
      }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    var self = this;
    this.log(self.destinationRoot());
    if(this.props.threejs) {
      var writeProject = new Promise(function (resolve, reject) {
        fse.copy(
          self.templatePath(),
          self.destinationRoot(),
          resolve
        );
      });

      writeProject.catch(function (err) {
        throw(err)
      })
    }

  },

  install: function() {
    if(this.props.threejs) {
      this.npmInstall(['three'], {'save': true});
    }
  }

});
