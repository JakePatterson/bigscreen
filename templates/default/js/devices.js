function ajax_error(jqXHR, exception) {
    var msg = '';
    if (jqXHR.status === 0) {
        msg = 'Not connected.\n Verify Network.';
    } else if (jqXHR.status == 404) {
        msg = 'Requested page not found. [404]';
    } else if (jqXHR.status == 500) {
        msg = 'Internal Server Error [500].';
    } else if (exception === 'parsererror') {
        msg = 'Requested JSON parse failed.';
    } else if (exception === 'timeout') {
        msg = 'Time out error.';
    } else if (exception === 'abort') {
        msg = 'Ajax request aborted.';
    } else if (jqXHR.status == 403) {
        resp = jQuery.parseJSON(jqXHR.responseText);
        if(resp.error.info === 'You must enter your PIN to perform any API operations') {
            inactivityTime.pinlock();
            return;
        } else {
            msg = 'Permission error:\n' + jqXHR.responseText;
        }
    } else {
        msg = 'Uncaught Error.\n' + jqXHR.responseText;
    }

    $('#errortext').text(msg);
    $('#errormodal').foundation('open');
}

function set_status(container, name, status, msg)
{
    var label = $(container).find('span.label.'+name)[0];

    if(label) {
        $(label).toggleClass('success', status);
        $(label).toggleClass('alert'  , !status);
        $(label).html(msg);
    }
}


function set_device(container, devinfo)
{
    var now = new Date();

    var img = $(container).find('img.device-img');
    img.attr("src", devinfo.status.screen.thumb+"?"+now.getTime());
    img.data("zoom-image", devinfo.status.screen.full+"?"+now.getTime());
    img.ezPlus();
    set_status(container, 'alive'  , devinfo.status.alive, devinfo.statusstr.alive);
    set_status(container, 'running', devinfo.status.running, devinfo.statusstr.running);
    set_status(container, 'working', devinfo.status.working, devinfo.statusstr.working);
}


function refresh_device(container, name)
{
    $.ajax({
        url: deviceurl + "/" + name,
        type: 'GET',
        beforeSend: function() {
            $(container).find('.button')
                .prop('disabled', true)
                .toggleClass('disabled', true);
        },
        complete: function() {
            $(container).find('.button')
                .prop('disabled', false)
                .toggleClass('disabled', false);
        },
        success: function(result) {
            set_device(container, result[0]);
        },
        error: function(jqXHR, exception) { ajax_error(jqXHR, exception); }
    });
}


function reboot_device(container, name)
{
    $.ajax({
        url: deviceurl + "/" + name + "/reboot",
        type: 'POST',
        beforeSend: function() {
            $(container).find('.button')
                .prop('disabled', true)
                .toggleClass('disabled', true);
        },
        complete: function() {
            $(container).find('.button')
                .prop('disabled', false)
                .toggleClass('disabled', false);
        },
        success: function(result) {
            set_device(container, result[0]);
        },
        error: function(jqXHR, exception) { ajax_error(jqXHR, exception); }
    });
}


$(function() {
    $('button.refresh').on('click', function() {
        var container = this.closest('div.devicerow');
        var name = $(container).data('name');

        refresh_device(container, name);
    });

    $('button.reboot').on('click', function() {
        var container = this.closest('div.devicerow');
        var name = $(container).data('name');

        reboot_device(container, name);
    });

    $('img.device-img').ezPlus();
});