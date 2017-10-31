#! /bin/bash

python generate_regions_json.py WRScornerPoints.csv regions.json 5 -75 -25 -32
mv regions.json ../public/regions/regions.json