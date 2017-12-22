#! /bin/bash

# upper left : lower right
# mundo inteiro
# python generate_regions_geojson.py WRScornerPoints.csv regions.geojson 1 -178 -1 178
# torus
python generate_regions_geojson.py WRScornerPoints.csv regions.geojson 50 -178 -50 178
# brasil
# python generate_regions_geojson.py WRScornerPoints.csv regions.geojson 9 -79 -35 -30
# south america
# python generate_regions_geojson.py WRScornerPoints.csv regions.geojson 15 -83 -56 -30
mv regions.geojson ../public/regions/regions.geojson
