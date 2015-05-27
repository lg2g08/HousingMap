##### go from LSOApay to TTWpay

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
with open(files[1]) as data_file:     
    for x in data_file:
        data.append(x)
loadJSON = json.loads(x)

newDictTTW = {}
for key,value in loadJSON.items():  
    newDictTTW[LSOAtoTTW[key]] = value
    
with open(files[1].replace('LSOA', 'TTW'), 'w') as fp:
    json.dump(newDictTTW, fp)