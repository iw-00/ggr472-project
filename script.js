/*---------------------------
INITIALIZE MAP
---------------------------*/

mapboxgl.accessToken = "pk.eyJ1Ijoic3RhbmZvcmRjaGFuZyIsImEiOiJjbTVvZHBxOHUwa3p2Mmxwbm90N2I0MzZqIn0.JfQLnEhITEAZl2kHoQP7rA"; // Mapbox access token
// mapboxgl.accessToken = "pk.eyJ1IjoiaXcwMCIsImEiOiJjbTV2aXFlajYwMjZmMmtvbWtrMGRhd3lkIn0.DbEVxhgWv4ANYwpIpCc4iA";

// Create map
const map = new mapboxgl.Map({
    container: 'map',
    projection: 'mercator',
    style: "mapbox://styles/stanfordchang/cm8gipc43015j01s52jfo9p21", // custom style URL
    // style: "mapbox://styles/iw00/cm7v16zql01tr01qo6qk93q42",
    center: [2.340180, 26.389773], // starting location
    zoom: 1.8 // starting zoom level
});

/*---------------------------
MAP CONTROLS
---------------------------*/

// Add navigation and fullscreen controls
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());

// Create geocoder as a variable
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
});

// Append geocoder variable to geocoder HTML div to position on page
document.getElementById("geocoder").appendChild(geocoder.onAdd(map));

/*---------------------------
VISUALIZE DATA
---------------------------*/
map.on("load", () => {

  // Add source for show data
  map.addSource("show-data", {
      type: "geojson",
      data: "https://raw.githubusercontent.com/iw-00/ggr472-project/refs/heads/main/data/shows.geojson"
  });

  // Add stadium points to map
  map.addLayer({
        id: "show-pts",
        type: "circle",
        source: "show-data",
        paint: {
            "circle-radius": 4,
            "circle-color": "#ff0000"
        }
    });
});

/*---------------------------
BUTTON: RETURN TO FULL EXTENT
-----------------------------*/

// Add function to the return button with jumpTo, bringing us back to our original zoom and center point
document.getElementById('returnbutton').addEventListener('click', () => {
    map.jumpTo({
      center: [2.340180, 26.389773],
      zoom: 1.8, // Reset to original zoom
      pitch: 0, // Reset to original pitch
      bearing: 0, // Reset to original rotation
      essential: true
    });
});

/*---------------------------
MOUSE EVENTS
-----------------------------*/

// When mouse enters a point
map.on("mouseenter", "show-pts", () => {
  map.getCanvas().style.cursor = "pointer"; // Switch cursor to pointer
});

// When mouse leaves a point
map.on("mouseleave", "show-pts", () => {
  map.getCanvas().style.cursor = ""; // Switch pointer to cursor

});

// When mouse clicks a point
map.on("click", "show-pts", (e) => {
  const coordinates = [e.features[0].properties.lng, e.features[0].properties.lat] // Retrieve coordinates of point

  // Move camera to clicked point
  map.flyTo({
    center: coordinates,
  });

  const buttonID = e.features[0].id // Retrieve ID of point for popup button

  const description = `
    <div>
      <h5>${e.features[0].properties.city}, ${e.features[0].properties.country}</h5>
      <p>${e.features[0].properties.dates}</p>
      <button type="button" class="btn btn-outline-info" id="${buttonID}">Go to ${e.features[0].properties.venue}</button>
    </div>
  `;

  // Create and show popup
  new mapboxgl.Popup() // Declare new popup object on each click
    .setLngLat(coordinates) // Set popup location to point location
    .setHTML(description)
    .addTo(map); // Show popup on map

  // Attach an event listener after the popup is added to the map
  setTimeout(() => {
  const stadiumbtn = document.getElementById(buttonID);
  if (stadiumbtn) {
    stadiumbtn.addEventListener("click", () => {
      // Jump to the stadium
      map.jumpTo({
        center: coordinates,
        zoom: 16.7,
        pitch: 60
      });
    });
  }
  }, 0);

});