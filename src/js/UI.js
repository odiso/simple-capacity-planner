
var UI = {


        /* Event handlers and initialisation */
        init : function(){

            // events on form
            $('#create_dashboard').foundation({bindings:'events'}).off('valid.fndtn.abide').on('valid.fndtn.abide', function () {
                webservice.call('createDashboard', $(this).serialize(), function(data){
                    UI.tab.createTab({id : data.id, name : $('#create_dashboard_name').val(), thresholdWarning : $('#create_dashboard_threshold_warning').val(), thresholdCritic : $('#create_dashboard_threshold_critic').val()});
                    UI.tab.selectTab(data.id);
                })
            });

            $('.tabs').on('toggled', function (event, tab) {
                UI.dataTable.refreshDataTablesColumnWidth();
            });

            UI.tab.mainPanelPopulate();
        },



        reloadDashboardContent: function (id) {

            // TODO

        }
    }
;