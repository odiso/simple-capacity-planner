
var Charts = {


    /* Generate Chart */
    loadChart : function(component_id, element_id_to_display, chartContainer)
    {
        /* Get component parameters */
        var component = Component.getComponent(component_id);

        /* get chart max value */
        var maxHeight = 100;
        for(var i in component.indicators)
        {
            if(maxHeight < parseInt(component.indicators[i].percent))
            {
                maxHeight = parseInt(component.indicators[i].percent) + 10;
            }
        }

        for(var i in component.total)
        {
            if(maxHeight < parseInt(component.total[i].percent))
            {
                maxHeight = parseInt(component.total[i].percent) + 10;
            }
        }

        /* Configure spline Chart options */
        var options = {
            title: {
                text: component.name
            },
            axisY:{
                stripLines:[
                    {
                        startValue: 0,
                        endValue: parseInt(component.thresholdWarning),
                        color: "rgba(0,90,0,.15)"
                    },
                    {
                        startValue:parseInt(component.thresholdWarning),
                        endValue:parseInt(component.thresholdCritic),
                        color:"rgba(221,143,0,.15)"
                    },
                    {
                        startValue:parseInt(component.thresholdCritic),
                        endValue:maxHeight,
                        color:"rgba(221,0,0,.15)"
                    }

                ],
                valueFormatString: "###",
                suffix : ' %',
                minimum : 0,
                maximum : maxHeight,
                interval: 20
            },
            toolTip: {
                content:"{x} : <b>{y} %</b><br>{val} / {valRef}"
            },
            axisX: {
                valueFormatString: "MMM YYYY",
                interval: 1,
                intervalType: "month"
            },
            animationEnabled: true,
            legend: {
                cursor: "pointer",
                itemclick: function (e) {
                    e.dataSeries.visible = !(typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible);
                    e.chart.render();
                },
                horizontalAlign: "left",
                verticalAlign: "center",
                fontSize: 15
            },
            data: [ ]
        };

        /* Generate Total Series */
        options.data.push(Charts.generateSeries(element_id_to_display, component.total, l.get('total'), 'total'));

        /* Generate Elements Series */
        for(var e in component.elements)
        {
            options.data.push(Charts.generateSeries(element_id_to_display, component.indicators, component.elements[e].name, component.elements[e].id));
        }

        /* Load Final Chart */
        $(chartContainer).CanvasJSChart(options);
    },



    /* Generate Data Series */
    generateSeries : function(element_id_to_display, component_data, element_name, element_id) {

        var dataSeries = {
            type: "spline", //change it to line, area, column, pie, etc
            showInLegend: true,
            legendText : element_name,
            visible : element_id_to_display == element_id,
            dataPoints: []
        };

        for(var i in component_data)
        {
            var cell = component_data[i];
            if(cell.value != 0 && (element_id == 'total' || cell.element_id == element_id))
            {
                dataSeries.dataPoints.push({
                    x : new Date(cell.year, cell.month),
                    y : parseInt(cell.percent),
                    val : parseFloat(cell.value),
                    valRef : parseFloat(cell.referenceValue)
                });
            }
        }

        return dataSeries;
    }


};
