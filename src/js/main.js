$(document).ready(function(){

    /* init language module */
    $.getScript("js/Language.js", function(){

        /* load language dictionnary */
        $.getScript("js/languages/lang.fr.js", function(){
            $(document).foundation({
                abide : {
                    patterns: {
                        name_pattern: /^[a-zA-Z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ\-\s']{1,256}$/,
                        threshold_pattern: /^[1-9][0-9]?$|^100$/,
                        key_pattern: /^[a-zA-Z0-9\-\s']{1,32}$/,
                        value_pattern: /^[0-9]+(\.([0-9]+))*$/,
                        referenceValue_pattern: /^[1-9][0-9]*(\.([0-9]+))*$/
                    }
                }
            });

            /* get initial data */
            webservice.call('getData', {}, function(data){


                /* List all elements and their properties */
                Element.elementList = data.elements;

                /* List all component and their properties */
                Component.componentList = data.components;

                /* Parse and display Dashboard Tabs */
                if(data.dashboards.length)
                {
                    for(var d in data.dashboards)
                    {
                        UI.tab.createTab(data.dashboards[d]);
                    }
                }

                /* Parse and display Component DataTables */
                if(data.components.length)
                {
                    for(var c in data.components)
                    {
                        UI.dataTable.createComponent(data.components[c]);
                    }
                }

                /* Init event handlers */
                UI.init();
            });
        });
    });
});

