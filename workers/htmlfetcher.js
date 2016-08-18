// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require(__dirname + '/../helpers/archive-helpers.js');

archive.readListOfUrls(function (array) {
  archive.downloadUrls(array);
});