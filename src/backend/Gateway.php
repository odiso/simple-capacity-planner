<?php

require "config.php";
require "Database.php";

require "Dashboard.php";
require "Component.php";
require "Element.php";
require "Indicator.php";

require "Frontservices.php";

require "JsonUTF8.php";

header('Content-Type: application/json; charset=utf-8');
set_exception_handler('Gateway::exceptionHandler');


class Gateway {

    private $_class = '';
    private $_method = '';
    private $_argList = array();
    private static $_webservicePackages = array(
            'front' => 'Frontservices',
            'back' => 'Backservices');


    // return exception messages as a JSON object
    public static function exceptionHandler(Exception $e)
    {
        echo json_encode(array('error' => $e->getMessage(), 'file' => $e->getFile(), 'line' => $e->getLine() ));
    }


    public function handleCall()
    {
        // [i] retrieve and check the Webservice class to use
        $this->_getWebservicePackage();

        // [i] retrieve and check the Webservice method name to call
        $this->_getWebserviceMethod();

        // [i] check if Method exists
        $this->_methodIsCallable();

        // [i] check if all mandatory parameters are defined
        $this->_getAllMethodArguments();


        // [i] call the method with arguments
        $class = new $this->_class();
        $result = call_user_func_array(array($class, $this->_method), $this->_argList);

        // [i] return result
        $result = JsonUTF8::json_utf8_encode($result);
        if(!$result || $result == '{}')
        {
            throw new Exception('Method did not answer correctly.');
        }

       echo $result;
    }


    private function _getWebservicePackage()
    {
        // [i] retrieve the webservice Method Class to load
        $className = $this->_getSingleArgument('client', false);
        if(!array_key_exists($className, self::$_webservicePackages))
        {
            throw new Exception('Webservice package "' . $className . '" does not exist.');
        }
        // replace key name with class name as defined in private var
        $this->_class = self::$_webservicePackages[$className];
    }

    private function _getWebserviceMethod()
    {
        // [i] retrieve the webservice method name to call
        $this->_method = $this->_getSingleArgument('method', false);
    }


    // [i] check if Method exists
    private function _methodIsCallable()
    {
        if(!method_exists($this->_class, $this->_method))
        {
            throw new Exception('Method "' . $this->_method . '" does not exists.');
        }
    }

    // [i] check if all mandatory parameters are defined
    private function _getAllMethodArguments()
    {
        // Get mandatory arguments list
        $r = new ReflectionMethod($this->_class, $this->_method);
        foreach ($r->getParameters() as $param) {
            // Get protected parameter
            $this->_argList[$param->name] = $this->_getSingleArgument($param->name, $param->isOptional());
        }
    }

    // [i] check if a parameter is defined, decode and protect it
    private function _getSingleArgument($arg, $isOptional)
    {
        if(!isset($_REQUEST[$arg]) && !$isOptional)
        {
            throw new Exception('Argument "' . $arg . '" is mandatory and is not defined.');
        }
        return strip_tags(urldecode(utf8_decode($_REQUEST[$arg])));
    }
}

/* initiate webservice handling */
$gate = new Gateway();
$gate->handleCall();