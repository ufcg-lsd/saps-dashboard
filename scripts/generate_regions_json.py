import argparse

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
    json = open(args.output, "w")

    csv_lines = csv.readlines()
    header = csv_lines.pop(0).split(",")

    json.write("[\n")
    first = True
    for l in csv_lines:
        split_vals = l.split(",")
        # convert values to float
        center_lat = float(split_vals[2])
        center_lon = float(split_vals[3])
        ur_lat = float(split_vals[6])
        ll_lat = float(split_vals[8])
        # removes tiles outside bounding box
        if not (right_limit < center_lat and center_lat < left_limit and top_limit < center_lon and center_lon < bottom_limit):
            continue
        # removes descending tiles
        if ur_lat < ll_lat:
            continue
        if first:
            first = False
        else:
            json.write("    },\n")
        json.write("    {\n")
        json.write("        \"regionId\": \"" + format(int(split_vals[0]), '03') + format(int(split_vals[1]), '03') + "\",\n")
        json.write("        \"regionName\": \"" + format(int(split_vals[0]), '03') + format(int(split_vals[1]), '03') + "\",\n")
        json.write("        \"coordinates\": [\n")
        json.write("            [" + split_vals[5]+","+split_vals[4]+"],\n")
        json.write("            [" + split_vals[7]+","+split_vals[6]+"],\n")
        json.write("            [" + split_vals[11][0:-1]+","+split_vals[10]+"],\n")
        json.write("            [" + split_vals[9]+","+split_vals[8]+"]\n")
        json.write("        ]\n")
    if not first:
        json.write("    }\n")
    json.write("]\n")
