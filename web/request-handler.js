var path = require('path');
var URL = require('url');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers.js');
var fs = require('fs');
// require more modules/folders here!



exports.handleGet = function (req, res) {
  var sites = archive.paths.archivedSites;
  var webPublic = archive.paths.siteAssets;
  var list = archive.paths.list;
  var pathName = URL.parse(req.url).pathname;

  if (pathName === '/') {
    httpHelpers.serveAssets(res, webPublic + '/index.html', function(error, contents) {
      res.writeHead(200, httpHelpers.headers);
      res.end(contents);
    });
  } else {
    fs.access(sites + pathName, function (error) {
      if (!error) {
        httpHelpers.serveAssets(res, sites + pathName, function(error, contents) {
          res.writeHead(200, httpHelpers.headers);
          res.end(contents);
        });
      } else {
        httpHelpers.serveAssets(res, webPublic + '/loading.html', function(error, contents) {
          res.writeHead(404, httpHelpers.headers);
          res.end(contents);
        });
      }
    });
  }
};

exports.handlePost = function (req, res) {
  var sites = archive.paths.archivedSites;
  var webPublic = archive.paths.siteAssets;
  var list = archive.paths.list;

  var body = '';
  req.on('data', function(chunk) {
    body += chunk;
  });
  req.on('end', function() {
    var pathName = '/' + body.slice(4);
    fs.access(sites + pathName, function (error) {
      if (!error) {
        httpHelpers.serveAssets(res, sites + pathName, function(error, contents) {
          res.writeHead(200, httpHelpers.headers);
          res.end(contents);
        });
      } else {
        fs.appendFile(list, body.slice(4) + '\n', 'utf8', function (err) {
          console.log ('Added ' + body.slice(4) + ' to ' + list);
        });

        httpHelpers.serveAssets(res, webPublic + '/loading.html', function(error, contents) {
          res.writeHead(302, httpHelpers.headers);
          res.end(contents);
        });
      }
    });
  });
};


