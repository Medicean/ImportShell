const UI = require('./libs/ui');
const IMPORTER = require('./libs/core');

class Plugin {
  constructor(opt) {
    new UI()
    .onImport((argv) => {
        return new IMPORTER(argv);
    });
  }
}

module.exports = Plugin;
