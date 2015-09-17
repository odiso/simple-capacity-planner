// ajax query helper
var webservice = {
    call: function (webservice, data, successCallback) {
        $.ajax({
            url: 'backend/front/' + webservice,
            data: data,
            dataType: 'json',
            type: 'POST',
            error: function () {
                $('#errorModal').find('.lead').html(l.get('webservice_error'));
                $('#errorModal').foundation('reveal', 'open');
            },
            success: function (data) {
                if (data.error != undefined) {
                    var message = data.error;
                    if(data.line != undefined && data.line != '') {
                        message += ' L' + data.line;
                    }
                    if(data.file != undefined && data.file != '') {
                        var className = data.file.substring(data.file.lastIndexOf('\\')+1).replace('.php','');
                        message += ' - ' + className;
                    }
                    $('#errorModal').find('.lead').html(message);
                    $('#errorModal').foundation('reveal', 'open');
                    return;
                }
                successCallback(data);
            }
        });
    }
};