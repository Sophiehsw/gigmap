// Leaflet map setup
var map = L.map('map', {
  center: [28.295883, -9.135754],
  zoom: 1.5
});

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

/* =====================
setlist.fm api: c78418f6-21c9-4878-80bd-f28f32fbb934
songkick api: 2dleBwWTZC8F4EGh

functions:
1.search artist by name and get artist id
2.get past event and location
3.get future event by artist/venue/...
4.
===================== */
var songkick_api= '2dleBwWTZC8F4EGh';
var artistName;
var artistID;

var lat=[], lat2=[];
var lng=[], lng2=[];
var list=[], list2=[];

var searchArtist = function(artistName) {
     return $.ajax({
      type: "GET",
      url: "http://api.songkick.com/api/3.0/search/artists.json",
      data: {
        query: artistName,
        apikey: songkick_api
      }
    }).done(function(data){
      console.log(data);
      console.log(data.resultsPage.results.artist[0]["displayName"]);
      artistID = data.resultsPage.results.artist[0]["id"];
      console.log(artistID);
  });
};

//Ref: https://github.com/odelevingne/gigLister/blob/master/src/scripts/songkick.js
//https://github.com/xsaardo/Setlist-fm-Playlists/blob/master/search.js

//Issue: Pagination(how to get all pages)

//PAST EVENTS
var getPastVenues = function(artistID){
  $.ajax({
    type: "GET",
    url:"http://api.songkick.com/api/3.0/artists/" + artistID + "&page= "+ "/gigography.json",
    data: {
      query: artistID,
      page: 2,
      apikey: songkick_api
    }
  }).done(function(data){
    console.log(data);
    var dataReturn = data;
    console.log(dataReturn);

  _.map(dataReturn.resultsPage.results.event, function(venue){
      //return venue.location.lat;
      if(venue.location.lat !== null && venue.location.lng !== null){
        var marker = L.circleMarker({lat: venue.location.lat,lng: venue.location.lng} ,  {color: "#20604F"}).bindPopup(venue.location.city).addTo(map);
        lat.push(venue.location.lat);
        list.push(marker);
        lng.push(venue.location.lng);
      }
}) ;

console.log(lat,lng);

  });
};

//UPCOMING EVENTS
//1.Artist
var getUpcomingVenues = function(artistID){
  $.ajax({
    type: "GET",
    url:"http://api.songkick.com/api/3.0/artists/" + artistID + "&page= "+ "/calendar.json",
    data: {
      query: artistID,
      apikey: songkick_api
    }
  }).done(function(data){
    console.log(data);
    var dataReturn2 = data;
    console.log(dataReturn2);

  _.map(dataReturn2.resultsPage.results.event, function(venue){
      if(venue.location.lat !== null && venue.location.lng !== null){
        var marker2 = L.circleMarker({lat: venue.location.lat,lng: venue.location.lng} , {color: "#D0104C"}).bindPopup(venue.location.city).addTo(map);
        lat2.push(venue.location.lat);
        lng2.push(venue.location.lng);
        list2.push(marker2);
      }
});

console.log(lat2,lng2);

  });
};

//2.Venue

//past button
$("#past").click(function(e) {
  artistName= $('#artist-name').val();
  searchArtist(artistName).done(function(){
    getPastVenues(artistID);
  });
});

//upcoming button
$("#future").click(function(e) {
  artistName= $('#artist-name').val();
  searchArtist(artistName).done(function(){
    getUpcomingVenues(artistID);
  });
});

//clear button
$("#clear").click(function(e) {
  _.each(list,function(marker) {
    map.removeLayer(marker);
  });
  _.each(list2,function(marker) {
    map.removeLayer(marker);
  });

  $("#artist-name").val('');
});
