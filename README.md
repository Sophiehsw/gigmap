# Worldwide Tour Map
Final project submission for MUSA 611: Javascript Programming and MUSA 620: Data Wrangling and Data Visualization  
#### 
Created by Yue Guo (Penn Design 17')
#### 
visit site at: https://amandayg.github.io/gigmap/

## Features
This interactive web application is a handy tool for users to search for the tour history and upcoming events of the artists they are interested in. The app has a side bar on the left and a map on the right. The app is able to map out the past tour locations, the upcoming events, as well as the route of the upcoming tour in animation. Each event is plotted as a circle marker on the map, and shows location and date when mouse hovers on the marker. A dismissable alert will pop up if no entry is returned from the user input. There is also a "clear search" button at the end of the sidebar to reset the search and start again. Users can also search for upcoming events by city, and locate the venue on the map.

## Data and tools
#### Songkick API 
This project made extensive uses of Songkick APIs, the APIs used are listed below
- Search: Artist search, Venue search, Location and metro area search
- Calendars: Artist's calendar, Metro area's calendar
- Gigography: Artist’s gigography

#### Javascript Libraries and tools used 
- Bootstrap
- jQuery 
- Leaflet
- Underscore.js 

## Method
### Data Collection
#### Artist
First, I used Artist-search API to get the ID of the musician or band input by user. Then I used the artist ID and the gigography API to get the past tour locations of the artist. Since the maximum return per page is 50 entries and most artists had toured more than 50 places in the past, I used functions to get the total past concerts and total page I needed for the artists and stored them in a list to add markers to the map. Usually artists do not have more than 50 upcoming events so I did not used the function for upcoming event search.

#### City and venue
Similar to artist gigography and calendar, metro area calendar API also requires the metro area's ID. So I first used the Location and metro area search API to get the city ID and then use metro area calendar API to get the upcoming events for the city. Since I did not intend to get upcoming events from a venue, I mapped the venue directly on map with venue search API and user input.

### Data Visualization 
This app used JavaScript, Leaflet, HTML&CSS to visualize the past and upcoming concerts of musician and bands.
####
I used light green color for the markers for past tours and rosy red for upcoming tours. User can move the mouse to each marker to see the name of the location and the date the musician toured the location. For upcoming tours, I also generated lines between one location and the next one and visualized the route of the upcoming tour in animation. (I chose not to animate past tours for there were too many records and the animation looked messy.) The moving marker was larger and colored in orange.
####
For city and venue search, the map will automatically zoom to the location requrested. I colored the upcoming events in the city that user search for in yellow and the venue in orange. User can click on the marker to see the artist and date of the upcoming events for city and the venue name for veue locate function.
