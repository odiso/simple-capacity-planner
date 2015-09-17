<?php

/* Project configuration */

define ('DB_HOST', 'localhost');
define ('DB_USER', 'capacityplanner');
define ('DB_PASS', 'capacityplanner');
define ('DB_NAME', 'capacityplanner');


// Format use for SQL EXTRACT function
// Example : SELECT `id` WHERE EXTRACT(YEAR_MONTH FROM `date`) = EXTRACT(YEAR_MONTH FROM NOW())
// http://www.w3schools.com/sql/func_extract.asp
define ('MYSQL_TIMERANGE', 'YEAR_MONTH');

// Format use for SQL date displaying
// http://www.w3schools.com/sql/func_date_format.asp
define ('DATE_FORMAT', '%Y-%M');


