

var Component = {

    /* List of all components loaded */
    componentList : [],


    /* return a component via its id */
    getComponent : function(component_id)
    {
        return Component.componentList[Component.getComponentKey(component_id)];
    },


    /* return the component position within the component list via its id */
    getComponentKey : function(component_id)
    {
        for(var i in Component.componentList)
        {
            if(Component.componentList[i].id == component_id)
                return i;
        }
        return false;
    },

    /* populate all required properties of displaying of a component, either Chart or DataTable */
    computeComponentData : function(component){

        /* Determine dateColumns */
        if(component.dateColumns == undefined) component.dateColumns = [];
        component.dateColumns.concat(Component.setDateColumns(component));
        component.dateColumns.sort(UI.dataTable.dateColumnSorter);

        /* Determine Total Component values */
        component.total = Component.setTotalRow(component);

        /* Determine indicator thresholds */
        component.indicators = Component.setCellsThresholds(component);

        return component;
    },


    /* Determine dateColumns */
    setDateColumns : function(component)
    {
        var dateColumns = component.dateColumns;
        for(var i in component.indicators) {
            if(Component.dateColumnDoesNotExists(dateColumns, component.indicators[i]))
            {
                var date = { month : component.indicators[i].month, year : component.indicators[i].year };
                dateColumns.push(date);
            }
        }

        // add current month
        var currentDate = new Date();
        currentDate .setDate(currentDate .getDate() - 30);

        if(Component.dateColumnDoesNotExists(dateColumns, { month : (currentDate .getMonth()+1), year : currentDate .getFullYear() }))
        {
            var date = { month : (currentDate .getMonth()+1), year : currentDate .getFullYear() };
            dateColumns.push(date);
        }

        return dateColumns;
    },

    /* check if dates exists for a component */
    dateColumnDoesNotExists : function(dateColumns, indicator)
    {
        for(var d in dateColumns) {
            if(dateColumns[d].month == indicator.month
                && dateColumns[d].year == indicator.year )
            {
                return false;
            }
        }
        return true;
    },


    /* Determine Total Component values */
    setTotalRow : function(component)
    {
        var total = [];
        for(var d in component.dateColumns)
        {
            var dateColumn = component.dateColumns[d];

            var totalDateCell = {
                month : dateColumn.month,
                year : dateColumn.year,
                value : 0,
                referenceValue : 0,
                percent : 0,
                threshold : ''
            };

            total.push(Component.setTotalCell(totalDateCell, component, dateColumn));

        }
        return total;
    },

    /* Determine a Total Cell values */
    setTotalCell : function (totalDateCell, component, dateColumn)
    {
        var indicatorsFound = 0;
        for(var i in component.indicators)
        {
            var indicator = component.indicators[i];
            if(indicator.month == dateColumn.month
                && indicator.year == dateColumn.year)
            {
                totalDateCell = Component.totalCellCompute(totalDateCell, indicator, component);
                indicatorsFound++;
            }
        }

        if(component.ratioModifier == 'ruleOutMaxCapacity' && indicatorsFound > 1)
        {
            totalDateCell = Component.totalCellCompute(totalDateCell, Component.ratioModifierRuleOutMaxCapacity(component, dateColumn), component)
        }

        return totalDateCell;

    },

    /* Special percent modifier : rule out the largest capacity */
    ratioModifierRuleOutMaxCapacity : function(component, dateColumn){

        var maxReferenceValue = 0;

        for(var i in component.indicators) {
            var indicator = component.indicators[i];
            if (indicator.month == dateColumn.month
                && indicator.year == dateColumn.year
                && maxReferenceValue < parseFloat(component.indicators[i].referenceValue)) {
                maxReferenceValue = parseFloat(component.indicators[i].referenceValue);
            }
        }

        return { value : 0, referenceValue : - maxReferenceValue };
    },

    /* Determine specific total row cell values */
    totalCellCompute : function(totalDateColumn, indicator, component )
    {
        totalDateColumn.value = (parseFloat(indicator.value) + parseFloat(totalDateColumn.value)).toFixed(2);
        totalDateColumn.referenceValue = (parseFloat(indicator.referenceValue) + parseFloat(totalDateColumn.referenceValue)).toFixed(2);

        totalDateColumn.percent = Math.round(parseFloat(totalDateColumn.value)*100/parseFloat(totalDateColumn.referenceValue));

        totalDateColumn.threshold = Component.setThreshold(totalDateColumn, component);

        return totalDateColumn;
    },


    /* Determine indicator thresholds */
    setCellsThresholds : function(component)
    {
        var indicators = component.indicators;
        if(indicators != undefined && indicators.length) {
            for (var i in indicators) {
                indicators[i].threshold = Component.setThreshold(indicators[i], component);
            }
        }
        return indicators;
    },


    /* Determine threshold */
    setThreshold : function( cell, component )
    {
        var threshold = 'critic';
        if(parseInt(cell.percent) < parseInt(component.thresholdWarning)) {
            threshold = 'safe';
        }
        else if(parseInt(cell.percent) < parseInt(component.thresholdCritic)) {
            threshold = 'warn';
        }
        return threshold;
    },

    /* Delete Component from database */
    remove : function(id,name)
    {
        var modalBox = $('#deleteComponentModal');
        modalBox.find('p').html(l.get('delete_component_confirmation', name));
        modalBox.find('.deleteButton').unbind('click').click(function(){
            webservice.call('deleteComponent', {id : id}, function(){

                // remove from local cache
                Component.componentList.splice(Component.getComponentKey(id), 1);

                // remove from display
                UI.dataTable.removeTable(id);

                modalBox.foundation('reveal', 'close');
            });
        });
        modalBox.find('.cancelButton').unbind('click').click(function(){
            modalBox.foundation('reveal', 'close');
        });

        modalBox.foundation('reveal', 'open');
    },


    /* Edit component properties with form */
     edit : function(id){

         var component = Component.getComponent(id);

         $('#edit_component_id').val(component.id);
         $('#edit_component_dashboard_id').val(component.dashboard_id);
         $('#edit_component_name').val(component.name);
         $('#edit_component_threshold_warning').val(component.thresholdWarning);
         $('#edit_component_threshold_critic').val(component.thresholdCritic);
         $('#edit_component_ratio_modifier').val(component.ratioModifier);
         $('#edit_component_useForGlobalRatio').prop('checked', (component.useForGlobalRatio == '1' ? true:false ));

         var modalBox = $('#editComponentModal');
         modalBox.foundation('reveal', 'open');

         $('#edit_component').foundation({bindings:'events'}).off('valid.fndtn.abide').on('valid.fndtn.abide', function () {
             webservice.call('updateComponent', $(this).serialize() + ($('#edit_component_useForGlobalRatio').is(':checked') ? '' : '&useForGlobalRatio=0'), function(){

                 Component.redrawComponent(id, {
                     name :  $('#edit_component_name').val(),
                     thresholdWarning :  $('#edit_component_threshold_warning').val(),
                     thresholdCritic :  $('#edit_component_threshold_critic').val(),
                     ratioModifier : $('#edit_component_ratio_modifier').val(),
                     useForGlobalRatio : ($('#edit_component_useForGlobalRatio').is(':checked') ? 1 : 0)
                 } );

                 modalBox.foundation('reveal', 'close');
             });
         });
     },

    /* Erase the component and redraw at the same positions */
    redrawComponent : function(id, newProperties)
    {
        if(newProperties == undefined) newProperties = {};

        var key = Component.getComponentKey(id);

        for(var j in newProperties)
        {
            Component.componentList[key][j] = newProperties[j];
        }
        Component.computeComponentData(Component.componentList[key]);

        var previousSibling = UI.dataTable.getDataTablePreviousSibling(id);
        UI.dataTable.removeTable(id);
        UI.dataTable.createComponent(Component.componentList[key], false, previousSibling);

        Dashboard.setGlobalRatio(Component.componentList[key].dashboard_id);
        UI.tab.mainPanelPopulate();
    },

    /* Insert a new component via form */
    createComponent : function(dashboard_id){

        $('#edit_component_dashboard_id').val(dashboard_id);
        $('#edit_component_id, #edit_component_name, #edit_component_threshold_warning, #edit_component_threshold_critic').val('');
        $('#edit_component_useForGlobalRatio').prop('checked', false);

        var modalBox = $('#editComponentModal');
        modalBox.foundation('reveal', 'open');

        $('#edit_component').foundation({bindings:'events'}).off('valid.fndtn.abide').on('valid.fndtn.abide', function () {
            webservice.call('createComponent', $(this).serialize() + ($('#edit_component_useForGlobalRatio').is(':checked') ? '' : '&useForGlobalRatio=0'), function(data){

                Component.componentList.push({
                    id : data.id,
                    name : $('#edit_component_name').val(),
                    thresholdWarning : $('#edit_component_threshold_warning').val(),
                    thresholdCritic : $('#edit_component_threshold_critic').val(),
                    dashboard_id : $('#edit_component_dashboard_id').val(),
                    ratioModifier : $('#edit_component_ratio_modifier').val(),
                    useForGlobalRatio : ($('#edit_component_useForGlobalRatio').is(':checked') ? 1 : 0),
                    elements : [],
                    indicators : [],
                    dateColumns : [],
                });
                Component.computeComponentData(Component.componentList[Component.componentList.length-1]);

                UI.dataTable.createComponent(Component.componentList[Component.componentList.length-1], false);
                UI.tab.mainPanelPopulate();

                modalBox.foundation('reveal', 'close');
            });
        });
    }
};
