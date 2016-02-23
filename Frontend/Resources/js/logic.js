$(function(){
  $('.coupon-form-wrapper').hide();
});

function verifyAccount(){

  var email = $('#Email').val();
  var password = $('#Password').val();
  var shopname = $('#Shopname').val();

  if(email && password && shopname) {

    var queryString = "?email=" + email + "&password=" + password + "&shopname=" + shopname;

    $.ajax({
      url: "http://localhost:8090/api/account-auth" + queryString,
      type: 'GET'
    })
      .done(function (data) {
        if(data === 'Valid Credentials'){
          var node = document.getElementsByClassName('intro-form-wrapper')[0];
          if(node){
            node.parentNode.removeChild(node);
          }
          $('.coupon-form-wrapper').show();
        }
        else{
          alert("Something is wrong with your credentials, check them and then try again");
        }})
      .fail(function () {
        console.log("Request failed");
      });
  }
  else{
    alert("Make sure you've filled in all of the input fields");
  }
}

function createCoupon(){

  var value = $('#Value').val();
  var order = $('#Max_order').val();
  var type = $("input[type='radio']:checked").val();

  if(value && order && type) {

    var queryString = "?coupon_type=" + type + "&coupon_value=" + value + "&minimum=" + order;

    $.ajax({
      url: "http://localhost:8090/api/generate-coupon" + queryString,
      type: 'POST'
    })
      .done(function (data) {
        $( ".coupon-form-wrapper" ).append( "<h1>Your GeneratedCoupon code is: " + data + "</h1>" );
        })
      .fail(function () {
        console.log("Request failed");
      });
  }
  else{
    alert("Make sure you've filled in all of the input fields");
  }
}
