'use strict';
$(document).ready(function () {
  var mkConfig = {
      positionY: 'top',
      positionX: 'right',
      max: 15,
      scrollable: false
  };

  mkNotifications(mkConfig);

  $('form#new-db-connection').submit(function (e) { 
    var sendData = {
      hostName: $('input#connection-name').val(),
      host: $('input#host-ip').val(),
      port: $('input#db-port').val(),
      userName: $('input#db-username').val(),
      password: $('input#db-password').val(),
      dbName: $('input#db-name').val()
    }

    $.ajax({
        type: "POST",
        url: "/settings",
        data: sendData,
        dataType: "JSON",
    }).done(function(response) {
      if(response && response.flag == true) {
        mkNoti(
          'Success!',
          response.message,
          {
              status:'success'
          }
        );

        setTimeout(() => {
          window.open('/settings', '_self');
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

  this.deleteConnection = function(id) {
      var sendData = {
          id: id
      } 

      $.ajax({
        type: "DELETE",
        url: "/settings",
        data: sendData,
        dataType: "JSON"
      }).done(function(response) {
        if(response && response.flag == true) {
          mkNoti(
              'Done!',
              response.message,
              {
                  status:'success'
              }
          );
          
          $('div#headingOne-'+id).remove();
          windows.reload();
        } else {
          mkNoti(
            'Failure!',
            response.message,
            {
                status:'danger'
            }
          );
        }
      })
  }
});