$(document).ready(function () {
  mkNotifications({
    positionY: 'top',
    positionX: 'right',
    max: 15,
    scrollable: false
  });

  this.createUser = function () {
    var method = "POST";
    var url = "/admin/users";
    var sendData = {
      userName: $('input#userName').val(),
      email: $('input#email').val(),
      password: $('input#password').val(),
    };

    returnData(method, url, sendData, callback => {
      if (callback && callback.flag == true) {
        mkNoti(
          'Success!',
          'Created the user account',
          {
              status:'success'
          }
        );

        setTimeout(() => {
          window.open('/users', '_self');
        }, 300);
      } else {
        mkNoti(
          'Warning!',
          'Network error!',
          {
              status:'warning'
          }
        );  
      }
    });
  }

  this.deleteUser = function(id) {
    var method = "DELETE";
    var url = "/admin/users";
    var sendData = {
      id: id,
    };

    returnData(method, url, sendData, callback => {
      if (callback && callback.flag == true) {
        mkNoti(
          'Success!',
          'Deleted the user account',
          {
              status:'success'
          }
        );

        setTimeout(() => {
          window.open('/users', '_self');
        }, 300);
      } else {
        mkNoti(
          'Warning!',
          'Network error!',
          {
              status:'warning'
          }
        );  
      }
    });
  }

  this.changePassword = function(id) {
    if ($('input#cpassword'+id).val() == $('input#crpassword'+id).val()) {
      var method = "PUT";
      var url = "/admin/users";
      var sendData = {
        id: id,
        password: $('input#cpassword'+id).val(),
      }

      returnData(method, url, sendData, callback => {
        if (callback && callback.flag == true) {
          mkNoti(
            'Success!',
            'Changed user password',
            {
                status:'success'
            }
          );

          setTimeout(() => {
            window.open('/users', '_self');
          }, 300);
        }
      });
    } else {
      mkNoti(
        'Warning!',
        'Input the same password',
        {
            status:'warning'
        }
      );

      $('input#cpassword'+id).focus();
    }
  }
});
