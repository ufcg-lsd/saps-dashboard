#! /bin/bash

# mundo inteiro
# python generate_regions_json.py WRScornerPoints.csv regions.json 100 -178 -100 178
# torus
# python generate_regions_json.py WRScornerPoints.csv regions.json 35 -178 -35 178
# brasil
# python generate_regions_json.py WRScornerPoints.csv regions.json 10 -83 -50 -30
# south america
python generate_regions_json.py WRScornerPoints.csv regions.json 15 -83 -56 -30
mv regions.json ../public/regions/regions.json