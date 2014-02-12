//Define the result variable
var numDays, result;

function parseDateText(val){

    var parts = val.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,'').split(' ');
    var findYear = ['years','year','yrs','yr'];
    var findMonth = ['months','month'];
    var findDays = ['days','day'];
    var days = 0;
    var i, l, v;

    //Find if years are in the string; if so, convert to days
    for (i = 0, l = findYear.length; i < l; i ++) {
        v = parts.indexOf(findYear[i]);
        if (v > -1) {
            days += parts[v -1] * 365;
        }
    }

    //Find if months are in the string; if so, convert to days
    for (i = 0, l = findMonth.length; i < l; i ++) {
        v = parts.indexOf(findMonth[i]);
        if (v > -1) {
            days += parts[v -1] * 30;
        }
    }

    //Find if days are in the string; if so, add them
    for (i = 0, l = findDays.length; i < l; i ++) {
        v = parts.indexOf(findDays[i]);
        if (v > -1) {
            days += parts[v -1];
        }
    }

    if (isNaN(days)){
        return false;
    } else {
        return days;
    }

}

function humanizeDates(val) {

    var str = '';
    var values = {
        ' year': 365,
        ' month': 30,
        ' day': 1
    };

    for (var x in values) {
        var amount = Math.floor(val / values[x]);

        if (amount >= 1) {
            str += amount + x + (amount > 1 ? 's' : '') + ' ';
            val -= amount * values[x];
        }
    }

    return str;
}

/*
When someone clicks the submit button on the form,
this function is triggered
*/

$('form').submit(function (e) {
    e.preventDefault();
    var sentence = parseDateText($('#days').val()); //value of "Number of Days Input"
    var creditedDays = parseDateText($('#credit').val());//value of next input, etc
    var felony = $('#type').val();
    var violence = $('#violence').val();
    var sex = $('#sex').val();
    result = $('#result');

    if (!sentence || !creditedDays){
        toastr.error('I did not understand the dates you put in!' +
        ' Please make sure you provide numbers and units only, with no extra words.', 'Oops!');
        return false;
    }

    if (felony === 'true'){

        if (sex === 'true' || violence === 'true'){
            /*
            if it is a felony violence/sex crime, the amount of time left
            to be served will be the 85% of the sentence remaining after
            subtracting the amount of time credited by the judge for
            time served prior to sentencing.
            */

            numDays = (sentence - creditedDays) * 0.85;

        } else {
            /*
            if it is a felony non-sex/non-violence crime, the amount
            of time left to be served will be 40% of the sentence
            remaining after subtracting the amount of time credited by
            the judge for time served prior to sentencing.
            */

            numDays = (sentence - creditedDays) * 0.4;
        }

    } else {

        if (violence === 'true'){
            /*
            if it is a misdemeanor crime of violence, client
            must serve 85% of the sentence  remaining after subtracting
            the amount of time the judge credited the client for
            time served prior to sentencing
            */

            numDays = (sentence - creditedDays) * 0.85;

        } else {
            /*
            if it is a regular misdemeanor, the time the client must serve
            is %50 of the sentence remaining after subtracting the amount
            of time the judge credited the client for time served prior to sentencing.
            */

            numDays = (sentence - creditedDays) * 0.5;

        }

    }

    var humanDate = humanizeDates(numDays);

    if (humanDate){
        toastr.info('Your client will serve approximately ' + humanDate + ' (' + numDays + ' days) with good time', 'Result');
    } else {
        toastr.info('Your client will serve approximately ' + numDays + ' days with good time', 'Result');
    }
});

//Exclude Sentences which are not eligible from the start
$('#sex').change(function () {
    if ($(this).val() === 'true'){
        toastr.error('Inmates who are convicted of sexual offenses are not eligible for good time', 'Sorry!');
    }
});

$('#violence').change(function () {
    if ($(this).val() === 'true'){
        $('.hidden').removeClass('hidden');
    }
});

$('#violence2').change(function () {
    if ($(this).val() === 'true'){
        toastr.error('Inmates who are convicted of two or more crimes of violence are not eligible for good time', 'Sorry!');
    }
});

//Use Toastr for error handling
toastr.options = {
    'closeButton': true,
    'debug': false,
    'positionClass': 'toast-top-full-width',
    'onclick': null,
    'showDuration': '300',
    'hideDuration': '1000',
    'timeOut': '0',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'show',
    'hideMethod': 'fadeOut',
    'onHidden': function () {
        $('form')[0].reset();
    }
}

//Reset
$('.calc-redo').click(function (e) {
    e.preventDefault();
    $('form')[0].reset();

});

//Show dislaimer
$('.disclaimer').click(function (e) {
    e.preventDefault();
    toastr.info('This app is for informational purposes only and should not be considered legal advice. ' +
    'Determinations about good time are made by the La. Department of Corrections only. Their determinations '+
    'may differ from the information provided here.','Disclaimer');
});
