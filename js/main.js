// Leaflet map setup
// var map = L.map('map', {
//   center: [28.295883, -9.135754],
//   zoom: 1.5
// });
//
// var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
//   attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//   subdomains: 'abcd',
//   minZoom: 0,
//   maxZoom: 20,
//   ext: 'png'
// }).addTo(map);

var tiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

var map = L.map('map',{
  center: [22.349052, 17.396109],
  zoom: 2
}).addLayer(tiles);
// .setView([22.349052, 17.396109], 2);
//ref: https://github.com/chriswhong/nyctaxi

/* =====================
setlist.fm api: c78418f6-21c9-4878-80bd-f28f32fbb934
songkick api: 2dleBwWTZC8F4EGh

functions:
1.search artist by name and get artist id
2.get past event and location
3.get future event by artist/venue/...
4.select by date and region
5.animation
===================== */
var songkick_api= '2dleBwWTZC8F4EGh';
var artistName,cityName,venueName;
var artistID, cityID,venueID;
var dataReturn;

var lat=[], lat2=[],lat3=[],lat4=[];
var lng=[], lng2=[],lng3=[],lng4=[];
var list=[], list2=[],list3=[],list4=[];


var searchArtist = function(artistName) {
     return $.ajax({
      type: "GET",
      url: "https://cors-anywhere.herokuapp.com/api.songkick.com/api/3.0/search/artists.json",
      data: {
        query: artistName,
        apikey: songkick_api
      }
    }).done(function(data){
      console.log(data);
      console.log(data.resultsPage.results.artist[0]["displayName"]);
      artistID = data.resultsPage.results.artist[0]["id"];
      $("#choice").text(data.resultsPage.results.artist[0]["displayName"]);
      console.log(artistID);
  });
};

//Ref: https://github.com/odelevingne/gigLister/blob/master/src/scripts/songkick.js
//https://github.com/xsaardo/Setlist-fm-Playlists/blob/master/search.js

//Issue: Pagination(how to get all pages)
//Suggestion: make loop for api call, change page, get number of page by divide total entries with 50(max per page)
//or other library..explore

var page =1;
var totalPage;

//PAST EVENTS
var gettotalPage = function(artistID){
  $.ajax({
  type: "GET",
  url:"https://cors-anywhere.herokuapp.com/api.songkick.com/api/3.0/artists/" + artistID + "/gigography.json",
  data: {
    query: artistID,
    // page: page,
    apikey: songkick_api
  }
}).done(function(data){
  //console.log(data);
  //console.log(page);
  totalPage = parseInt((data.resultsPage.totalEntries)/50);
  console.log(totalPage);
});
};

var getPastVenues = function(artistID){
  $.ajax({
    type: "GET",
    url:"https://cors-anywhere.herokuapp.com/api.songkick.com/api/3.0/artists/" + artistID + "&page=" + "/gigography.json",
    data: {
      query: artistID,
      page: page,
      apikey: songkick_api
    }
  }).done(function(data){
    //console.log(data);
    //console.log(page);
    if (totalPage > 1 && page < totalPage){
      page = page+1;
    getPastVenues(artistID,totalPage);
    console.log(page);
    }
    dataReturn = data;
    //console.log(dataReturn);

  _.map(dataReturn.resultsPage.results.event, function(venue){
      if(venue.location.lat !== null && venue.location.lng !== null){
        var marker = L.circleMarker({lat: venue.location.lat,lng: venue.location.lng} ,
          {color: "#A8D8B9", fillColor: "#A8D8B9"}
        ).bindPopup(venue.location.city + " " + venue.start.date).addTo(map);
        marker.setRadius(6);
        lat.push(venue.location.lat);
        lng.push(venue.location.lng);
        list.push(marker);
      }
}) ;

//console.log(lat,lng);

  });
};

// var getPast = function(artistID, totalPage){
//   if (totalPage > 1 && page < totalPage){
//     page = page+1;
//   getPastVenues();
//   console.log(page);
//   }
// };

//UPCOMING EVENTS
//1.Artist
var getUpcomingVenues = function(artistID){
  $.ajax({
    type: "GET",
    url:"https://cors-anywhere.herokuapp.com/api.songkick.com/api/3.0/artists/" + artistID + "&page= "+ "/calendar.json",
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
        var marker2 = L.circleMarker({lat: venue.location.lat,lng: venue.location.lng} ,
          {color: "#D0104C",fillColor: "#D0104C"}
        ).bindPopup(venue.location.city + " " + venue.start.date).addTo(map);   //url to songkick event page: venue.uri
        marker2.setRadius(6);
        lat2.push(venue.location.lat);
        lng2.push(venue.location.lng);
        list2.push(marker2);
      }
});

console.log(lat2,lng2);

  });
};

