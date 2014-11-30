var path = require('path');

module.exports = {
  name: 'ember-cli-parse',

  includedCommands: function() {
    return {
      'parse': require('./lib/commands/parse')
    }
  },

  blueprintsPath: function() {
    return path.join(__dirname, 'blueprints');
  }
}
