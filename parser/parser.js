var csv = require('csv');
var fs  = require('fs');


//var rawData = fs.readFilySync("./tabelle_gesamt_stand_2014-09-24_raume.csv");
var input = fs.createReadStream('./tabelle_gesamt_stand_2014-09-24_gebaude.csv');

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




var de_En={
"Geb.-Nr.":"nb",
"Name":"name",
"Adresse":"adress",
"Notruf":"emergencyNb",

"Haupteingang":"MainEntrance",					
"stufenlos":"stairLess",
"Anzahl Stufen":"nbStairs",
"Rampe":"ramp",	
"Eingangstür":"entrance",
"Türöffner": "doorOpener",
"Drehtür":"revolvingDoor",
"schwer zu öffnen":"hardToOpen",
"Gefahrenstellen":"dangerZones",

"Nebeneingang":"secEntrance",					

"Gefahrenquellen (unterpendelbare Treppen)":"dangerZonesUnderStairs",	
"vorhanden":"present",
"Beschreibung":"description",

"Fahrstuhl":"lift"				,				
"erreichbare Stockwerke":"accessibleFloors",
"Bedienfeld rollstuhlgerecht":"wheelChairAccessibleControls"	,
"Brailleschrift": "braille",
"Profilschrift":"ProfileWriting",
"Stockwerkansage":"floorAnnouncement",
"Stockwerkanzeige":"floorDisplay",
"Nutzungsberechtigung":"allowAccessFor",
"Türbreite":"doorWidth",
"Abmessungen innen":"innerDimentions",

"Besonderheiten":"specifics",
"Infotheke":"informationBoard",

"Behindertentoilette":"toiletForDisabled",
"EURO-Schließsystem":"euroDoorSystem"	,
"Bemerkungen":"remarks",

"Sonstiges":"various",
"Anmerkungen":"notes",
"weitere Anmerkungen":"moreNotes",
"Allgemeine Daten":"generalData",

"Kontakt Hausmeister":"caretakerContact",
"Tel. mobil":"mobileNb",
"Tel. Festnetz":"phoneNb",
"Ort Büro":"officeLocation",
"Beschreiung Büro":"officeDescription",
}

var structureMap={
  "generalData.nb":"nb",
  "generalData.name":"name",
  "generalData.adress":"adress",
  "caretakerContact.phoneNb":"emergencyNb",

  "MainEntrance.stairLess":"mainEntrance.stairs.absent",
  "MainEntrance.nbStairs":"mainEntrance.stairs.amount",
  "MainEntrance.ramp":"mainEntrance.ramp",
  "MainEntrance.entrance":"mainEntrance.entrance",
  "MainEntrance.doorOpener":"mainEntrance.doorOpener",
  "MainEntrance.revolvingDoor":"mainEntrance.revolvingDoor",
  "MainEntrance.hardToOpen":"mainEntrance.hardToOpen",
  "MainEntrance.dangerZones":"mainEntrance.dangerPoints",

  "secEntrance.stairLess":"secEntrance.stairs.absent",
  "secEntrance.nbStairs":"secEntrance.stairs.amount",
  "secEntrance.ramp":"secEntrance.ramp",
  "secEntrance.entrance":"secEntrance.entrance",
  "secEntrance.doorOpener":"secEntrance.doorOpener",
  "secEntrance.revolvingDoor":"secEntrance.revolvingDoor",
  "secEntrance.hardToOpen":"secEntrance.hardToOpen",
  "secEntrance.dangerZones":"secEntrance.dangerPoints",

  "dangerZonesUnderStairs.present":"dangers.present",
  "dangerZonesUnderStairs.description":"dangers.description",

  "lift.description": "lift.description",
  "lift.accessibleFloors": "lift.floors.access",
  "lift.floorAnnouncement":"lift.floors.audio",
  "lift.floorDisplay":"lift.floors.display",
  "lift.wheelChairAccessibleControls":"lift.controls.wheelChairAccess",
  "lift.braille":"lift.controls.brailleText",
  "lift.ProfileWriting":"lift.controls.profileText",
  "lift.allowAccessFor": "lift.access",
  "lift.doorWidth": "lift.dimentions.doorWidth",
  "lift.innerDimentions": "lift.dimentions.inner",

  "specifics.informationBoard":"infoBooth",

  "toiletForDisabled.description":"toiletForDisabled.description",
  "toiletForDisabled.euroDoorSystem":"toiletForDisabled.euroDoor",
  "toiletForDisabled.emergencyNb":"toiletForDisabled.emergencyNb",
  "toiletForDisabled.remarks":"toiletForDisabled.remarks",

  "various.moreNotes": "various.notes"
}




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
        present:false,
        amount:0
      },
      ramp:null, 
      entry:false,
      doorHandle:false,
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

