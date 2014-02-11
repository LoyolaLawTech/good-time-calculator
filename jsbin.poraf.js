//Define the result variable
var numDays;

/*
When someone clicks the submit button on the form,
this function is triggered
*/ 

$('form').submit(function (e) {
    e.preventDefault();
    var sentence = $('#days').val(); //value of "Number of Days Input"
    var creditedDays = $('#credit').val();//value of next input, etc
    var felony = $('#type').val();
    var violence = $('#violence').val();
    var sex = $('#sex').val();
    result = $('#result');

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
    
    result.html('Your client will serve ' + numDays + ' days with good time'); 

    
  } 
});