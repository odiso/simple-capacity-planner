/* Dashboards management */
UI.tab = {

    createTab: function (dashboard) {

        Dashboard.dashboardList.push(dashboard);

        $('<li class="tab-title" id="dashboardTab-' + dashboard.id + '"><a href="#dashboardPanel-' + dashboard.id + '">' + dashboard.name + '</a></li>')
            .insertBefore('#dashboardTab-add');
        $('<div class="content" id="dashboardPanel-' + dashboard.id + '"></div>').insertBefore('#dashboardPanel-add');

        $('#dashboardPanel-' + dashboard.id).append('\
            <h3 class="left">' + dashboard.name  + '</h3>\
            <a href="#" id="delete-dashboard-' + dashboard.id + '" class="button tiny alert right ">' + l.get('delete_button') + '</a>\
            <a href="#" id="edit-dashboard-' + dashboard.id + '" class="button tiny secondary right smallMarginRight">' + l.get('edit_button') + '</a>\
            <a href="#" id="add-component-' + dashboard.id + '" class="button tiny right smallMarginRight">' + l.get('add_component_button') + '</a>\
        ');

        $('#edit-dashboard-' + dashboard.id).click(function () {
            Dashboard.updateDashboard(dashboard.id, dashboard.name);
        });
        $('#delete-dashboard-' + dashboard.id).click(function () {
            Dashboard.remove(dashboard.id, dashboard.name);
        });
        $('#add-component-' + dashboard.id).click(function () {
            Component.createComponent(dashboard.id);
        });

        Dashboard.setGlobalRatio(dashboard.id);

        $('#create_dashboard_name').val('');

        $(document).foundation();
    },

    selectTab: function (id) {
        var myTab = $('#dashboardTab-' + id);
        if (!myTab) return;
        $('#dashboardContainer').find('li').removeClass('active');
        myTab.addClass('active');
        $('.tabs-content').find('.content').removeClass('active');
        $('#dashboardPanel-' + id).addClass('active');
    },

    renameTab: function (id, name) {
        $('#dashboardTab-' + id).find('a').html(name);
        $('#rename-dashboard-' + id).unbind('click').click(function () {
            Dashboard.updateDashboard(id, name);
        });

        $(document).foundation();
    },


    removeTab: function (id) {
        $('#dashboardTab-' + id).remove();
        UI.tab.selectTab('add');

        UI.tab.mainPanelPopulate();
        $(document).foundation();

    },


    /* Main Dashboard generation */
    mainPanelPopulate   : function()
    {
        $('#dashboardPanel-main').html('');
        if(Dashboard.dashboardList.length)
        {
            for(var d in Dashboard.dashboardList)
            {
                var currentDashboard = Dashboard.dashboardList[d];
                $('#dashboardPanel-main').append('<h3>' + currentDashboard.name + currentDashboard.currentPercentageValue + '</h3>' );


                if(Component.componentList.length)
                {
                    for(var c in Component.componentList)
                    {
                        var currentComponent = Component.componentList[c];
                        if(currentComponent.dashboard_id == currentDashboard.id)
                            UI.dataTable.createComponent(currentComponent, true);
                    }
                }

            }
        }

    }

};