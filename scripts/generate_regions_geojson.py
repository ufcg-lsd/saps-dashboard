import argparse
import json

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process some integers.')
    parser.add_argument(
        'input',
        metavar='I',
        type=str,
        help='input csv'
        )
    parser.add_argument(
        'output',
        metavar='O',
        type=str,
        help='output json'
        )
    parser.add_argument(
        'top_left_lat',
        metavar='TLLat',
        type=float,
        help='top left latitude'
        )
    parser.add_argument(
        'top_left_lon',
        metavar='TLLon',
        type=float,
        help='top left longitude'
        )
    parser.add_argument(
        'bottom_right_lat',
        metavar='BRLat',
        type=float,
        help='bottom right latitude'
        )
    parser.add_argument(
        'bottom_right_lon',
        metavar='BRLon',
        type=float,
        help='bottom right longitude'
        )

    args = parser.parse_args()

    right_limit = args.bottom_right_lat
    left_limit = args.top_left_lat
    top_limit = args.top_left_lon
    bottom_limit = args.bottom_right_lon

    csv = open(args.input, "r")
    geojson = open(args.output, "w")

    csv_lines = csv.readlines()
    header = csv_lines.pop(0).split(",")

    features = []
    for l in csv_lines:
        split_vals = l.split(",")
        # convert values to float
        path = int(split_vals[0])
        row = int(split_vals[1])
        center_lat = float(split_vals[2])
        center_lon = float(split_vals[3])
        ul_lat = float(split_vals[4])
        ul_lng = float(split_vals[5])
        ur_lat = float(split_vals[6])
        ur_lng = float(split_vals[7])
        ll_lat = float(split_vals[8])
        ll_lng = float(split_vals[9])
        lr_lat = float(split_vals[10])
        lr_lng = float(split_vals[11][0:-1])
        # removes tiles outside bounding box
        if not (right_limit < center_lat and center_lat < left_limit and top_limit < center_lon and center_lon < bottom_limit):
            continue
        # removes descending tiles
        if ur_lat < ll_lat:
            continue
        properties = {
            "regionId": (format(path, '03') + format(row, '03')),
            "regionName": (format(path, '03') + format(row, '03')),
            "UR": [ur_lng, ur_lat],
            "LL": [ll_lng, ll_lat]
        }
        geometry = {
            "type": "Polygon",
            "coordinates": [
                [
                    [ul_lng, ul_lat],
                    [ur_lng, ur_lat],
                    [lr_lng, lr_lat],
                    [ll_lng, ll_lat],
                    [ul_lng, ul_lat]
                ]
            ]
        }
        feature = {
            "type": "Feature",
            "id": properties["regionId"],
            "geometry": geometry,
            "properties": properties
        }
        features.append(feature)
    geo_obj = {
        "type": "FeatureCollection",
        "features": features
    }
    json.dump(geo_obj, geojson)
