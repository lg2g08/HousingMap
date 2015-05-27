##### go from LSOA to TTW

import json
import glob
import csv

files = glob.glob('*.json')

LSOAtoTTW = {}

with open("E:\Nquiringminds\hampshire\LSOA01_TTWA07_UK_LU.csv", 'rb') as infile9:
    reader9 = csv.reader(infile9)
    header9 = reader9.next()
    for x in reader9:
        LSOAtoTTW[x[0]] = x[2]          

data = [] 
with open(files[3]) as data_file:     
    for x in data_file:
        data.append(x)
loadJSON = json.loads(x)

newDictTTW = {}
for key,value in loadJSON.items():  
    try:
        newDictTTW[LSOAtoTTW[key]]['one'] += value['one']
        newDictTTW[LSOAtoTTW[key]]['two'] += value['two']
        newDictTTW[LSOAtoTTW[key]]['three'] += value['three']
        newDictTTW[LSOAtoTTW[key]]['four'] += value['four']
        newDictTTW[LSOAtoTTW[key]]['more'] += value['more']        
    except KeyError:
        newDictTTW[LSOAtoTTW[key]] = value
        
with open(files[3].replace('LSOA', 'TTW'), 'w') as fp:
    json.dump(newDictTTW, fp)