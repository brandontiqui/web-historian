var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

var siteAssets = path.join(__dirname, '../web/public');
var archivedSites = path.join(__dirname, '../archives/sites');
var list = path.join(__dirname, '../archives/sites.txt');

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function (err, data) {
    if (err) {
      throw err;
    } else {
      data = data.split('\n');
      if (data.slice(-1)[0] === '') { data = data.slice(0, -1); }
      callback(data);
    }
  });
};

exports.isUrlInList = function(target, callback) {
  exports.readListOfUrls(function (array) {
    if (array.indexOf(target) !== -1) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

exports.addUrlToList = function(string, callback) {
  exports.isUrlInList(string, function (listed) {
    if (!listed) {
      fs.appendFile(exports.paths.list, string + '\n', 'utf8', callback);
    }
  });    
};

exports.isUrlArchived = function(string, callback) {
  fs.access(exports.paths.archivedSites + '/' + string, function (err) {
    callback(!err);
  });
};

exports.downloadUrls = function(array) {
  array.forEach(function (url) {
    exports.isUrlArchived(url, function (archived) {
      // if (!archived) {
      request('http://' + url, function (error, response, body) {
        fs.writeFile(exports.paths.archivedSites + '/' + url, body, 'utf8', function () {
          console.log('Downloaded ' + url + ' html to ' + list);
        });
      });  
      // } 
    });
  });

};
