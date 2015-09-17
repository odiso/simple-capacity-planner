var Indicator = {

    setIndicator : function(element_id, value, referenceValue, month, year)
    {
        var element = Element.getElement(element_id);
        var component = Component.getComponent(element.component_id);
        var componentKey = Component.getComponentKey(element.component_id);


        $('#edit_indicator_element_id').val(element_id);
        $('#edit_indicator_value').val(value);
        $('#edit_indicator_referenceValue').val(referenceValue);
        $('#edit_indicator_month').val(month);
        $('#edit_indicator_year').val(year);

        var modalBox = $('#editIndicatorModal');
        modalBox.find('span:first').html(l.get('edit_indicator_form_title', element.name, l.get('month_' + month) + ' ' + year ));

        modalBox.foundation('reveal', 'open');

        $('#edit_indicator').foundation({bindings:'events'}).off('valid.fndtn.abide').on('valid.fndtn.abide', function () {
            webservice.call('setIndicator', $(this).serialize(), function() {

                var indicatorList = Component.componentList[componentKey].indicators;
                var cellFound = false;
                for(var i in indicatorList){
                    if(indicatorList[i].element_id != element_id
                        || indicatorList[i].month != month
                        || indicatorList[i].year != year ) {
                        continue;
                    }
                    cellFound = true;
                    indicatorList[i].value = $('#edit_indicator_value').val();
                    indicatorList[i].referenceValue = $('#edit_indicator_referenceValue').val();
                    indicatorList[i].percent = Math.round(parseFloat(indicatorList[i].value)*100/parseFloat(indicatorList[i].referenceValue));
                }

                if(!cellFound)
                {
                    Component.componentList[componentKey].indicators.push({
                        element_id: element_id,
                        month: month,
                        percent: Math.round(parseFloat($('#edit_indicator_value').val())*100/parseFloat($('#edit_indicator_referenceValue').val())),
                        referenceValue: $('#edit_indicator_referenceValue').val(),
                        value: $('#edit_indicator_value').val(),
                        year: year
                    });
                }

                Component.componentList[componentKey].indicators = indicatorList;
                Component.redrawComponent(element.component_id, { indicators : indicatorList });
                modalBox.foundation('reveal', 'close');
            });
        });




    }
};