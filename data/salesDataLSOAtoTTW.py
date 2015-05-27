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
with open(files[2]) as data_file:     
    for x in data_file:
        data.append(x)
loadJSON = json.loads(x)

newDictTTW = {}
for key,value in loadJSON.items():  
    try:
        newDictTTW[LSOAtoTTW[key]].extend(value)
    except KeyError:
        newDictTTW[LSOAtoTTW[key]] = [value]
salesTTW = {}

for TTW, sales in newDictTTW.items():
    salesTTW[TTW] = sorted(sales)
    
with open(files[2].replace('LSOA', 'TTW'), 'w') as fp:
    json.dump(salesTTW, fp)