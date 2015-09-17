<?php

class Dashboard {

//   private $_id;
//   private $_name;

   public static function getDashboards()
    {
        $database = new Database();

        $database->query("SELECT `id`,`name` FROM `dashboard`");
        return $database->resultset();
    }

    public static function getDashboard($id)
    {
        $database = new Database();

        $database->query("SELECT `id`, `name` FROM `dashboard` WHERE `id` = :id LIMIT 1");
        $database->bind(':id', $id, PDO::PARAM_INT);
        return $database->resultset();
    }

    public static function createDashboard($name)
    {
        $database = new Database();

        $database->query("INSERT INTO `dashboard` (`name`) VALUES (:name)");
        $database->bind(':name', $name, PDO::PARAM_STR);
        $database->execute();
        return $database->lastInsertId();
    }

    public static function updateDashboard($id, $name)
    {
        if(!self::getDashboard($id)){
            throw new Exception('Dashboard "' . $id . '" does not exists.');
        }

        $database = new Database();

        $database->query("UPDATE  `dashboard` SET `name` = :name WHERE `id` = :id");
        $database->bind(':id', $id, PDO::PARAM_INT);
        $database->bind(':name', $name, PDO::PARAM_STR);

        $database->execute();
        return $database->lastInsertId();
    }

    public static function deleteDashboard($id)
    {
        if(!self::getDashboard($id)){
            throw new Exception('Dashboard "' . $id . '" does not exists.');
        }

        $database = new Database();

        $database->query("DELETE FROM  `dashboard` WHERE `id` = :id");
        $database->bind(':id', $id, PDO::PARAM_INT);
        $database->execute();
        return true;
    }






}