//2.city
//location search
var searchCity = function(cityName) {
     return $.ajax({
      type: "GET",
      url: "https://cors-anywhere.herokuapp.com/api.songkick.com/api/3.0/search/locations.json",
      data: {
        query: cityName,
        apikey: songkick_api
      }
    }).done(function(data){
      console.log(data);
      console.log(data.resultsPage.results.location[0]["metroArea"]["displayName"]);
      cityID = data.resultsPage.results.location[0]["metroArea"]["id"];
      $("#choice").text(data.resultsPage.results.location[0]["metroArea"]["displayName"]);
      console.log(cityID);
  });
};


//upcoming event search
var getCityevents = function(cityID){
  $.ajax({
    type: "GET",
    url:"https://cors-anywhere.herokuapp.com/api.songkick.com/api/3.0/metro_areas/" + cityID + "&page= "+ "/calendar.json",
    data: {
      query: cityID,
      apikey: songkick_api
    }
  }).done(function(data){
    console.log(data);
    var dataReturn3 = data;
    console.log(dataReturn3);

  _.map(dataReturn3.resultsPage.results.event, function(venue){
      if(venue.location.lat !== null && venue.location.lng !== null){
        var marker3 = L.circleMarker({lat: venue.location.lat,lng: venue.location.lng} , {color:"#E9CD4C", fillColor: "#E9CD4C"}).bindPopup(venue.displayName).addTo(map);
        marker3.setRadius(6);
        map.setView({lat: venue.location.lat,lng: venue.location.lng}, 12);
        lat3.push(venue.location.lat);
        lng3.push(venue.location.lng);
        list3.push(marker3);
      }
});
});
};

//3.venue
//venue search
var searchVenue = function(venueName) {
     return $.ajax({
      type: "GET",
      url: "https://cors-anywhere.herokuapp.com/api.songkick.com/api/3.0/search/venues.json",
      data: {
        query: venueName,
        apikey: songkick_api
      }
    }).done(function(data){
      console.log(data);
      console.log(data.resultsPage.results.venue[0]["displayName"]);
      venueID = data.resultsPage.results.venue[0]["id"];
      var venueMarker = L.circleMarker({lat: data.resultsPage.results.venue[0]["lat"],lng: data.resultsPage.results.venue[0]["lng"]} , {color:"#F05E1C",fillColor: "#F05E1C"}).bindPopup(data.resultsPage.results.venue[0]["displayName"]).addTo(map);
      map.setView({lat: data.resultsPage.results.venue[0]["lat"],lng: data.resultsPage.results.venue[0]["lng"]}, 14);
      list4.push(venueMarker);
      $("#choice").text(data.resultsPage.results.venue[0]["displayName"]);
      console.log(venueID);
  });
};

//upcoming event search
var getVenueevents = function(venueID){
  $.ajax({
    type: "GET",
    url:"https://cors-anywhere.herokuapp.com/api.songkick.com/api/3.0/venues/" + venueID + "&page= "+ "/calendar.json",
    data: {
      query: venueID,
      apikey: songkick_api
    }
  }).done(function(data){
    console.log(data);
    var dataReturn4 = data;
    console.log(dataReturn4);

  _.map(dataReturn4.resultsPage.results.event, function(venue){
      if(venue.venue.lat !== null && venue.venue.lng !== null){
        // var marker4 = L.circleMarker({lat: venue.venue.lat,lng: venue.venue.lng} , {color: "#D0104C"}).bindPopup(venue.performance.displayName).addTo(map);
        // lat4.push(venue.venue.lat);
        // lng4.push(venue.venue.lng);
        // list4.push(marker4);
      }
});
});
};


//past button
$("#past").click(function(e) {
  map.setView([22.349052, 17.396109], 2);
  artistName= $('#artist-name').val();
  searchArtist(artistName).done(function(){
    gettotalPage(artistID);
    getPastVenues(artistID);


});
});

//future button
$("#upcoming-artist").click(function(e) {
  map.setView([22.349052, 17.396109], 2);
  artistName= $('#artist-name').val();
  searchArtist(artistName).done(function(){
    getUpcomingVenues(artistID);
  });
});

//city button
$("#upcoming-city").click(function(e) {
  cityName= $('#city-name').val();
  searchCity(cityName).done(function(){
    getCityevents(cityID);
  });
});

//venue button
$("#upcoming-venue").click(function(e) {
  venueName= $('#venue-name').val();
  searchVenue(venueName).done(function(){
    getVenueevents(venueID);
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
  _.each(list3,function(marker) {
    map.removeLayer(marker);
  });

  _.each(list4,function(marker) {
    map.removeLayer(marker);
  });

  $("#artist-name").val('');
  $("#city-name").val('');
  $('#venue-name').val('');
  $("#choice").text("Welcome to Gig Map");
  map.setView([22.349052, 17.396109], 2);
});
