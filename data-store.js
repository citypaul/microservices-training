var fs = require('fs');

module.exports = function (eventEmitter) {
    var filePaths = [];

    eventEmitter.on('fileAdded', read);

    function read(path) {
        var filePath = __dirname + '/' + path;

        if (fs.lstatSync(filePath).isFile()) {
            filePaths.push(filePath);
        }
    }

    function write() {
        return filePaths.map(function (filePath) {
            return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        });
    }

    return {
        write: write
    }
}