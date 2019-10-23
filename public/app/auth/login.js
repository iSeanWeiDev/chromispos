$(document).ready(function () {
  var mkConfig = {
    positionY: 'top',
    positionX: 'right',
    max: 15,
    scrollable: false
  };

  mkNotifications(mkConfig);

  $('form#login').submit(function (e) { 
    var sendData = {
      email: $('input#login-email').val(),
      password: $('input#login-password').val()
    }

    $.ajax({
      type: "POST",
      url: "/auth/login",
      data: sendData,
      dataType: "JSON",
    }).done(response => {
      if(response && response.flag == true) {
        mkNoti(
            'Success!',
            response.message,
            {
                status:'success'
            }
        );

        setTimeout(() => {
            window.open('/home', '_self');
        }, 1000);
      } else {
          mkNoti(
              'Failure!',
              response.message,
              {
                  status:'danger'
              }
          );
      }
    });
    
    e.preventDefault();
  });
});
