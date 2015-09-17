
/* Component management */

UI.dataTable = {

    /* List of jquery plugin DataTables for dynamic access */
    dataTableList : [],

    /* DataTable Instantiation */
    createComponent : function(component, addToMainDashboard, previousSibling){

        if(addToMainDashboard == undefined) addToMainDashboard = false;
        if(previousSibling == undefined) previousSibling = false;
        component = Component.computeComponentData(component);

        var html = UI.dataTable.createDataTableHTML(component,addToMainDashboard);

        var parent = $('#dashboardPanel-' + component.dashboard_id);

        if(addToMainDashboard)
        {
            parent = $('#dashboardPanel-main');
        }
        if(previousSibling)
        {
            $(html).insertAfter(previousSibling);
        }
        else
        {
            parent.append(html);
        }

        // load DataTable
        $('.aDataTable').each(function(){
            if($(this).hasClass('dataTable')) return;
            var table =  $(this).DataTable(
                {
                    scrollX:        true,
                    scrollCollapse: true,
                    paging:         false,
                    retrieve: true,
                    searching:      false,
                    info:           false,
                    footer: true,
                    columnDefs: [
                        { width: "400px", type: 'num-html', targets: 0 },
                        { width: "20px", targets: "smallTh" },
                        { width: "170px", targets: "_all" }
                    ]
                }
            );
            new $.fn.dataTable.FixedColumns( table );
            table.columns.adjust().draw();
            $('.aDataTable').find('tfoot tr').each( function(){
                if($(this).css('height') == '111px'){
                    $(this).css('height','68px');
                }
            });
            $( ".dataTables_scrollBody" ).scrollLeft(99999999);

            UI.dataTable.dataTableList.push(table);

            if(addToMainDashboard)
            {
                table.rows().nodes().to$().hide();
                table.draw();

                UI.dataTable.bindEvents();

            }
        });
    },

    /* DataTable Base HTML */

    createDataTableHTML : function(component, addToMainDashboard){

        var firstCell = ( addToMainDashboard ? component.name : l.get('element_name') );
        var header = '\
           <div class="component-' + component.id + '-container">\
             <p class="component_name ' + (addToMainDashboard ? 'hide' : '') + '"><span>' + component.name + '</span>\
                <a href="#" class="button iconbutton secondary fi-x right" id="component-' + component.id + '-delete" data-component-id="' + component.id + '" data-component-name="' + component.name + '"></a>\
                <a href="#" class="button iconbutton secondary fi-pencil right smallMarginRight " id="component-' + component.id + '-edit" data-component="' + component.id + '"></a>\
                <a href="#" class="button iconbutton secondary fi-graph-trend right smallMarginRight" id="component-' + component.id + '-graph" data-component="' + component.id + '" data-element="total"></a>\
            </p>\
            \
            <table id="component-' + component.id + '" class="display aDataTable" cellspacing="0">\
                <thead>\
                    <tr>\
                        <th>\
                            <span class="left">' + firstCell + ' </span>\
                            <a href="#" class="button tinyiconbutton newElement fi-plus right ' + (addToMainDashboard ? 'hide' : '') + '" data-component="' + component.id + '"></a>\
                            <a href="#" class="button tinyiconbutton fi-magnifying-glass right ' + (addToMainDashboard ? '' : 'hide') + '" data-dataTableId="' + UI.dataTable.dataTableList.length + '"></a>\
                            <a href="#" class="button tinyiconbutton smallMarginRight fi-graph-trend right ' + (addToMainDashboard ? '' : 'hide') + '" data-component="' + component.id + '" data-element="total"></a><br>\
                        </th>\
                  ';

        for(var i in component.dateColumns)
        {
            var dateColumn = component.dateColumns[i];
            header += '\
                        <th>' + l.get('month_' + dateColumn.month) + ' ' + dateColumn.year + '</th>';
        }

        if(!addToMainDashboard)
        {
            header += '\
                    <th class="smallTh">\
                        <a href="#" class="button tinyiconbutton fi-clipboard-pencil right ' + (addToMainDashboard ? 'hide' : '') + '" data-component="' + component.id + '"></a>\
                    </th>';
        }
        header += '\
                    </tr>\
                </thead>';

        var body = '\
                <tbody>';

        for(var el in component.elements)
        {
            var element = component.elements[el];

            body += '\
                    <tr data-element-id="' + element.id + '">\
                         <td class="element-name" data-id="' + element.id + '"><span class="left">' + element.name + '</span>\
                            <a href="#" class="button tinyiconbutton secondary fi-x right ' + (addToMainDashboard ? 'hide' : '') + '" id="element-' + element.id + '-delete" data-element-id="' + element.id + '" data-element-name="' + element.name+ '"></a>\
                            <a href="#" class="button tinyiconbutton secondary fi-pencil right smallMarginRight ' + (addToMainDashboard ? 'hide' : '') + '" id="element-' + element.id + '-edit" data-element="' + element.id + '" data-component="' + component.id + '"></a>\
                            <a href="#" class="button tinyiconbutton secondary fi-graph-trend right smallMarginRight" id="element-' + element.id + '-graph" data-component="' + component.id + '" data-element="' + element.id + '"></a>\
                        </td>';

            for(var i in component.dateColumns)
            {
                var element_has_value = false;
                var dateColumn = component.dateColumns[i];

                for(var i in component.indicators) {
                    var indicator = component.indicators[i];

                    if (indicator.element_id == element.id
                        && indicator.month == dateColumn.month
                        && indicator.year == dateColumn.year) {
                        body += '\
                                <td ' + (addToMainDashboard ? '' : 'class="editable" data-element="' + element.id  + '" data-month="' + dateColumn.month + '" data-year="' + dateColumn.year + '"  data-value="' + indicator.value + '" data-refvalue="' + indicator.referenceValue + '" ') + '>\
                                    <div class="cell">\
                                        <h2 class="' + indicator.threshold + '">' + indicator.percent + '%</h2>\
                                        <div class="cell_number">' + indicator.value + ' <hr> ' + indicator.referenceValue + '</div>\
                                    </div>\
                                </td>';

                        element_has_value = true;
                        break;
                    }
                }
                if (!element_has_value) {
                    body += '\
                                <td ' + (addToMainDashboard ? '' : 'class="editable" data-element="' + element.id  + '" data-month="' + dateColumn.month + '" data-year="' + dateColumn.year + '"  data-value=""  data-refvalue="' + Element.getElement(element.id).referenceValue + '" ') + '>\
                               <a href="#" class=" tinyiconbutton fi-plus ' + (addToMainDashboard ? 'hide' : '') + '"></a>\
                        </td>';
                }

            }
            if(!addToMainDashboard) {
                body += '\
                                <td></td>';
            }
            body += '\
                    </tr>';
        }

        body += '\
                </tbody>';


        var footer = '\
                <tfoot>\
                    <tr>\
                        <td><span class="left">' + l.get('total') + ' ' + (!addToMainDashboard && component.ratioModifier != 'default' ? '<sup title="' + l.get('ratio_modifier_ruleOutMaxCapacity_help') + '">(?)</sup>' : '' ) + '</span></td>';

        for(var t in component.total) {
            var total = component.total[t];
            if(total.value == 0)
            {
                footer += '\
                    <td>\
                    </td>';
            }
            else
            {
                footer += '\
                    <td>\
                        <div class="cell">\
                            <h2 class="' + total.threshold + '">' + total.percent + '%</h2>\
                            <div class="cell_number">' + total.value + ' <hr> ' + total.referenceValue + '</div>\
                       </div>\
                    </td>';
            }
        }

        if(!addToMainDashboard) {
            footer += '\
                    <td></td>';
        }
        footer += '\
                    </tr>\
                </tfoot>\
            </table><br></div>';

        return ( header + body + footer );

    },


    /* DataTable display bug with tab switching correction */

    refreshDataTablesColumnWidth : function()
    {

        if(!UI.dataTable.dataTableList.length)
            return;

        for(var d in UI.dataTable.dataTableList)
        {
            UI.dataTable.dataTableList[d].columns.adjust().draw();
            $(".dataTables_scrollBody").scrollLeft(99999999);
        }
    },

    /* Delete Component from all tabs */

    removeTable: function (id) {
        $('.component-' + id + '-container').remove();

        UI.reloadDashboardContent('main');
        $(document).foundation();

    },

    /* Delete Element from all dataTables */

    removeElement: function (id) {

        for(var d in UI.dataTable.dataTableList)
        {
            var dataTable = UI.dataTable.dataTableList[d];
            dataTable.rows('[data-element-id=' + id + ']').remove().draw();
        }

        UI.reloadDashboardContent('main');
        $(document).foundation();
    },

    bindEvents : function()
    {
        $('.fi-magnifying-glass').unbind('click').click(function(event){
            event.stopPropagation();
            UI.dataTable.dataTableList[$(this).attr('data-dataTableId')].rows().nodes().to$().toggle();
            UI.dataTable.dataTableList[$(this).attr('data-dataTableId')].draw();
            return false;
        });

        $('.fi-graph-trend').unbind('click').click(function(event){
            event.stopPropagation();
            UI.chart.displayChart($(this).attr('data-component'), $(this).attr('data-element'));
            return false;
        });

        $('.component_name .fi-pencil').unbind('click').click(function(event){
            event.stopPropagation();
            Component.edit($(this).attr('data-component'));
            return false;
        });

        $('.element-name .fi-pencil').unbind('click').click(function(event){
            event.stopPropagation();
            Element.edit($(this).attr('data-element'), $(this).attr('data-component'));
            return false;
        });

        $('.component_name .fi-x').unbind('click').click(function(event){
            event.stopPropagation();
            Component.remove($(this).attr('data-component-id'), $(this).attr('data-component-name'));
            return false;
        });

        $('.element-name .fi-x').unbind('click').click(function(event){
            event.stopPropagation();
            Element.remove($(this).attr('data-element-id'), $(this).attr('data-element-name'));
            return false;
        });

        $('.newElement').unbind('click').click(function(event){
            event.stopPropagation();
            Element.create($(this).attr('data-component'));
            return false;
        });

        $('.editable').unbind('click').click(function(event) {
            event.stopPropagation();
            Indicator.setIndicator($(this).attr('data-element'), $(this).attr('data-value'), $(this).attr('data-refvalue'), $(this).attr('data-month'),$(this).attr('data-year'));
            return false;
        });

        $('.fi-clipboard-pencil').unbind('click').click(function(event) {
            event.stopPropagation();
            UI.dataTable.addDateColumn($(this).attr('data-component'));
            return false;
        });
    },

    getDataTablePreviousSibling : function(id)
    {
        return $('.component-' + id + '-container').prev()[1];
    },


    addDateColumn : function(component_id)
    {
        $('#add_datecolumn_monthpicker').val(new Date().getFullYear() + '-' + (("0" + (parseInt(new Date().getMonth()) + 1 )).slice(-2)));

        var modalBox = $('#addDateColumnModal');
        modalBox.foundation('reveal', 'open');

        $('#add_column_form').foundation({bindings:'events'}).off('valid.fndtn.abide').on('valid.fndtn.abide', function ()
        {
            var componentKey = Component.getComponentKey(component_id);
            var newDate = { month : parseInt($('#add_datecolumn_monthpicker').val().split('-')[1]), year : parseInt($('#add_datecolumn_monthpicker').val().split('-')[0]) };
            if(Component.dateColumnDoesNotExists(Component.componentList[componentKey].dateColumns, { month : newDate.month, year : newDate.year}))
            {
                Component.componentList[componentKey].dateColumns.push(newDate);
            }

            Component.redrawComponent(component_id);
            modalBox.foundation('reveal', 'close');
        });
    },

    dateColumnSorter : function(a, b)
    {
        var ad = new Date();
        var bd = new Date();

        ad.setDate(01);
        ad.setMonth((parseInt(a.month)-1));
        ad.setFullYear(parseInt(a.year));

        bd.setDate(01);
        bd.setMonth((parseInt(b.month)-1));
        bd.setFullYear(parseInt(b.year));

        return ad - bd;
    }




};
