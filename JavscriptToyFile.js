/// PLAYING AROUND WITH JSON FILES IN NODE.JS


process.chdir('E:/Nquiringminds/HousingMap/data');

/// CREATE A FUNCTION THAT CALCULATES DEFICIENCY

var fs = require('fs');
var oLSOAarea = JSON.parse(fs.readFileSync('LSOA.json', 'utf8'));
var oLookUps = JSON.parse(fs.readFileSync('TTWtoLSOAlookup.json', 'utf8'));

var id =  '105';

function GetByValue(arr, value){
    for (var i=0, iLen=arr.length; i<iLen; i++) {  
        if(arr[i].properties.LSOA11CD == value) return arr[i];
  }
};

var oGeo = [];
for (var k = 0; k < Object.keys(oLookUps[id]).length; k++) {
    var arr = oLSOAarea.objects.LSOA.geometries;
    var value = oLookUps[id][k];
    oGeo.push(GetByValue(arr, value));
};
