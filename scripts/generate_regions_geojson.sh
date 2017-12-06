#! /bin/bash

# upper left : lower right
# mundo inteiro
# python generate_regions_json.py WRScornerPoints.csv regions.json 1 -178 -1 178
# torus
# python generate_regions_geojson.py WRScornerPoints.csv regions.geojson 35 -178 -35 178
# brasil
# python generate_regions_json.py WRScornerPoints.csv regions.json 9 -79 -35 -30
# nordeste
python generate_regions_geojson.py WRScornerPoints.csv regions.geojson 9 -40 -35 -30
# south america
# python generate_regions_json.py WRScornerPoints.csv regions.json 15 -83 -56 -30
mv regions.geojson ../public/regions/regions.geojson

# mapa segmentado
# python generate_regions_json.py WRScornerPoints.csv regions00.json -10 -180 -50 -90
# mv regions00.json ../public/regions/regions00.json
# python generate_regions_json.py WRScornerPoints.csv regions01.json 10 -180 -35 -90
# mv regions01.json ../public/regions/regions01.json
# python generate_regions_json.py WRScornerPoints.csv regions02.json 25 -180 -20 -90
# mv regions02.json ../public/regions/regions02.json
# python generate_regions_json.py WRScornerPoints.csv regions03.json 35 -180 -5 -90
# mv regions03.json ../public/regions/regions03.json
# python generate_regions_json.py WRScornerPoints.csv regions04.json 50 -180 10 -90
# mv regions04.json ../public/regions/regions04.json

# python generate_regions_json.py WRScornerPoints.csv regions10.json -10 -135 -50 -45
# mv regions10.json ../public/regions/regions10.json
# python generate_regions_json.py WRScornerPoints.csv regions11.json 10 -135 -35 -45
# mv regions11.json ../public/regions/regions11.json
# python generate_regions_json.py WRScornerPoints.csv regions12.json 25 -135 -20 -45
# mv regions12.json ../public/regions/regions12.json
# python generate_regions_json.py WRScornerPoints.csv regions13.json 35 -135 -5 -45
# mv regions13.json ../public/regions/regions13.json
# python generate_regions_json.py WRScornerPoints.csv regions14.json 50 -135 10 -45
# mv regions14.json ../public/regions/regions14.json

# python generate_regions_json.py WRScornerPoints.csv regions20.json -10 -90 -50 0
# mv regions20.json ../public/regions/regions20.json
# python generate_regions_json.py WRScornerPoints.csv regions21.json 10 -90 -35 0
# mv regions21.json ../public/regions/regions21.json
# python generate_regions_json.py WRScornerPoints.csv regions22.json 25 -90 -20 0
# mv regions22.json ../public/regions/regions22.json
# python generate_regions_json.py WRScornerPoints.csv regions23.json 35 -90 -5 0
# mv regions23.json ../public/regions/regions23.json
# python generate_regions_json.py WRScornerPoints.csv regions24.json 50 -90 10 0
# mv regions24.json ../public/regions/regions24.json

# python generate_regions_json.py WRScornerPoints.csv regions30.json -10 -45 -50 45
# mv regions30.json ../public/regions/regions30.json
# python generate_regions_json.py WRScornerPoints.csv regions31.json 10 -45 -35 45
# mv regions31.json ../public/regions/regions31.json
# python generate_regions_json.py WRScornerPoints.csv regions32.json 25 -45 -20 45
# mv regions32.json ../public/regions/regions32.json
# python generate_regions_json.py WRScornerPoints.csv regions33.json 35 -45 -5 45
# mv regions33.json ../public/regions/regions33.json
# python generate_regions_json.py WRScornerPoints.csv regions34.json 50 -45 10 45
# mv regions34.json ../public/regions/regions34.json

# python generate_regions_json.py WRScornerPoints.csv regions40.json -10 0 -50 90
# mv regions40.json ../public/regions/regions40.json
# python generate_regions_json.py WRScornerPoints.csv regions41.json 10 0 -35 90
# mv regions41.json ../public/regions/regions41.json
# python generate_regions_json.py WRScornerPoints.csv regions42.json 25 0 -20 90
# mv regions42.json ../public/regions/regions42.json
# python generate_regions_json.py WRScornerPoints.csv regions43.json 35 0 -5 90
# mv regions43.json ../public/regions/regions43.json
# python generate_regions_json.py WRScornerPoints.csv regions44.json 50 0 10 90
# mv regions44.json ../public/regions/regions44.json

# python generate_regions_json.py WRScornerPoints.csv regions50.json -10 45 -50 135
# mv regions50.json ../public/regions/regions50.json
# python generate_regions_json.py WRScornerPoints.csv regions51.json 10 45 -35 135
# mv regions51.json ../public/regions/regions51.json
# python generate_regions_json.py WRScornerPoints.csv regions52.json 25 45 -20 135
# mv regions52.json ../public/regions/regions52.json
# python generate_regions_json.py WRScornerPoints.csv regions53.json 35 45 -5 135
# mv regions53.json ../public/regions/regions53.json
# python generate_regions_json.py WRScornerPoints.csv regions54.json 50 45 10 135
# mv regions54.json ../public/regions/regions54.json

# python generate_regions_json.py WRScornerPoints.csv regions60.json -10 90 -50 180
# mv regions60.json ../public/regions/regions60.json
# python generate_regions_json.py WRScornerPoints.csv regions61.json 10 90 -35 180
# mv regions61.json ../public/regions/regions61.json
# python generate_regions_json.py WRScornerPoints.csv regions62.json 25 90 -20 180
# mv regions62.json ../public/regions/regions62.json
# python generate_regions_json.py WRScornerPoints.csv regions63.json 35 90 -5 180
# mv regions63.json ../public/regions/regions63.json
# python generate_regions_json.py WRScornerPoints.csv regions64.json 50 90 10 180
# mv regions64.json ../public/regions/regions64.json