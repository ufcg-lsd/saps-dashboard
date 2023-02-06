#! /bin/bash

# upper left : lower right

# World
# python generate_regions_geojson.py WRScornerPoints.csv regions.geojson 81 -178 -57 178
# mv regions.geojson ../public/regions/regions.geojson

# torus
# python generate_regions_geojson.py WRScornerPoints.csv regions.geojson 50 -178 -50 178
# mv regions.geojson ../public/regions/regions.geojson

# EUR-Africa
python generate_regions_geojson.py WRScornerPoints.csv eur-africa.geojson 60 -17 -35 50
mv eur-africa.geojson ../public/regions/eur-africa.geojson

# Oceania
python generate_regions_geojson.py WRScornerPoints.csv oceania.geojson 1 95 -50 178
mv oceania.geojson ../public/regions/oceania.geojson

# Asia
python generate_regions_geojson.py WRScornerPoints.csv asia.geojson 60 50 1 178
mv asia.geojson ../public/regions/asia.geojson

# North America 
python generate_regions_geojson.py WRScornerPoints.csv northAmerica.geojson 60 -178 9 -52
mv northAmerica.geojson ../public/regions/northAmerica.geojson

# South america 
python generate_regions_geojson.py WRScornerPoints.csv southAmerica.geojson 9 -86 -56 -30
mv southAmerica.geojson ../public/regions/southAmerica.geojson
