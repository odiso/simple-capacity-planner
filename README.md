# Simple Capacity Planner

A web app rendering a simple capacity planner, with graphs and multiple dashboards.

Main page is a condensed version of all monitored components for a quick look.

## usage 


The interface is regrouped in ```dashboards``` tabs, letting you organise your monitoring.
- The Main dashboard displays a summary of all monitored things.

![Main dashboard](http://imageshack.com/a/img905/3006/HQuEH1.jpg "Main dashboard")

On each dashboards, you can add ```components```. Components are main blocks, having a dedicated Warning and Critical Threshold.

![Component example](http://imageshack.com/a/img911/9926/Gs7qzQ.png "Component example")

Each components possesses ```elements```, which are single sources of capacity to monitor. Each element have a current capacity and a max capacity.

The capacity planner works monthly, which means each element can have a monthly current capacity value. This is an ```indicator```.

Then you can visualize the evolution on graphs :

![Simple graph](http://imageshack.com/a/img538/8730/Ms4ekO.png "Simple graph")



## installation

You will need a simple web server to run the PHP 5.5 backend and the MySQL database.

 - The ```src/``` folder is the root of the web app source code. 
 - Edit ```src/backend/config.php``` for database connection parameters.
```
define ('DB_HOST', 'localhost');
define ('DB_USER', 'capacityplanner');
define ('DB_PASS', 'capacityplanner');
define ('DB_NAME', 'capacityplanner');
```
 - Database model can be imported from ```src/dbmodel.sql```
 - Change language file in ```/js/main.js```.
Language files are located in folder ```/js/languages/```
Current language is french. English language will be available soon !
- profit !
