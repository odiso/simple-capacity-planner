<?php

/* All services are called via the Gateway class */

class Frontservices {

    public function getData()
    {
        $dashboards = Dashboard::getDashboards();
        $components = Component::getComponents();
        $elements = Element::getElements();

        $data = array(
            'dashboards'    => $dashboards,
            'components'    => $components,
            'elements'      => $elements
        );

        return $data;
    }


    // Dashboards services

    public function createDashboard($name, $thresholdWarning, $thresholdCritic)
    {
        $id = Dashboard::createDashboard($name, $thresholdWarning, $thresholdCritic);
        return array('result' => 'ok', 'id' => $id);
    }

    public function updateDashboard($id, $name, $thresholdWarning, $thresholdCritic)
    {
        Dashboard::updateDashboard($id, $name, $thresholdWarning, $thresholdCritic);
        return array('result' => 'ok');
    }

    public function deleteDashboard($id)
    {
        Dashboard::deleteDashboard($id);
        return array('result' => 'ok');
    }

    // Components services

    public function createComponent($dashboard_id, $name, $thresholdWarning, $thresholdCritic, $ratioModifier, $useForGlobalRatio)
    {
        $id = Component::createComponent($name, $dashboard_id);
        Component::updateComponent($id, $name, $dashboard_id, $thresholdWarning, $thresholdCritic, $ratioModifier, $useForGlobalRatio);

        return array('result' => 'ok', 'id' => $id);
    }

    public function updateComponent($id, $dashboard_id, $name, $thresholdWarning, $thresholdCritic, $ratioModifier, $useForGlobalRatio)
    {
        Component::updateComponent($id, $name, $dashboard_id, $thresholdWarning, $thresholdCritic, $ratioModifier, $useForGlobalRatio);
        return array('result' => 'ok', 'id' => $id);
    }

    public function deleteComponent($id)
    {
        Component::deleteComponent($id);
        return array('result' => 'ok');
    }


    // Elements services

    public function createElement($component_id, $name, $referenceKey, $referenceValue)
    {
        $id = Element::createElement($name, $component_id);
        Element::updateElement($id, $name, $component_id, $referenceKey, $referenceValue);

        return array('result' => 'ok', 'id' => $id);
    }

    public function updateElement($id, $component_id, $name, $referenceKey, $referenceValue)
    {
        Element::updateElement($id, $name, $component_id, $referenceKey, $referenceValue);
        return array('result' => 'ok', 'id' => $id);
    }

    public function deleteElement($id)
    {
        Element::deleteElement($id);
        return array('result' => 'ok');
    }


    // Data services

    public function setIndicator($element_id, $value, $referenceValue, $month, $year)
    {
        Indicator::setIndicator($element_id, $value, $referenceValue, $month, $year);
        return array('result' => 'ok');
    }
}
