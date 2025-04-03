# GGR472 Group Project: The Eras Map

 Code and data for GGR472 Project. Developing a functioning, interactive web map with secondary data.

## Objective

Creating an interactive, immersive web map that allows the user to explore different features of the Eras Tour.

## Description

World map showing venues of the Eras Tour as points. Venue and show data is consolidated from the [Eras Tour Wikipedia page](https://en.wikipedia.org/wiki/The_Eras_Tour) and social media.

Features include: 

* Pop-ups on click showing city name, dates of shows, and "Go to" button to view 3D visualization of venue.
* 3D visualization of venue accompanied by sidebar to display show information.
* Dropdown to filter venues by opening act.
* Searchable dropdown to filter venues by surprise song.
* Buttons to zoom to major tour regions.

## Repository Contents

`data/shows.geojson`: Data file containing point locations of concert cenues from the Eras Tour. Properties include venue name, city, country, show dates, opening acts, number of shows, surprise songs, and Instagram links.

`index.html`: HTML file to render the map, map elements, and interface components (e.g., buttons, dropdowns).

`style.css`: CSS file for positioning the map interface and adding styling for map elements (e.g., description, legend, buttons).

`script.js`: JavaScript file that creates, visualizes, and adds interactivity to map and map elements. 