//me : mainEntrance
//se : secondaryEntrance


var structure = {};

function formatRow()
{

}


var output = [];


var XLSX = require('xlsx');
var workbook = XLSX.readFile('./tabelle_gesamt_stand_2014-09-24.xlsx',{cellHTML:false})

var sheetNames = workbook.SheetNames;

console.log("workbook",sheetNames);

var buildings = workbook.Sheets['Gebäude']; 
var rooms     = workbook.Sheets['Räume']; 

var sheet = buildings;
var range = XLSX.utils.decode_range(sheet['!ref']);

console.log("buildings",range);
var startIndex = 2; //what lines/rows to ignore
for(var R = range.s.r+startIndex; R <= range.e.r; ++R) {
  var tmpFields = {};
  var titleDe = "";
  var titleEn = "";

  for(var C = range.s.c; C <= range.e.c; ++C) {
    /* find the cell object */
    var cellref = XLSX.utils.encode_cell({c:C, r:R}); // construct A1 reference for cell
    //console.log("sheet[cellref]",sheet[cellref]);
    //if(!sheet[cellref]) continue; // if cell doesn't exist, move on
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

    //console.log("cellRef", cellref,C,R, "cell",cell.w,"cellName",titleDe,titleEn,"sub",subtitleEn);

    console.log('"'+titleEn+"."+subtitleEn+'":');

   // tmpFields[subtitleEn] = cell.w;
    
    var currentEntry = createEntry();
  }
  //console.log("fooo",tmpFields);
  throw new Error("");
}




return;


function parseGermanJaNein( entry )
{
  if(!entry) return false;
  if(entry.toLowerCase() == "ja") return true;
  if(entry.toLowerCase() == "nein") return false;
}


parser = csv.parse({columns: ["valid","nb","name","adress",  "me_stairs","me_stairsCount","me_ramp","me_entry","me_doorHandle","me_revolvingDoor","me_hardToOpen","me_dangerPoints" ]}, function(err, data){
  console.log("Total Entries", data.length-2);
  //data[2]
  for(var i=2;i<data.length;i++){
    var entryData = data[i];
    var currentEntry = createEntry();
    currentEntry.nb = entryData.nb;
    currentEntry.name = entryData.name;
    currentEntry.adress = entryData.adress;

    currentEntry.mainEntrance.stairs.present = parseGermanJaNein(entryData.me_stairs);
    currentEntry.mainEntrance.stairs.amount = parseInt(entryData.me_stairsCount);
    currentEntry.mainEntrance.ramp = parseGermanJaNein(entryData.me_ramp);
    currentEntry.mainEntrance.entry = parseGermanJaNein(entryData.me_entry);
    currentEntry.mainEntrance.doorHandle = parseGermanJaNein(entryData.me_doorHandle);
    currentEntry.mainEntrance.revolvingDoor = parseGermanJaNein(entryData.me_revolvingDoor);
    currentEntry.mainEntrance.hardToOpen = parseGermanJaNein(entryData.me_hardToOpen);
    currentEntry.mainEntrance.dangerPoints = entryData.me_dangerPoints;

    console.log("currentEntry",currentEntry);
    output.push(currentEntry);
    break;
  }

  fs.writeFileSync("out.json",JSON.stringify(output) );
})


input.pipe(parser);

