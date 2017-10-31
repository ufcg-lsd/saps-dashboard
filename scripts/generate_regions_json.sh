#! /bin/bash

python generate_regions_json.py WRScornerPoints.csv regions.json 4.5 -46 -13.8 -30.7
mv regions.json ../public/regions/regions.json