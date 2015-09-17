
var UI = {


        /* Event handlers and initialisation */
        init : function(){

            // events on form
            $('#create_dashboard').foundation({bindings:'events'}).off('valid.fndtn.abide').on('valid.fndtn.abide', function () {
                webservice.call('createDashboard', $(this).serialize(), function(data){
                    UI.tab.createTab({id : data.id, name : $('#create_dashboard_name').val()});
                    UI.tab.selectTab(data.id);
                })
            });

            $('.tabs').on('toggled', function (event, tab) {
                UI.dataTable.refreshDataTablesColumnWidth();
            });

            UI.tab.mainPanelPopulate();
        }

    }
;