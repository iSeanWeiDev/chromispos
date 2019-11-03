$(document).ready(function () {
  this.createUser = function () {
    var method = "POST";
    var url = "/admin/users";
    var sendData = {};

    returnData(method, url, sendData, callback => {

    });
  }

  this.deleteUser = function(id) {
    var method = "DELETE";
    var url = "/admin/users/:"+id;
    var sendData = {};

    returnData(method, url, sendData, callback => {

    });
  }

  this.changePassword = function(id) {
    var method = "PUT";
    var url = "/admin/users/:"+id;
    var sendData = {
      password: "",
    }

    returnData(method, url, sendData, callback => {

    });
  }
});