var tiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

var map = L.map('map',{
  center: [22.349052, 17.396109],
  zoom: 2,
  doubleClickZoom: true
}).addLayer(tiles);

var songkick_api= '2dleBwWTZC8F4EGh';
var artistName,cityName,venueName;
var artistID, cityID,venueID;
var dataReturn;

var list=[], list2=[],list3=[],list4=[];
var newLine,newLine2;
var forClear=[],forClear2=[],forClear3=[],forClear4=[];
var markerb, marker2b;

$('#alert').hide();

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
    if(data.resultsPage.totalEntries === 0 ||data.resultsPage.results.artist[0]["displayName"]==='私立恵比寿中学'){
      $('#alert').show();
    }
    else{
      console.log(data.resultsPage.results.artist[0]["displayName"]);
      artistID = data.resultsPage.results.artist[0]["id"];
      $("#choice").text("Showing results for: " + data.resultsPage.results.artist[0]["displayName"]);
      console.log(artistID);
    }
  });
};


var page =1;
var totalPage;

//PAST EVENTS
//pagination
var gettotalPage = function(artistID){
  $.ajax({
    type: "GET",
    url:"https://cors-anywhere.herokuapp.com/api.songkick.com/api/3.0/artists/" + artistID + "/gigography.json",
    data: {
      query: artistID,
      apikey: songkick_api
    }
  }).done(function(data){

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
    if (totalPage > 1 && page < totalPage){
      page = page+1;
      getPastVenues(artistID,totalPage);
      console.log(page);
    }
    dataReturn = data;
    console.log(dataReturn);
    _.map(dataReturn.resultsPage.results.event, function(venue){
      if(venue.location.lat !== null && venue.location.lng !== null){
        var marker = L.circleMarker({lat: venue.location.lat,lng: venue.location.lng} ,
          {color: "#A8D8B9", fillColor: "#A8D8B9",weight:2,fillOpacity:0.5}
        ).bindTooltip(venue.location.city + " " + venue.start.date).addTo(map);
        marker.setRadius(6);
        var latlng = [venue.location.lat,venue.location.lng];
        list.push(latlng);
        forClear.push(marker);//,newLine);

      }
    });
  });
};

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
    if(data.resultsPage.totalEntries === 0){
      $('#alert').show();
    }

    var dataReturn2 = data;
    console.log(dataReturn2);

    _.map(dataReturn2.resultsPage.results.event, function(venue){
      if(venue.location.lat !== null && venue.location.lng !== null){
        var marker2 = L.circleMarker({lat: venue.location.lat,lng: venue.location.lng} ,
          {color: "#D0104C",fillColor: "#D0104C", weight:2.5,fillOpacity:0.3}
        ).bindTooltip(venue.location.city + " " + venue.start.date).addTo(map);  //url to songkick event page: venue.uri
        var latlng2 = [venue.location.lat,venue.location.lng];
        console.log(latlng2);
        list2.push(latlng2);
        console.log(list2);
        marker2.setRadius(6);
        forClear2.push(marker2);

      }
    });
    newLine2 = L.polyline(list2, {color: "#D0104C", weight:1}).addTo(map);
    forClear2.push(newLine2);
    marker2b = L.circleMarker([0, 0], {color: "#FFB11B",fillColor: "#FFB11B",weight:2.5,fillOpacity:0.3}).bindTooltip(dataReturn2.resultsPage.results.event[0]["location"]["city"] + " " + dataReturn2.resultsPage.results.event[0]["start"]["date"]).addTo(map);
    marker2b.setLatLng(L.latLng(
        list2[0][0],  list2[0][1]));
forClear2.push(marker2b);

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
    $("#choice").text("Showing results for: " + data.resultsPage.results.location[0]["metroArea"]["displayName"]);
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
    if(data.resultsPage.totalEntries === 0){
      $('#alert').show();
    }
    var dataReturn3 = data;
    console.log(dataReturn3);

    _.map(dataReturn3.resultsPage.results.event, function(venue){
      if(venue.location.lat !== null && venue.location.lng !== null){
        var marker3 = L.circleMarker({lat: venue.location.lat,lng: venue.location.lng} , {color:"#E9CD4C", fillColor: "#E9CD4C"}).bindPopup(venue.displayName).addTo(map);
        marker3.setRadius(6);
        map.setView({lat: venue.location.lat,lng: venue.location.lng}, 12);
        var latlng3 = [venue.location.lat,venue.location.lng];
        console.log(latlng3);
        list3.push(latlng3);
        console.log(list3);
        forClear3.push(marker3);
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
    if(data.resultsPage.totalEntries === 0){
      $('#alert').show();
    }
    console.log(data.resultsPage.results.venue[0]["displayName"]);
    venueID = data.resultsPage.results.venue[0]["id"];
    var venueMarker = L.circleMarker({lat: data.resultsPage.results.venue[0]["lat"],lng: data.resultsPage.results.venue[0]["lng"]} , {color:"#F05E1C",fillColor: "#F05E1C"}).bindPopup(data.resultsPage.results.venue[0]["displayName"]).addTo(map);
    map.setView({lat: data.resultsPage.results.venue[0]["lat"],lng: data.resultsPage.results.venue[0]["lng"]}, 14);
    list4.push(venueMarker);
    $("#choice").text("Showing results for: " + data.resultsPage.results.venue[0]["displayName"]);
    console.log(venueID);
  });
};

// //upcoming event search
// var getVenueevents = function(venueID){
//   $.ajax({
//     type: "GET",
//     url:"https://cors-anywhere.herokuapp.com/api.songkick.com/api/3.0/venues/" + venueID + "&page= "+ "/calendar.json",
//     data: {
//       query: venueID,
//       apikey: songkick_api
//     }
//   }).done(function(data){
//     console.log(data);
//     var dataReturn4 = data;
//     console.log(dataReturn4);
//
//     var marker4 = L.circleMarker({lat: dataReturn4.resultsPage.results.event[0]["location"]["lat"],lng: dataReturn4.resultsPage.results.event[0]["location"]["lng"]} ,
//     {color: "#D0104C"}).bindPopup(dataReturn4.resultsPage.results.event[0]["displayName"]).addTo(map);
//     forClear4.push(marker4);
//   });
// };

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
  page=1;
  list =[];
  list2 =[];
  list3 =[];

  _.each(forClear,function(marker) {
    map.removeLayer(marker);
  });
  _.each(forClear2,function(marker,polyline) {
    map.removeLayer(marker,polyline);
  });

  _.each(forClear3,function(marker) {
    map.removeLayer(marker);
  });

  _.each(list4,function(marker) {
    map.removeLayer(marker);
  });

  $("#artist-name").val('');
  $("#city-name").val('');
  $('#venue-name').val('');
  $("#choice").text("Enjoy!");
  map.setView([22.349052, 17.396109], 2);
});
