# MadBus

MadBus is a webApp to get information about public transportation in Madrid. Based on EMTs public API.
https://madbus.netlify.app/

## Description

The app let the user know the upcomming arrivals at a given bus stop at Madrid city. The functionalities includes:

- Retrieving information of future arrivals at a stop such as ETA, bus number, bus line and bus direction. It summarizes the arrivals by line and displays the results on a table and on a map. Once results are displayed the user has the option to update them.
- Look for stops insider a 1000 meter radius from users location, displays on the map and allows the user to select one and the displays the arrivals information of that stop
- Save favorites stops to access them later and display updated arrivals information

The app uses Madrid EMTs public API, at the moment it only retrieves information about local buses and has no information about interurban buses.  
https://mobilitylabs.emtmadrid.es/

## Project status

The app is no longer being developed for now. It was build as practice and to settled knowledge from learning Javascript. To make a better use of time I've decided to stalled this project in order to focus myself in developing others skills regarding Javascript, HMTL, CSS and coding in general.

## To-Do

### About the app

- Allow the user to look for stops on the map in other locations than its current position
- Include interurban stops and buses
- Include section about buses lines information
- Allow the user to search buses by line
- Display information about buses schedules

### About the style

- Favorites items could be impoved, specially the delete button
- Icons on the mapshould be changed to ones that does not have a transparent backgroud
- Font sizes should be normalized

### About the code

- Improve the navigation functionalities, currently are coded in a very unsophisticated way
- Enhance the code by simplifying complex functions,
- The map module is unorganized and the functions in it could be refactored, also svgs there could be placed on a customization module
- Simplify and organize CSS

## Known issues

- Rendering nearby stops at the map is not working properly when used on a mobile
- When loading the favorites section the spinner has a black line on it
- Sometimes getting the user location does not work correctly thus creating problems in general, this could be fixed by improving the way in which the app gets this information
