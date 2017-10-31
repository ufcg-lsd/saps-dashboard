#! /bin/bash

python generate_regions_json.py WRScornerPoints.csv regions.json 0 -75 -20 -32
mv regions.json ../public/regions/regions.json