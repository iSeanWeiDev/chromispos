$(document).ready(function () {
  mkNotifications({
    positionY: 'top',
    positionX: 'right',
    max: 15,
    scrollable: false
  });

  $('form#report').submit(function(e) {
    var method = "POST";
    var url = "/admin/reports";
    var sendData = {
      name: $('input#report-name').val(),
      detail: $('input#report-detail').val(),
    };

    returnData(method, url, sendData, callback => {
      if(callback && callback.flag ==  true) {
        mkNoti(
          'Success!',
          'Successfully created new report',
          {
            status:'success'
          }
        );

        setTimeout(() => {
          window.open('/reports', '_self');
        }, 1000);
      } else {
        mkNoti(
          'Failure!',
          'Server connection error',
          {
              status:'danger'
          }
        );
      }
    });
    e.preventDefault();
  });

  this.deleteReport = function(id) {
    var method = "DELETE";
    var url = "/admin/reports";
    var sendData = {
      id: id
    };

    returnData(method, url, sendData, callback => {
      if (callback && callback.flag == true) {
        mkNoti(
          'Success!',
          'Successfully created new report',
          {
            status:'success'
          }
        );

        setTimeout(() => {
          window.open('/reports', '_self');
        }, 1000);
      } else {
        mkNoti(
          'Failure!',
          'Server connection error',
          {
              status:'danger'
          }
        );
      }
    }); 
  }
  this.showUser = function(id) {
    var method = "PUT";
    var url = "/admin/reports";
    var sendData = {
      id: id
    }

    returnData(method, url, sendData, callback => {
      if (calllback && callback.flag == true) {
        mkNoti(
          'Success!',
          'Set the report for users',
          {
            status:'success'
          }
        );
      }
    });
  }
  this.editReport = function(id) {
    
  }
});