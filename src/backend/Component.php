<?php

class Component {

//    private $_id;
//    private $_name;
//    private $_dashboard_id;
//    private $_thresholdWarning;
//    private $_thresholdCritic;

    public static function getComponents()
    {
        $database = new Database();

        $database->query("SELECT `id`, `name`, `dashboard_id`, `thresholdWarning`,`thresholdCritic`,`ratioModifier` FROM `component`");
        $components = $database->resultset();

        // populate elements for dataTable display
        if($database->rowCount())
        {
            foreach ($components as $key => $component) {

                $components[$key]['indicators'] =  array();
                $components[$key]['elements'] = array();

                $database->query("SELECT `id`, `name` FROM `element` WHERE `component_id` = :component_id");
                $database->bind(':component_id', $component['id'], PDO::PARAM_INT);
                $components[$key]['elements'] = $database->resultset();

                // populate indicators for dataTable display
                if($database->rowCount())
                {
                    $database->query("SELECT GROUP_CONCAT(`id`) as elementIdList FROM `element` WHERE `component_id` = :component_id");
                    $database->bind(':component_id', $component['id'], PDO::PARAM_INT);
                    $elementIdsList = $database->resultset();

                    $database->query("SELECT `element_id`, EXTRACT(YEAR FROM `date`) as year, EXTRACT(MONTH FROM `date`) as month, `value`, `referenceValue`, `percent` FROM `indicator`
                    WHERE `element_id` IN (" . $elementIdsList[0]['elementIdList'] . ")");
                    $components[$key]['indicators'] = $database->resultset();
                }
            }
        }

        return $components;
    }

    public static function getComponent($id)
    {
        $database = new Database();

        $database->query("SELECT `id`, `name`, `dashboard_id`, `thresholdWarning`,`thresholdCritic`,`ratioModifier`
        FROM `component`
        WHERE `id` = :id
        LIMIT 1");
        $database->bind(':id', $id, PDO::PARAM_INT);

        return $database->resultset();
    }

    public static function createComponent($name, $dashboard_id)
    {
        if(!Dashboard::getDashboard($dashboard_id)){
            throw new Exception('Dashboard "' . $dashboard_id . '" does not exists.');
        }

        $database = new Database();

        $database->query("INSERT INTO `component` (`name`, `dashboard_id`) VALUES (:name, :dashboard_id)");
        $database->bind(':name', $name, PDO::PARAM_STR);
        $database->bind(':dashboard_id', $dashboard_id, PDO::PARAM_INT);
        $database->execute();

        return $database->lastInsertId();
    }

    public static function updateComponent($id, $name, $dashboard_id, $thresholdWarning, $thresholdCritic, $ratioModifier)
    {
        if(!self::getComponent($id)){
            throw new Exception('Component "' . $id . '" does not exists.');
        }
        if(!Dashboard::getDashboard($dashboard_id)){
            throw new Exception('Dashboard "' . $dashboard_id . '" does not exists.');
        }

        $database = new Database();

        $database->query("UPDATE  `component` SET
          `name` = :name,
          `dashboard_id` = :dashboard_id,
          `thresholdWarning` = :thresholdWarning,
          `thresholdCritic` = :thresholdCritic,
          `ratioModifier` = :ratioModifier
         WHERE `id` = :id
          ");

        $database->bind(':id', $id, PDO::PARAM_INT);
        $database->bind(':name', $name, PDO::PARAM_STR);
        $database->bind(':dashboard_id', $dashboard_id, PDO::PARAM_INT);
        $database->bind(':thresholdWarning', $thresholdWarning, PDO::PARAM_INT);
        $database->bind(':thresholdCritic', $thresholdCritic, PDO::PARAM_INT);
        $database->bind(':ratioModifier', $ratioModifier, PDO::PARAM_STR);

        $database->execute();
        return true;
    }

    public static function deleteComponent($id)
    {
        if(!self::getComponent($id)){
            throw new Exception('Component "' . $id . '" does not exists.');
        }

        $database = new Database();

        $database->query("DELETE FROM  `component` WHERE `id` = :id");
        $database->bind(':id', $id, PDO::PARAM_INT);
        $database->execute();
        return true;
    }

}