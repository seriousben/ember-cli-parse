
function _requiresNewBuild(rawArgs) {
  return rawArgs.indexOf('deploy') >= 0;
}

function _validateParseConfig(config) {
    var RSVP    = require('rsvp');
    var Promise = RSVP.Promise;
    var val;
    var firstAppName;

    if (!config.applications) {
      throw 'No Applications defined!';
    }
    for (var key in config.applications) {
      val = config.applications[key];
      if (key === '_default') {
        return;
      }
      if (!key || key === 'undefined') {
        throw 'No Application name defined!';
      }
      if (!firstAppName) {
        firstAppName = key;
      }
      if (!val || val === 'undefined') {
        throw 'Empty config for application ' + key + '!';
      }
      if (!val.applicationId || val.applicationId === 'undefined') {
        throw 'Missing applicationId for application ' + key + '!';
      }
      if (!val.masterKey || val.masterKey === 'undefined') {
        throw 'Missing masterKey for application ' + key + '!';
      }
    }
    if (!config.applications._default) {
      console.warn('No _default application found, using', firstAppName);
      config.applications._default = { link: firstAppName };
    }
}

module.exports = {
  name: 'parse',
  description: 'Passes through commands to parse-cli.',
  availableOptions: [
    { name: 'environment', type: String, default: 'development' }
  ],

  runCommand: function(command, args, commandOptions) {
    var path    = require('path');
    var RSVP    = require('rsvp');
    var Promise = RSVP.Promise;
    var spawn   = require('child_process').spawn;
    var root    = this.project.root;
    var parseAppDist = path.join(root, 'dist');
    var options = {
      cwd: parseAppDist
    };

    return new Promise(function(resolve, reject) {
      var child = spawn(command, args, options);

      var result = {
        output: [],
        errors: [],
        code: null
      };

      child.stdout.on('data', function(data) {
        var string = data.toString();

        console.log(string);

        result.output.push(string);
      });

      child.stderr.on('data', function(data) {
        var string = data.toString();

        console.error(string);

        result.errors.push(string);
      });

      child.on('close', function(code) {
        result.code = code;

        if (code === 0) {
          resolve(result);
        } else {
          reject(result);
        }
      });

      child.on('error', function(error) {
        console.error('Error running ' + command + ':', error);
        reject(error);
      });
    });
  },

  refreshParseConfig: function(commandOptions) {
    var path    = require('path');
    var fs = require("fs");
    var RSVP    = require('rsvp');
    var mkdirp = require('mkdirp');
    var Promise = RSVP.Promise;
    var root = this.project.root;
    var configPath = path.join(root, 'config', 'parse');
    var cloudPath = path.join(root, 'config', 'parse-cloud');
    var parseCloudFolder = path.join(root, 'dist', 'cloud');
    var parseConfigFolder = path.join(root, 'dist', 'config');
    var parseCloudFile = path.join(parseCloudFolder, 'main.js');
    var parseConfigFile = path.join(parseConfigFolder, 'global.json');

    return new Promise(function(resolve, reject) {
      var config = require(configPath)(commandOptions.environment);

      _validateParseConfig(config);
      config = JSON.stringify(config, null, 4);

      mkdirp(parseCloudFolder, function (err) {
          if(err) {
            console.error(err);
            reject(err);
          } else {
            console.log("Created parse cloud folder");

            mkdirp(parseConfigFolder, function (err) {
                if(err) {
                  console.error(err);
                  reject(err);
                } else {
                  console.log("Created parse config folder");
                  fs.readFile(cloudPath, function (err, data) {
                    if(err) {
                      console.error(err);
                      reject(err);
                    } else {
                      fs.writeFile(parseCloudFile, data, function(err) {
                          if(err) {
                            console.error(err);
                            reject(err);
                          } else {
                            console.log("Touched cloud/main.js ");
                            fs.writeFile(parseConfigFile, config, function(err) {
                                if(err) {
                                  console.error(err);
                                  reject(err);
                                } else {
                                  console.log("Config saved to config/global.json");
                                  resolve();
                                }
                            });
                          }
                      });
                    }
                  });
                }
            }); 
          }
      });
    });
  },

  triggerBuild: function(commandOptions) {
    var BuildTask = this.tasks.Build;
    var buildTask = new BuildTask({
      ui: this.ui,
      analytics: this.analytics,
      project: this.project
    });

    commandOptions.outputPath = 'dist/public';
    return buildTask.run(commandOptions);
  },

  run: function(options, rawArgs) {
    var self = this;
    // Command needs to be in path.
    var command = 'parse';

    options.environment = options.environment || 'development';

    var mainPromise = this.refreshParseConfig(options);

    if (_requiresNewBuild(rawArgs)) {
      mainPromise = mainPromise.then(function() {
        return self.triggerBuild(options);
      });
    }
    mainPromise = mainPromise.then(function(p) {
      return self.runCommand(command, rawArgs, options);
    });

    return mainPromise;
  }
};
