'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var fs = require('fs');

var projectDescriptor = require('./package');

const PACKAGE_JSON = 'templates/package.json';

module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      "Welcome to the top-notch " + chalk.green('generator-molab-webapp') + " generator!"
    ));

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

      projectDescriptor['name'] = this.props.appName;

    }.bind(this));
  },

  writing: function () {

    fs.writeFile(PACKAGE_JSON, JSON.stringify(projectDescriptor));

    this.fs.copy(
      this.templatePath(),
      this.destinationPath()
    );
  },

  install: function () {
    this.installDependencies();
  }
});
