# js.p5.earthquakes_and_iis
Shows the position of earthquakes today and the current position of IIS.

API Key:
I get the map from Mapbox, you will need to create a free account and then take you API token and copy it into the map.js file where it says "<you mapbox key here>".

ISSUES:
 1 : Chrome is a little sensitive to CORS.. Whilst I understand the problem, I'm only concerned with getting the problem solved. I'll look at getting round the cor issue at a later date. I found it runs OK in Safari.
 2: The map is not 100% of the world.  Ther is some of the bottom missing.  There is something wrong with my lon/lat conversion to x/y but again, need more time to work it out. Seem to work fine when I draw the map at 1024/512 but moving to 1024/1024 it starts drawing items in the ocean - not ideal!
 3: There is volcano data in here too, but I've not done anything with it. exercise for others.
 4: not sure my splice is working on the IIS data, looking to have a trail of 5 pins but looks like it's not working as planned.
 
Sources of data: 
  earthquake: http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/<feed>
  update : every 10 mins.

Sample: Earthquake
 time,latitude,longitude,depth,mag,magType,nst,gap,dmin,rms,net,id,updated,place,type,horizontalError,depthError,magError,magNst,status,lo  cat…"
  1"2018-04-27T13:40:18.645Z,60.4201,-151.0844,37.7,1.2,ml,,,,0.36,ak,ak19288180,2018-04-27T13:47:13.895Z,\"7km S of Soldotna…"
  2"2018-04-27T13:24:47.340Z,35.9375,-117.6758333,2.13,1.37,ml,18,61,0.02312,0.14,ci,ci38159216,2018-04-27T13:28:20.368Z,\"21km E of Littl…"
  3"2018-04-27T13:21:18.158Z,64.3713,-149.7111,13.8,0.9,ml,,,,0.95,ak,ak19288164,2018-04-27T13:25:04.287Z,\"36km SW of North Nenana…"
  4"2018-04-27T13:04:57.220Z,33.3745,-116.2571667,6.75,0.83,ml,26,164,0.1708,0.2,ci,ci38159208,2018-04-27T13:08:41.339Z,\"17km NE of Borreg


  IIS:  http://api.open-notify.org/iss-now.json
  update: 60 seconds.
  Sample: IIS
  {timestamp: 1524838181, iss_position: {latitude: "-20.0038", longitude: "-173.7454"}, message: "success"}

  Volcano: https://data.humdata.org/dataset/a60ac839-920d-435a-bf7d-25855602699d/resource/e3b1ecf0-ec47-49f7-9011-6bbb7403ef6d/download/volcano.csv
  
  Sample: exercise for the reader.
