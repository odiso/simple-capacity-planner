

var Dashboard = {

    dashboardList : [],

    updateName : function(id, name){
        $('#rename_dashboard_id').val(id);
        $('#rename_dashboard_name').val(name);

        var modalBox = $('#renameDashboardModal');
        modalBox.foundation('reveal', 'open');

        // events on form
        $('#rename_dashboard').foundation({bindings:'events'}).off('valid.fndtn.abide').on('valid.fndtn.abide', function () {
            webservice.call('updateDashboard', $(this).serialize(), function(){
                UI.tab.renameTab(id, $('#rename_dashboard_name').val());

                for(var i in Dashboard.dashboardList)
                {
                    if(Dashboard.dashboardList[i].id == id)
                    {
                        Dashboard.dashboardList[i].name = $('#rename_dashboard_name').val();
                        break;
                    }
                };

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
                for(var i in Dashboard.dashboardList)
                {
                    if(Dashboard.dashboardList[i].id == id)
                    {
                        Dashboard.dashboardList.splice(i, 1);
                        break;
                    }
                };

                // remove from display
                UI.tab.removeTab(id);

                modalBox.foundation('reveal', 'close');
            });
        });
        modalBox.find('.cancelButton').unbind('click').click(function(){
            modalBox.foundation('reveal', 'close');
        });

        modalBox.foundation('reveal', 'open');
    }
};
