# Leaflet Earthquake Visualization

## Overview

This project presents an interactive earthquake visualization built using **Leaflet.js** and **D3.js**, using real-time earthquake data from the **United States Geological Survey (USGS)**. The goal was to help the USGS display their data in a meaningful, engaging way to inform the public and stakeholders about seismic activity worldwide.

## Summary of Work Completed

- **Data Source**: Utilized GeoJSON data from the [USGS Earthquake Feed](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php), specifically the "All Earthquakes from the Past 7 Days" dataset.
  
- **Map Setup**: 
  - Created a base map using Leaflet’s `TileLayer`.
  - Integrated the earthquake data using D3 to fetch and parse the GeoJSON feed.

- **Earthquake Markers**:
  - Each earthquake is represented by a circle marker plotted by its **latitude and longitude**.
  - **Marker Size** is proportional to the earthquake’s **magnitude**.
  - **Marker Color** reflects the **depth** of the earthquake, with deeper quakes displayed in darker shades.

- **Interactive Features**:
  - **Popups** display additional information for each earthquake, including:
    - Magnitude
    - Location
    - Depth
  - A **legend** is included to show the color scale used for depth, helping users interpret the visualization easily.

## Technologies Used

- [Leaflet.js](https://leafletjs.com/)
- [D3.js](https://d3js.org/)
- [USGS GeoJSON Feed](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php)
- HTML, CSS, JavaScript

---
# Acknowledgements:

Special thanks to Dr. Carl Arrington for guidance during the Advanced Interactive Visualizations Using JavaScript, GeoJSON, and Leaflet lectures. Some snippets and logic were developed following in-class tutorial support and discussions.
