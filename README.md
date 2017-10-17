**** README ****

SAPS DASHBOARD

====== Entities ======

- Region

Desc: 
It represents on specific region on the map, delimited by a square on the grid. These informations are loaded from the saps file (/routes/saps_files/regions) and formated in a JSON (see it bellow).

Endpoin: /regions

Json Returned:
{
	id: unique id for this region
	name: name of the region
	coordinates: [
		[x,y],
		[x,y],
		[x,y],
		[x,y]
	],
	regionDetail: null
}

- RegionDetail

Desc: 
Detailed informations for a specific region. This search can return more than one region detail. These information are get from SAPS service api.

Endpoin: /regions?ids=[ids_lists]
Search format ids=id01,id02,id03,...,idn

Json Returned:
regionDetail: {
	"regionName":"",
	"totalImages":100,
	"processedImages":[processedImageObject]
}

processedImageObject:{
	"name":"img_01",
	"date":"2012-04-05",
	"outputs":[  
		{  
		"satelliteName":"L5",
		"preProcessingScrip":"pre-script01",
		"processingScrip":"script01",
		"link":"http://localhost:9080/images/img01"
		}
	]
	"totalImgBySatelitte":[
		{name:"L4", total:0}
	]
}

- Image

Json:
{
	date: date of this image.
	satellites:[Satellite obj] - List of satellites that have processed this image
}

- Satellite

Json:
{
	name: name of this satellite
	link: link to download the image processed by this satellite
}