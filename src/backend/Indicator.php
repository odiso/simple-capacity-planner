<?php

class Indicator {

//    private $_element_id;
//    private $_date;
//    private $_value;
//    private $_referenceValue;

    public static function setIndicator($element_id, $value, $referenceValue, $month, $year)
    {
        $database = new Database();

        if(!Element::getElement($element_id)){
            throw new Exception('Element "' . $element_id . '" does not exists.');
        }

        if($referenceValue == 0){
            throw new Exception('Reference value cannot be 0');
        }

        $database->query("REPLACE INTO  `indicator` (`element_id`, `date`, `value`, `referenceValue`, `percent`) VALUES (:element_id, :date, :value, :referenceValue, :percent)");

        $database->bind(':element_id', $element_id, PDO::PARAM_INT);
        $database->bind(':date', $year . '-' . sprintf("%02d", $month) . '-01', PDO::PARAM_INT);
        $database->bind(':value', $value, PDO::PARAM_STR);
        $database->bind(':referenceValue', $referenceValue, PDO::PARAM_STR);
        $database->bind(':percent', round(($value)*100/$referenceValue), PDO::PARAM_INT);
        $database->execute();
        return true;

    }


    public static function deleteIndicator($element_id, $month, $year)
    {
        /*
        if(!Element::getElement($id)){
            throw new Exception('Element "' . $id . '" does not exists.');
        }

        $database = new Database();

        $database->query("DELETE FROM  `element` WHERE `id` = :id");
        $database->bind(':id', $id, PDO::PARAM_INT);
        $database->execute();
        return true;
        */
    }
}