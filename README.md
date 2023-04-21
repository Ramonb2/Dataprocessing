#Dataprocessing


To run this you first need to run the node.js server and place this folder in xampp(or another webserver). Make sure Node.js is installed.
if you installed this open windows powershell or cmd and navigate to the server directory.
First to install all the required packages run the "npm update" command in the directory.
After everything is installed you can start the API with the command "npm start" 
When the API server is running you can go to http://localhost:3000/api-docs/ for documentation on all the differen end-points

The consuming application is written in PHP and Javascript. So to run this you have to put it on a webserver that runs php and phpmyadmin. Phpmyadmin is needed to create a database called apidatabase in which you need to import the included database file.

This api gives data on the relation between The consumption of alcohol, depression and wealth.
The application shows a bubble chart in whicht a the size of the bubble represents the depression,
the height of the bubble on the graph the GDP ranking in the world and the x-axis the amount of alcohol
consumption.

