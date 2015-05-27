##### go from LSOA to TTW
import json
import glob
import csv


files = glob.glob('*.json')

targets = ["LSOApayDataByTTW", "LSOASalesByTTW", "TTWSalesData", "TTWPayData"]

for elt in targets:
    finalData = {}  
    for file in files:
        if elt in file:
            year = file[-9:-5]
            print year
            with open(file, 'rb') as data_file:     
                loadJSON = json.load(data_file)
            finalData[year] = loadJSON
    print finalData.keys()
    with open(elt + "all.json", 'w') as fp:
        json.dump(finalData, fp)