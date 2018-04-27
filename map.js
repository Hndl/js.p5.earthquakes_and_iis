 class BaseCamp {


 	mercX ( _longitude, _z ) {
		//console.log(`BaseCamp.mercX[${_longitude}, Z:${_z}]`);
		_longitude = this.convertToRadians(_longitude);
		//console.log(`BaseCamp.mercX[RAD${_longitude}]`);
		var a = (256 / PI ) * pow ( 2, _z ) ;
		//console.log(`mercY: a: ${a}`);
		var b = _longitude + PI;
		//console.log(`mercY: b: ${b}`);
		return ( a * b);
			
	}

	//TODO calc is long winded but need to debug it same for mercX
	mercY ( _latitude , _z ){
		//console.log(`BaseCamp.mercY[${_latitude}, Z:${_z}]`);
		_latitude = this.convertToRadians( _latitude );		
		//console.log(`BaseCamp.mercY[RAD${_latitude}]`);		
		var a = (256/*256*/ / PI ) * pow ( 2 , _z ) ;
		//console.log(`mercY: a: ${a}`);
		var b = tan(PI / 4 + _latitude / 2);
		//console.log(`mercY: b: ${b}`);
		var c = PI - log(b);
		//console.log(`mercY: c: ${c}`);
		return ( a * c );
	}

	convertToRadians( _d ) {
		return ( radians(_d));
	} 

 }


 class MapboxMap extends BaseCamp{
	
	constructor (_centreLatitude, _centreLongitude,_width, _height, _zoom, _mType){
		super();
		//console.log(`long:${_centreLongitude} lat:${_centreLatitude}`);
		this.cx = super.mercX(_centreLongitude, _zoom); //use the super class version as it doesnt subtract current pos, ditto fot cy
		this.cy = super.mercY(_centreLatitude, _zoom);
		//console.log(`cx:${this.cx} cy:${this.cy}`);
		this.centralLatitude 	= _centreLatitude;
		this.centreLongitude 	= _centreLongitude;
		this.zoom 				= _zoom;
		this.mapType 			= _mType || 'dark-v9';
		this.mapWidth			= _width || 1024;
		this.mapHeight 			= _height|| 512 ; 
		this.accessToken 		= 'pk.eyJ1IjoiY2J1cnkiLCJhIjoiY2pnYXRybXc0MXMyNTJ3cWp6aXQ5b25xOCJ9.ZEXmvDyWCLI9qlF-5BmODg';
		this.cachedMap 			= undefined;
		this.templateURI 		= `https://api.mapbox.com/styles/v1/mapbox/${this.mapType}/static/${this.centreLongitude},${this.centralLatitude},${this.zoom}/${this.mapWidth}x${this.mapHeight}/?access_token=${this.accessToken}`;
	}

	fetch(){
		  //console.log(`fetching map image: url${this.templateURI}`);
		  this.cachedMap = loadImage(this.templateURI);
		  //console.log( this.cachedMap);
		  //console.log(`Mapbox map ${this.cachedMap != undefined?'has been cached':'not cached'}`);
		  return this.cachedMap;
	}

	getCachedMap() {
		if ( this.cachedMap){ 
			//console.log('getting the map');
			return this.cachedMap;
		}
		//console.log('re-fetching the map');
		return ( this.fetch() );
	}


	mercX ( _longitude ) {
		//console.log(`Mapbox.mercX[${_longitude}]`);
		var a = super.mercX( _longitude, this.zoom );
		//console.log(`Mapbox.mercX: a: ${a} cx:${this.cx}` );
		var b = a - this.cx ;
		//console.log(`Mapbox.mercX: b: ${b}`);
		return (b);	
	}

	mercY ( _latitude ){
		//console.log(`Mapbox.mercY[${_latitude}]`);
		return ( super.mercY( _latitude , this.zoom) - this.cy );
	}

	
	getObj( _obj, _idx ){
		//console.log(`getObj(${_obj}, ${_idx}) started`);
		var lat = _obj.getLatitude(_idx);
		//console.log(`getObj(${_obj}, ${_idx}) lat`);
    	var lon = _obj.getLongitude(_idx);
    	//console.log(`getObj(${_obj}, ${_idx}) lon`);
    	var x = this.mercX(lon);
		var y = this.mercY(lat);
  		var tX = super.mercX(lon); // get the x,y without the subtraction.
		var tY = super.mercY(lat);
   		//console.log(`getObj(${_obj}, ${_idx})-completed`);
 		return (
 				{
 					"zoom":this.zoom,
 					"latitude":lat,
 					"longitude":lon,
 					"trueY":tY,
 					"trueX":tX,
 					"x":floor(x),
 					"y":floor(y)
 				}
 			);
 	}
}


 class SatPins extends BaseCamp {
 	constructor () {
 		super();
 		this.pins = [];
 		this.MAXPOS = 5;
 	}

 	add ( _data ) {
 		//console.log(_data);
 		//console.log(this.pins.length);

 		if ( this.pins.length > this.MAXPOS){
 			this.pins.splice[0,1];//remove the first
 		}
 		this.pins.push(_data);
 	}

 	getPin (_idx){
 		return ( this.pins[_idx]);
 	}

 	len (){
 		return ( this.pins.length );
 	}

 	getLatitude(_i) {
 		//console.log(`satpins:${JSON.stringify(this.pins[_i])}`);
		return ( this.pins[_i].iss_position.latitude);
	}

	getLongitude(_i) {
		return ( this.pins[_i].iss_position.longitude);
	}
 }


class PinData extends BaseCamp {
	constructor ( _uri, _splitter ) {
		//console.log('PinData - started');
		super();
		this.uri 	= _uri;
		this.delim	= _splitter;
		this.uriData= loadStrings( _uri );
		this.l = this.uriData.length;
		//console.log(`PinData - completed [${this.l}]`);
	}
	fetch () {
		console.log(`fetching:${this.uri}`);
		//loadStrings( this._uri, function (data) {
		//	console.log('eQuake data refreshed');
		//	this.uriData = data;
		//}); //async call! 
 	}
	len () {
		//console.log(`${this.uriData.length}=PinData.length()`);
		return ( this.uriData.length);
	}

	getData ( _i, _fN ){
		var data = this.uriData[_i].split(this.delim);
		return ( data[ _fN ]);
	}
}

class EarthquakePins extends PinData {
	constructor ( _uri, _splitter ) {
		//console.log('EarthquakePins - started');
		super(_uri, _splitter);
		//console.log('EarthquakePins - completed');
	}
	getLatitude(_i) {
		return ( this.getData ( _i, 1));
	}
	getLongitude(_i) {
		return ( this.getData ( _i, 2));
	}
	getMagnitude( _i){
		return ( this.getData ( _i, 4));
	}
	getPinRadius( _mag ){
		var mag = pow(10,_mag);
			mag = sqrt(mag);
		var magMax = sqrt(pow(10,10));
		var d = map(mag, 0,magMax,2,180);	
		return ( floor(d) );
	}
}

class VolcanoPins extends PinData {
	constructor ( _uri, _splitter ) {
		//console.log('EarthquakePins - started');
		super(_uri, _splitter);
		//console.log('EarthquakePins - completed');
	}
	getLatitude(_i) {
		return ( this.getData ( _i, 5));
	}
	getLongitude(_i) {
		return ( this.getData ( _i, 6));
	}
	getName( _i){
		return ( this.getData ( _i, 1));
	}
	getPlace( _i){
		return ( this.getData ( _i, 2));
	}
	getHaz( _i){
		return ( this.getData ( _i, 9));
	}
}