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
var addGit = execSync("git add data locales vulcanized.html accessibility-infos.html accessibility-infos.css index.html");
var commitGit = execSync("git commit -m '- autoUpdated data/repository on "+new Date() +"'");
var publishGitMaster = execSync("git push origin master");
var publishGitPages  = execSync("git push -f origin master:gh-pages");
var publishOk = addGit && commitGit && publishGitMaster && publishGitPages;
console.log("Publishing to github:\n",publishOk);

