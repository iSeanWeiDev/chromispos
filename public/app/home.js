$(document).ready(function () {
  var mkConfig = {
    positionY: 'top',
    positionX: 'right',
    max: 15,
    scrollable: false
  };

  mkNotifications(mkConfig);

  this.goReport = function (id, name, flag){
    if(flag == true) {
        window.open('/'+name, '_self');
    } else {
      mkNoti(
        '<h5 class="font-weight-bold text-danger pl-3">Failure!</h5>',
        '<label class="text-danger font-weight-bold pl-1"> You did not login to our platform </label>',
        {
          status:'danger'
        }
      );

      setTimeout(() => {
        window.open('/login', '_self');
      }, 1500)
    }
  }
});
