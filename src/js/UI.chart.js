

/* Charts management */

UI.chart = {

    /* Load a chart in the dedicated modal box */

    displayChart : function(component_id, element_id)
    {

        $(document).off('opened.fndtn.reveal').on('opened.fndtn.reveal', '[data-reveal]', function () {
            var modal = $(this);
            if(modal.find('div').attr('id') == 'chartContainer' )
            {
                Charts.loadChart(component_id, element_id, '#chartContainer');
            }
        });

        var modalBox = $('#chartModal');
        modalBox.foundation('reveal', 'open');
        $("#chartContainer").html('');
    }
};