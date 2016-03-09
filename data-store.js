var fs = require('fs');

module.exports = function (eventEmitter) {
    var filePaths = [];

    eventEmitter.on('fileAdded', addFile);
    eventEmitter.on('fileRemoved', removeFile)

    function addFile(path) {
        var filePath = __dirname + '/' + path;
        if (fs.lstatSync(filePath).isFile()) {
            console.log("Added: " + filePath);
            filePaths.push(filePath);
        }
    }

    function removeFile(removedPath) {
        removedPath = __dirname + '/' + removedPath;
        console.log("Removed: " + removedPath);
        filePaths = filePaths.filter(function(path) {
            return path !== removedPath
        });
    }

    function getContent() {
        return filePaths.map(function (filePath) {
            return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        });
    }

    return {
        getContent: getContent
    }
}