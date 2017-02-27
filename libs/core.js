/**
 * 核心模块
 */

const fs = require('fs'),
  path = require('path');

class Impoter {
  constructor(argv) {
    this.dataPath = path.join(process.env.AS_WORKDIR, 'antData', 'db.ant');
    return new Promise((res, rej) => {
        try {
            fs.writeFileSync(this.dataPath, argv.content, {flag: 'a+'});
        }catch (err){
            return res({status: 0, err: err});
        }
        return res({status: 1});
    });
  }
}

module.exports = Impoter;
