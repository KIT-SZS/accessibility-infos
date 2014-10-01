var fs  = require('fs');
var XLSX = require('xlsx');



function createEntry(schema){
  var buildingTemplate = {
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

  var roomTemplate ={ 
    nb:"",
    buildingNb:"",
    name:"",
    floor:"",
    description:"",
    altEntranceDescription:"",
   
    furniture:{
      permaChairs:false,
      typeOfDesks:false,
      wheelChairDesk:false,
      wheelChairPlace:"",
      normalTablesAndChairs:true,
      extraTablesPossible:false,
      reflectingBoard:false,
    },
    powerPlugs:{
      amount:0,
      position:"",
      extraLengthNeeded:"",
    },
    AudioOutput:{
      information:""
    },
    Barriers:"",
    Various:""
  };

  
  var instance = buildingTemplate;//generator.generate();
  if(schema == "rooms") instance = roomTemplate;
  return instance;
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

function deepForceType(obj, value, path, schema)
{
    path = path.split('.');
    for (i = 0; i < path.length - 1; i++)
        obj = obj[path[i]];

    var loc = path[i];
    var newValue = value;
    var schemaVal = deepValue(schema, path.join("."));
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



function parseData(workBook, sheetName, outputName)
{
  console.log("Converting data");
  //load all our helper/maping data structures
  var baseName = "./"+outputName;
  var de_En         = require("./buildings_deEn_tableFields.json");
  var structureMap  = require(baseName+"_structureMap.json");
  var jsonSchema    = require(baseName+"_schema.json");

  var output = [];

  var sheet = workBook.Sheets[sheetName];
  var range = XLSX.utils.decode_range(sheet['!ref']);

  //console.log("Range",range);
  var startIndex = 2; //what lines/rows to ignore
  for(var R = range.s.r+startIndex; R <= range.e.r; ++R) {
    var currentEntry = createEntry( outputName );
    var tmpFields = {};
    var titleDe = "";
    var titleEn = "";
    
    for(var C = range.s.c; C <= range.e.c; ++C) {
      var cellref = XLSX.utils.encode_cell({c:C, r:R}); // construct A1 reference for cell
      var cell = sheet[cellref];

      //extract main category (upper row)
      var titleCellRef = XLSX.utils.encode_cell({c:C, r:0});
      var titleCell = sheet[titleCellRef];
      if(titleCell){
        titleDe = sheet[titleCellRef].w;
        titleEn = de_En[titleDe];
      }

      //extract sub category (second row from top)
      var subtitleCellRef = XLSX.utils.encode_cell({c:C, r:1});
      var subtitleDe = sheet[subtitleCellRef].w;
      var subtitleEn = de_En[subtitleDe];

      var path = titleEn+"."+subtitleEn
      //console.log('"'+titleDe+"."+subtitleDe+'":');
      //console.log('"'+path+'":');
      var mappedPath = structureMap[path];
      //console.log("mappedPath",path, mappedPath);
      if(!mappedPath) continue;
      
      var value = "";
      if(cell) value = cell.w;

      //set output value
      deepAssign(currentEntry, value, mappedPath);
      //format when needed
      deepForceType(currentEntry, value, mappedPath, jsonSchema);

    }
    //console.log("Result",currentEntry);
    //throw new Error("");
    output.push( currentEntry );
  }

  fs.writeFileSync(outputName+".json",JSON.stringify(output) );
}

////////////
var workbook = XLSX.readFile('./parser/tabelle_gesamt_stand_2014-09-24.xlsx',{cellHTML:false})

var buildings = workbook.Sheets['Gebäude']; 
var rooms     = workbook.Sheets['Räume']; 

//parseData( workbook, "Gebäude", "buildings" );
//parseData( workbook, "Räume", "rooms" );

//FIXME: temporary hack for rooms data structure

var rooms = JSON.parse( fs.readFileSync("rooms.json") );

var roomsOutput = {};

for(var i=0;i<rooms.length;i++)
{
  var room = rooms[i];
  var buildingNb = room.buildingNb;
  if(!(room.buildingNb in roomsOutput)) roomsOutput[buildingNb] = [];
  roomsOutput[buildingNb].push( room );
}
console.log("roomsOutput",roomsOutput);
fs.writeFileSync("roomsByBuilding.json",JSON.stringify(roomsOutput) );
/*
Allgemeine Daten
  Geb.-Nr.
  Raum-Nr.
  Name
  Stockwerk
  Beschreibung
  Alternativer Zugang Beschreibung

Mobiliar						
  festeBestuhlung
  Art der Tische	
  unterfahrbare Tische
  normale Tische/Stühle
  Möglichkeit extra Tisch einzurichten
	spiegelndeTafeln	

Steckdosen
  Anzahl
  Ort
  "Verlängerungs-kabel nötig"

Audioausgang

Barrieren

Sonstiges


*/

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
  Stockwerkansage	Allgemeine Daten						Mobiliar						Steckdosen					
Geb.-Nr.	Raum-Nr.	"Name
Raum"	Stockwerk	Beschreibung	"Alternativer Zugang
Beschreibung"	"feste
Bestuhlung"	"Art der
Tische"	unterfahrbare Tische	"normale Tische/
Stühle"	"Möglichkeit extra
Tisch einzurichten"	"spiegelnde
Tafeln"	Anzahl	Ort	"Verlängerungs-
kabel nötig"	Audioausgang	Barrieren	Sonstiges

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

