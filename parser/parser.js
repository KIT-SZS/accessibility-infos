var fs  = require('fs');
var XLSX = require('xlsx');

//load all our helper/maping data structures
var de_En         = require("./deEn_tableFields.json");
var structureMap  = require("./structureMap.json");
var jsonSchema    = require("./schema.json");

function createEntry(){

  var template = {
    nb:"",
    name:"",
    adress:"",
    emergencyNb:"",
    mainEntrance:{
      stairs: {
        absent:false,
        amount:0
      },
      ramp:null, 
      entrance:false,
      doorOpener:false,
      revolvingDoor:false,
      hardToOpen:true,
      dangerPoints:""
    },
    secEntrance:{
      stairs: {
        absent:false,
        amount:0
      },
      ramp:null, 
      entrance:false,
      doorOpener:false,
      revolvingDoor:false,
      hardToOpen:true,
      dangerPoints:""
    },
    lift:{
      description:"",
      floors:{
        access:[0,1],
        display:true,
        audio:true,
      },
      controls:{
        wheelChairAccess:true,
        brailleText:true,
        profileText:true,
      },
      access:"",//Nutzungsberechtigung
      dimentions:{
        doorWidth:0,
        inner:""
      }
    },
    toiletForDisabled:{
      description:"",
      euroDoor:false,
      remarks:"",

    },
    dangers:{
      present:false,description:""
    },
    various:{
      notes:""
    }
  }
  return template;
}



function formatGermanJaNeinToBoolean( entry )
{
  if(!entry) return false;
  if(entry.toLowerCase() == "ja") return true;
  if(entry.toLowerCase() == "nein") return false;
}

function deepValue(obj, path){
    if(path.indexOf(".") === -1) return obj[path];
    for (var i=0, path=path.split('.'), len=path.length; i<len; i++){
        obj = obj[path[i]];
    };
    return obj;
}

function deepAssign(obj, value, path) {
    path = path.split('.');
    for (i = 0; i < path.length - 1; i++)
        obj = obj[path[i]];

    obj[path[i]] = value;
}

function deepForceType(obj, value, path)
{
    path = path.split('.');
    for (i = 0; i < path.length - 1; i++)
        obj = obj[path[i]];

    var loc = path[i];
    var newValue = value;
    var schemaVal = deepValue(jsonSchema, path.join("."));
    //console.log("schemaVal",path, schemaVal);
    switch(schemaVal.type){
      case "integer":
        if(!value){ newValue = 0;
        }else{  
        newValue = parseInt(value);}
      break;
      case "boolean":
        newValue = formatGermanJaNeinToBoolean(value);
      break; 
    }
    obj[loc] = newValue;
}

var structure = {};
var output = [];


var workbook = XLSX.readFile('./parser/tabelle_gesamt_stand_2014-09-24.xlsx',{cellHTML:false})

var sheetNames = workbook.SheetNames;

var buildings = workbook.Sheets['Gebäude']; 
var rooms     = workbook.Sheets['Räume']; 

var sheet = buildings;
var range = XLSX.utils.decode_range(sheet['!ref']);

console.log("buildings",range);
var startIndex = 2; //what lines/rows to ignore
for(var R = range.s.r+startIndex; R <= range.e.r; ++R) {
  var currentEntry = createEntry();
  var tmpFields = {};
  var titleDe = "";
  var titleEn = "";
  
  for(var C = range.s.c; C <= range.e.c; ++C) {
    var cellref = XLSX.utils.encode_cell({c:C, r:R}); // construct A1 reference for cell
    var cell = sheet[cellref];

    var titleCellRef = XLSX.utils.encode_cell({c:C, r:0});
    var titleCell = sheet[titleCellRef];
    if(titleCell){
      titleDe = sheet[titleCellRef].w;
      titleEn = de_En[titleDe];
    }

    var subtitleCellRef = XLSX.utils.encode_cell({c:C, r:1});
    var subtitleDe = sheet[subtitleCellRef].w;
    var subtitleEn = de_En[subtitleDe];

    var path = titleEn+"."+subtitleEn
    //console.log('"'+path+'":');
    var mappedPath = structureMap[path];
    if(!mappedPath) continue;
    
    var value = "";
    if(cell) value = cell.w;

    //set output value
    deepAssign(currentEntry, value, mappedPath);
    //format when needed
    deepForceType(currentEntry, value, mappedPath);

  }
  //console.log("Result",currentEntry);
  //throw new Error("");
  output.push( currentEntry );
}



fs.writeFileSync("out.json",JSON.stringify(output) );

/*
Geb.-Nr.	
Name 	
Adresse Gebäude
Notruf

mainEntrance							
  stufenlos
  Anzahl Stufen	
  Rampe	
  Eingangstür	
  Türöffner	
  Drehtür	
  schwer zu öffnen
  Gefahrenstellen

secondaryEntrance							
  stufenlos
  Anzahl Stufen	
  Rampe
  Eingangstür
  Türöffner
  Drehtür
  schwer zu öffnen
  Gefahrenstellen

Gefahrenquellen (unterpendelbare Treppen)	
  vorhanden
  Beschreibung

Fahrstuhl									
  Beschreibung	
  erreichbare Stockwerke	
  Bedienfeld rollstuhlgerecht	
  Brailleschrift	
  Profilschrift
  Stockwerkansage	
  Stockwerkanzeige	
  Nutzungsberechtigung
  Türbreite
  Abmessungen innen

Besonderheiten
  Infotheke

Behindertentoilette			
  Beschreibung	
  EURO-Schließsystem	
  Notruf	
  Bemerkungen

Sonnstiges
  Anmerkungen
*/

