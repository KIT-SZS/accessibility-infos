var sys = require('sys')
var exec = require('child_process').exec;
var execSync = require('execSync').run;
var fs = require('fs');



//first update json data
var convertData = execSync("node parser/parser.js");
console.log("converting data to json:\n",convertData);
//move files
console.log("moving generated files to data folder");
fs.renameSync("rooms.json"          , "data/rooms.json");
fs.renameSync("roomsByBuilding.json", "data/roomsByBuilding.json");
fs.renameSync("buildings.json"      , "data/buildings.json");

//vulcanize custom element, just in case
var vulcanize = execSync("vulcanize --inline index.html");
console.log("vulcanizing:\n",vulcanize);

//do some git magic
var publishGitMaster = execSync("git push origin master");
var publishGitPages  = execSync("git push -f origin master:gh-pages");
var publishOk = publishGitMaster && publishGitPages;
console.log("Publishing to github:\n",publishOk);

/*var gitCheckoutGhPages = execSync("git checkout gh-pages");
console.log("Checking out gh-pages branch:\n",gitCheckoutGhPages);

var gitRebaseFromMaster = execSync("git rebase master");
console.log("Rebase from master:\n",gitRebaseFromMaster);

var gitPushToGhPages = execSync("git push origin gh-pages");
console.log("Pushing pages:\n",gitPushToGhPages);

var gitCheckoutMaster = execSync("git checkout master");
console.log("Returning to master branch:\n",gitCheckoutMaster);*/
