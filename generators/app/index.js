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
      },
      {
        type: "confirm",
        name: "threejs",
        required: true,
        message: "Is this a ThreeJS project?",
        default: false
      }
    ];

    return this.prompt(prompts)
      .then(function (props) {
          // To access props later use this.props.someAnswer;
          this.props = props;
          this['projectDescriptor'] = projectDescriptor;
          this.projectDescriptor['name'] = this.props.appName;
          this.destinationRoot(this.props.appName);

          if (this.props.threejs) {
            this.composeWith('molab-webapp:threejs', {options: {destinationPath: this.destinationPath()}})
          }
        }.bind(this)
      );
  },

  writing: function () {
    this.log("writing base webapp files to project");
    var self = this;
    var done = self.async();

    var writeProject = new Promise(function (resolve, reject) {
      fse.copy(
        self.templatePath(),
        self.destinationPath(),
        resolve
      );
    });

    writeProject.then(function () {
      fse.writeFile(PACKAGE_JSON, JSON.stringify(self.projectDescriptor), (err) => {
        if (err) {
          throw err;
        }
        done();
      });
    }).catch(function (err) {
      throw(err)
    })
  },

  install: function () {
    this.log("installing base dependencies");
    this.npmInstall();
  }
});
