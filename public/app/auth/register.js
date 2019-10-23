'use strict';
$(document).ready(function () {
  window.token = 'PRIVATED_TOKEN_FOR_TESTING';

  var mkConfig = {
    positionY: 'top',
    positionX: 'right',
    max: 15,
    scrollable: false
  };

  mkNotifications(mkConfig);

  $('form#signup').submit(function (e) { 
    if($('#signup-token').val() == "PRIVATED_TOKEN_FOR_TESTING") {
      if($('input#signup-password').val() == $('input#signup-rpassword').val()) {
        var sendData = {
            userName: $('input#signup-username').val(),
            email: $('input#signup-email').val(),
            password: $('input#signup-password').val()
        }
    
        console.log(sendData);
        $.ajax({
          type: "POST",
          url: "/auth/register",
          data: sendData,
          dataType: "JSON"
        }).done(function(response) {
          console.log('response', response)
          if(response && response.flag == true) {
            mkNoti(
              '<h4 class="text-success">Success!</h4>',
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
              '<h4 class="text-danger">Failure!</h4>',
              response.message,
              {
                  status:'danger'
              }
            );
          }
        });
        } else {
          mkNoti(
            '<h4 class="text-warning">Warning!</h4>',
            'Check your password again.',
            {
                status:'warning'
            }
          );
        }
    } else {
      mkNoti(
        '<h4 class="text-warning">Warning!</h4>',
        'Please input the validated token.',
        {
            status:'warning'
        }
      );

      $('#signup-token').focus();
    }

    e.preventDefault();
  });
});