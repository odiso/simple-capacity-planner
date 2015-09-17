<?php

class Element {

//    private $_id;
//    private $_name;
//    private $_component_id;
//    private $_referenceKey;
//    private $_referenceValue;

    public static function getElements()
    {
        $database = new Database();

        $database->query("SELECT `id`, `name`, `component_id`, `referenceKey`, `referenceValue` FROM `element`");
        return $database->resultset();
    }

    public static function getElement($id)
    {
        $database = new Database();

        $database->query("SELECT `id`, `name`, `component_id`, `referenceKey`, `referenceValue`
      FROM `element`
      WHERE `id` = :id
      LIMIT 1");
        $database->bind(':id', $id, PDO::PARAM_INT);
        return $database->resultset();
    }

    public static function createElement($name, $component_id)
    {
        if(!Component::getComponent($component_id)){
            throw new Exception('Component "' . $component_id . '" does not exists.');
        }

        $database = new Database();

        $database->query("INSERT INTO `element` (`name`, `component_id`) VALUES (:name, :component_id)");
        $database->bind(':name', $name, PDO::PARAM_STR);
        $database->bind(':component_id', $component_id, PDO::PARAM_INT);
        $database->execute();
        return $database->lastInsertId();
    }

    public static function updateElement($id, $name, $component_id, $referenceKey, $referenceValue)
    {
        if(!self::getElement($id)){
            throw new Exception('Element "' . $id . '" does not exists.');
        }

        if(!Component::getComponent($component_id)){
            throw new Exception('Component "' . $component_id . '" does not exists.');
        }

        $database = new Database();

        $database->query("UPDATE  `element` SET
          `name` = :name,
          `component_id` = :component_id,
          `referenceKey` = :referenceKey,
          `referenceValue` = :referenceValue
         WHERE `id` = :id
          ");

        $database->bind(':id', $id, PDO::PARAM_INT);
        $database->bind(':name', $name, PDO::PARAM_STR);
        $database->bind(':component_id', $component_id, PDO::PARAM_INT);
        $database->bind(':referenceKey', $referenceKey, PDO::PARAM_STR);
        $database->bind(':referenceValue', $referenceValue, PDO::PARAM_STR);

        $database->execute();
        return true;
    }
    public static function deleteElement($id)
    {
        if(!self::getElement($id)){
            throw new Exception('Element "' . $id . '" does not exists.');
        }

        $database = new Database();

        $database->query("DELETE FROM  `element` WHERE `id` = :id");
        $database->bind(':id', $id, PDO::PARAM_INT);
        $database->execute();
        return true;
    }


}