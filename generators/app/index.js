'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fse = require('fs-extra');

var projectDescriptor = require('./package');

const PACKAGE_JSON = 'package.json';

module.exports = yeoman.Base.extend({

  initializing: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      "Welcome to the top-notch " + chalk.green('generator-molab-webapp') + " generator!"
    ));

    this.composeWith('molab-webapp:threejs');
  },

  prompting: function () {
    var prompts = [
      {
        type: "input",
        name: "appName",
        required: true,
        desc: 'my-web-app',
        message: "What's your project name?",
        default: "my-web-app" // Default to current folder name
      }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
      this.props.projectDescriptor = projectDescriptor;
      this.props.projectDescriptor['name'] = this.props.appName;
      this.destinationRoot(this.props.appName);
    }.bind(this));
  },

  writing: function () {
    var self = this;

    var writeProject = new Promise(function (resolve, reject) {
      fse.copy(
        self.templatePath(),
        self.destinationPath(),
        resolve
      );
    });

    writeProject.then(function () {
      fse.writeFile(PACKAGE_JSON, JSON.stringify(self.props.projectDescriptor), (err) => {
        if (err) {
          throw err;
        }
      });
    }).catch(function (err) {
      throw(err)
    })
  },

  install: function () {
    this.npmInstall();
  }
});
