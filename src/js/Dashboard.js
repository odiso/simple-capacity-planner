

var Dashboard = {

    dashboardList : [],

    /* return a dashboard via its id */
    getDashboard : function(dashboard_id)
    {
        return Dashboard.dashboardList[Dashboard.getDashboardKey(dashboard_id)];
    },


    /* return the dashboard position within the dashboard list via its id */
    getDashboardKey : function(dashboard_id)
    {
        for(var i in Dashboard.dashboardList)
        {
            if(Dashboard.dashboardList[i].id == dashboard_id)
                return i;
        }
        return false;
    },

    updateDashboard : function(id, name){

        $('#edit_dashboard_id').val(id);
        $('#edit_dashboard_name').val(name);

        var dashboard = Dashboard.getDashboard(id);

        $('#edit_dashboard_threshold_warning').val(dashboard.thresholdWarning);
        $('#edit_dashboard_threshold_critic').val(dashboard.thresholdCritic);


        var modalBox = $('#editDashboardModal');
        modalBox.foundation('reveal', 'open');

        // events on form
        $('#edit_dashboard').foundation({bindings:'events'}).off('valid.fndtn.abide').on('valid.fndtn.abide', function () {
            webservice.call('updateDashboard', $(this).serialize(), function(){

                // update values in local cache
                Dashboard.dashboardList[Dashboard.getDashboardKey(id)].name = $('#edit_dashboard_name').val();
                Dashboard.dashboardList[Dashboard.getDashboardKey(id)].thresholdWarning = $('#edit_dashboard_threshold_warning').val();
                Dashboard.dashboardList[Dashboard.getDashboardKey(id)].thresholdCritic = $('#edit_dashboard_threshold_critic').val();


                // update value from display
                UI.tab.renameTab(id, $('#edit_dashboard_name').val());
                Dashboard.setGlobalRatio(id);

                UI.tab.mainPanelPopulate();
                modalBox.foundation('reveal', 'close');
            });
        });
    },

    remove : function(id,name)
    {
        var modalBox = $('#deleteDashboardModal');
        modalBox.find('p').html(l.get('delete_dashboard_confirmation', name));
        modalBox.find('.deleteButton').unbind('click').click(function(){
            webservice.call('deleteDashboard', {id : id}, function(){
                // remove from local cache
                Dashboard.dashboardList.splice(Dashboard.getDashboardKey(id), 1);

                // remove from display
                UI.tab.removeTab(id);

                modalBox.foundation('reveal', 'close');
            });
        });
        modalBox.find('.cancelButton').unbind('click').click(function(){
            modalBox.foundation('reveal', 'close');
        });

        modalBox.foundation('reveal', 'open');
    },

    computeGlobalRatio : function(dashboard_id)
    {

        var currentDate = new Date();
        currentDate .setDate(currentDate .getDate() - 30);

        var totalReferenceValue = 0, totalValue = 0;
        var indicatorList = false;
        var indicatorsFound = 0;
        for(var i in Component.componentList)
        {
            indicatorsFound = 0;

            if(Component.componentList[i].useForGlobalRatio == '1'
                && Component.componentList[i].dashboard_id == dashboard_id)
            {
                indicatorList = Component.componentList[i].indicators;
                for(var j in indicatorList)
                {
                    if(indicatorList[j].month == (parseInt(currentDate.getMonth())+1) && indicatorList[j].year == currentDate.getFullYear())
                    {
                        totalValue += parseFloat(indicatorList[j].value);
                        totalReferenceValue += parseFloat(indicatorList[j].referenceValue);
                        indicatorsFound++;
                    }
                }
            }

            if(Component.componentList[i].ratioModifier == 'ruleOutMaxCapacity' && indicatorsFound > 1)
            {
                var maxCapacity = 0;
                for(var k in indicatorList) {
                    if(indicatorList[k].month == (parseInt(currentDate.getMonth())+1)
                        && indicatorList[k].year == currentDate.getFullYear()
                        && maxCapacity < parseFloat(indicatorList[k].referenceValue)) {
                        maxCapacity = parseFloat(indicatorList[k].referenceValue);
                    }
                }
                totalReferenceValue -= maxCapacity;
            }
        }
        if(totalValue != 0)
            return Math.round(parseFloat(totalValue)*100/parseFloat(totalReferenceValue));

        return false;
    },


    setGlobalRatio : function (id)
    {
        var globalRatio = Dashboard.computeGlobalRatio(id);
        var dashboard = Dashboard.getDashboard(id);
        if(!globalRatio)
        {
            Dashboard.dashboardList[Dashboard.getDashboardKey(id)].currentPercentageValue = '';
        }
        else
        {
            Dashboard.dashboardList[Dashboard.getDashboardKey(id)].currentPercentageValue = ' : <span class="' + Component.setThreshold({percent : globalRatio}, dashboard) + '">' + globalRatio + '%</span>';
        }

        $('#dashboardPanel-' + id + ' h3 span').remove();
        $('#dashboardPanel-' + id + ' h3').html(Dashboard.dashboardList[Dashboard.getDashboardKey(id)].name + ' ' + Dashboard.dashboardList[Dashboard.getDashboardKey(id)].currentPercentageValue);
    }
};
