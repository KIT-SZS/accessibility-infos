Accessibility-infos
===================

 Data and UI to display **accessibility informations** for the **KIT Campus south and Campus west**
(in Karlsruhe, Germany) in an **accessible way** .

It was tested with screen readers, magnifiers etc

You can access the resulting webpage [here](http://kit-szs.github.io/accessibility-infos/infos.html)


What is this ?
==============

This repository contains a few different things:
- accessibility data for the KIT Campus south for people 
  - who are blind/ have vision impairment
  - who are deaf/  have hearing impairment
  - wo are using wheelchairs/ have mobility impairment

  This data can be found in...the "data" directory as ods/xlsx files

- tools: parser/exporter from our original ods/xlsx files to .json
  * uses node.js

- user interface/web page:
  * built using Polymer.js based custom element(s)


Who are we?
===========

This project was developped for/by [the Representative for Students with Disabilities and chronic Diseases](https://www.studiumundbehinderung.kit.edu/index.php),
supported by the   [Study Centre for the Visually Impaired Students](http://www.szs.kit.edu/english/)
in Karlsruhe, Germany.


A word on data structures:
==========================

  - all the data displayed in the user interface is in **json format**
  - to get the building/ room information in json format , use the 
  included "parser" (see below)
  - the json data structures are in english for future export possibilities to OSM etc
  - to make some of the field mapping (from xlsx to json), the translated field names etc more 
accessible to non coder, there are a few configurable json files which are used by the parser and 
the user interface:


    Server side/parser:
    -------------------
    * **parser/deEn_tableFields.json**        : maps **xlsx ,german** field names  to **english** field names
    * **parser/rooms_structureMap.json**      : maps **(internal) rooms structure** fields to output json fields
    * **parser/rooms_schema.json**            : defines **the schema** of the actual json structure for ROOMS **loaded by the user interface**
    * **parser/buildings_structureMap.json**  : maps **(internal) building structure** fields to output json fields 
    * **parser/buildings_schema.json**        : defines **the schema** of the actual json structure for BUILDINGS **loaded by the user interface**

    Client side:
    ------------
    * **locales/de-DE/translation-de-DE.json**: defines the **translations** of the field names to German (our current target)
    * **data/filters.json**: defines **what fields to show/hide** in the user interface, for rooms and builds (based on disability type/level)



The software:
==========

  This is only needed for developpers, or to regenerate the json "database files".


 Prerequisites:
 -------------------

  - node.js



Short version of updating json data & publishing it:
====================================================

  just type:




          node publish.js


If you are a developper,  please follow the guidelines in the next section


Long version : Developping/using the scripts etc:
========================


 Parser xlsx to json etc (Node.js/server side)
----------------------------


   **Installation**
   ---------------------


        npm install


   **Usage:**
 ---------------------
   

  Assuming you are at the project's root directory

          node parser/parser.js

  This will generate these output files in the current folder

          rooms.json
          roomsByBuilding.json
          buildings.json
          

   In order for the user interface to display these files,
      just copy them to the **data** folder
    
  

Developing the user interface 
-----------------------------------------

- use any web server to serve the files at the root directory
of this repo

- for example a good, simple choice is [http-server](https://www.npmjs.org/package/http-server)

         http-server .

- navigate to localhost:8080 in your web browser 



concatenating the user interface + its components
------------------------------------------------------------------------


**Installation:**
 -------------

        bower install


**Generate a single output file:**
 ------------------------------

  - First, you need to install : [the vulcanize tool](https://github.com/polymer/vulcanize)


               npm install -g vulcanize

  
  - then run


              vulcanize --inline --output infos.html index.html 


Publish to github pages:
------------------------

 - commit all your changes
 - Switch to gh-pages branch:


              git checkout gh-pages

 - Rebase from master branch
    
              git rebase master

 - Push the new version

              git push origin gh-pages


 - Go back to master

              git checkout master
        


Q&A
===

- Q: Why is there no server side component/  real database etc

 A: No budget.time for that , sadly , but it proves that a purely client side application is feaseable
when dealing with reasonable amounts of data.
The initial plan was to integrated the accessibility data into existing KIT databases , but apparently
none was available with public access/ apis.

- Q: Why not use OpenStreetMap to store some of the data:

 A: Time and logic constraints: a lot of the available information pertains
to the accessibility of rooms, and as there is no consensus yet on how to 
store room/ building inner informations in OSM, this will be a project for the future.

- Q: There are some bugs in the code/issues

 A: Please add an issue to the issue tracker


Notes:
====== 

known issues:
-------------
 - No international versions, German text only for now , sorry !
 - There are some main menu (only used to filter data) issues
under some version of Firefox which should be fixed soon
 - Keyboard navigation is working but might need to be improved

Used libraries:
----------------
  - Internationalization was done with the great [i18next library](http://i18next.com/) (a bit underused in our case.. for now :)
  - The [Polymer project](https://www.polymer-project.org/) is a fantastic set of polyfills, tools, and components to develop custom web components
today : the project would not have been possible in such a short time without it
  - The Polymer Ui elements have a lot of thought put into them to make them accessible , and have worked very nicely with screen readers etc out of the box big kudos to the Polymer team !
  See [here](https://github.com/Polymer/paper-button/issues/23) for example


Browser Compatiblity
------------------------------

 - Tested in Chrome and Firefox under Windows and Linux
 - *Might* work in Internet Explorer
 - Limited to evergreen browsers, see the [Polymer browser compatibility page](https://www.polymer-project.org/resources/compatibility.html)  






LICENSE:
========

MIT, see license file
