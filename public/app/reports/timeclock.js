$(document).ready(function () {
  mkNotifications({
    positionY: 'top',
    positionX: 'right',
    max: 15,
    scrollable: false
  });

  var gArrPeople = [];

  function returnData(method, url, sendData, callback ) {
    $.ajax({
      type: method,
      url: url,
      data: sendData,
      dataType: "JSON",
    }).done(response => {
      callback(response);
    });
  }

  $('input#selected-people').val("All Employees");
    
  $('input#report-start-date').datetimepicker({
      format:'Y.m.d H:i',
      lang:'en'
  });

  $('input#report-end-date').datetimepicker({
      format:'Y.m.d H:i',
      lang:'en'
  });
  // Setting database connection

  $('select#select-db-host').change(function (e) {
    gArrPeople = [];
    var data = JSON.parse(this.value);
    if (data != 0) {
      var method = "GET";
      var url = "/reports/peoples";
      var sendData = {
        hostName: data.hostName,
      };

      returnData(method, url, sendData, callback => {
        var arrPeople = [];
        var nonUsefulUsers = ["Employee", "Administrator", "Manager"];

        for (var obj of callback.data) {
          if (nonUsefulUsers.indexOf(obj.NAME) < 0) {
            arrPeople.push(obj);
          }
        }

        arrPeople.sort(function(a, b) {
          if (a.NAME < b.NAME) { return -1 }
          if (b.NAME < a.NAME) { return 1 }
          return 0;
        });

        gArrPeople = arrPeople;

        if(callback && callback.flag == true) {
          var strInnerHtml = `<option class="font-weight-bold" value="all" selected> All Employees </option>`;

          for(var obj of gArrPeople) {
            if(obj.NAME != "") {
              strInnerHtml += `<option class="font-weight-bold" value="${obj.ID}">${obj.NAME}</option>`;
            }
          }

          $('select#select-peoples').html(strInnerHtml);
        } else {
          // validation
          mkNoti(
            'Warning!',
            'Database connection error, try again.',
            {
                status:'warning'
            }
          );
        }
      });
    }

    $('input.report-show-database-name').val(data.dbName);
    $('input#database-index').val(data.hostName);
    e.preventDefault();
  });

   // Begin Initialize the filters.
   $('select#date-range').change(function (e) { 
    $('input#report-start-date').val('');
    $('input#report-end-date').val('');
    e.preventDefault();
  });

  $('input#report-start-date').change(function (e) { 
      $('select#date-range').val(0);
      e.preventDefault();
  });

  $('input#report-end-date').change(function (e) { 
      $('select#date-range').val(0);
      e.preventDefault();
  });
  // End initialize the filters.

  if ($('tbody#display-report').val() == "") {
      $('tbody#display-report').html(`<div class="report-no-data"><p>no data to display</p></div>`);
      // $('tfoot').attr('hidden', 'true');
  }

  $('#select-peoples').change(function (e) {
    if(this.value == "0") {
        $('input#selected-people').val("All Employees");
    } else {
        for(var obj of gArrPeople) {
            if(obj.ID == this.value) {
                $('input#selected-people').val(obj.NAME);
            } 
        } 
    }
    
    e.preventDefault();
  });

  this.generateReport = function() {
    var hostName = $('input#database-index').val();

    if (hostName) { 
      var sendData = {};

      var dateRange = $('select#date-range').val();
      var peopleID = $('#select-peoples').val();

      if((new Date(startDate)).getTime() > (new Date(endDate)).getTime()) {
        mkNoti(
          'Warning!',
          'Invalid date field',
          {
              status:'warning'
          }
        );

        $('input#report-end-date').focus();
      } else {
        var startDate = $('input#report-start-date').val();
        var endDate = $('input#report-end-date').val();

        if(startDate && endDate) {
          sendData = {
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            dbIndex: databaseIndex,
            peopleId: peopleId
          }
        }
      }

      if(dateRange > 0) {
        var customStartDate;
        var customEndDate;

        var crrDate = new Date().toISOString();
        var arrDate = crrDate.split('T')[0].split('-');

        switch (parseInt(dateRange)) {
            case 1: // THIS MONTH.
                customStartDate = arrDate[0] + '-' + arrDate[1] + '-01T00:00:00.000Z'
                customEndDate = (new Date(arrDate[0], arrDate[1], 0).toISOString()).split('T')[0] + 'T23:59:59.999Z';
                break;

            case 2: // LAST MONTH.
                var dateObj = new Date();
                dateObj.setDate(0);
            
                var month = dateObj.getMonth() + 1;
                var day = dateObj.getDate();
                var year = dateObj.getFullYear();
                var strDate = new Date(year + '-' + month + '-' + day).toISOString().split('T')[0];

                customEndDate = strDate + 'T23:59:59.999Z';
                customStartDate = strDate.split('-')[0] + '-' + strDate.split('-')[1] + '-01T00:00:00.000Z'
                break;

            case 3: // LAST 90 DAYS
                var newDate = new Date();
                newDate.setDate(newDate.getDate() - 90);
                customStartDate = newDate.toISOString().split('T')[0] + 'T00:00:00.000Z';
                customEndDate = new Date().toISOString();
                break;

            case 4: // THIS YEAR
                customStartDate = arrDate[0] + '-01-01T00:00:00.000Z';
                customEndDate = new Date().toISOString();
                break;

            case 5: // LAST YEAR
                customStartDate = (arrDate[0]-1) + '-01-01T00:00:00.000Z';
                customEndDate = (arrDate[0]-1) + '-12-31T23:59:59.999Z';
                break;
        
            default:
                break;
        }

        sendData = {
            startDate: customStartDate,
            endDate: customEndDate,
            hostName: hostName,
            peopleID: peopleID
        }

        if(getObjectSize(sendData) > 0) {
          EasyLoading.show();
          var method = "GET";
          var url = "/reports/timeclock";
          
          returnData(method, url, sendData, callback => {
            EasyLoading.hide();
            var arrData = callback.data;
            if (callback && callback.flag == true) {
              var strInnerHtml = '';
              if($('input#selected-people').val() == "All Employees") {
                for (var objPeople of gArrPeople) {
                  var totalTime = 0;
                  var overTotalTime = 0;
                  strInnerHtml += `<tr>
                                      <td scope="row" 
                                          class="font-weight-bold text-info" 
                                          style="font-size: 20px;"
                                          colspan="4">
                                          <span> ${ objPeople.NAME } </span>
                                      </td>
                                    </tr>
                                    <tr style="font-size: 16px;">
                                        <td scope="row" 
                                            class="font-weight-bold"
                                            style="width: 30%;">
                                            TIME IN
                                        </td>
                                        <td class="font-weight-bold"
                                            style="width: 30%;">
                                            TIME OUT
                                        </td>
                                        <td class="text-center font-weight-bold" 
                                            style="width: 20%;">
                                            REG HOURS
                                        </td>
                                        <td class="text-center font-weight-bold"
                                            style="width: 20%;">
                                            OVERTIME HOURS
                                        </td>
                                    </tr>`;

                  for(var i=0; i < arrData.length; i++) {
                    if(objPeople.NAME == arrData[i].NAME) {
                      var flag = false;
                      var dailyTotal = 0;
                      var dailyRegTotal = 0;
                      var dailyOverTotal = 0;
                      var index = 0;

                      for (var j=i; j< arrData.length; j++) {
                        if(arrData[i].NAME == arrData[j].NAME && arrData[i].STARTSHIFT.split(" ")[0] == arrData[j].STARTSHIFT.split(" ")[0]){
                          flag = true;
                          dailyTotal += arrData[j].TOTALHOURS;
                          dailyTotal += (arrData[j].OVERTIME);

                          strInnerHtml += `<tr>
                                              <td scope="row"
                                                  style="width: 30%;">
                                                  ${ converISODateToDefault(arrData[j].STARTSHIFT) }
                                              </td>
                                              <td style="width: 30%;">
                                                  ${ converISODateToDefault(arrData[j].ENDSHIFT) }
                                              </td>
                                              <td class="text-center"
                                                  style="width: 20%">
                                                  ${ parseFloat(arrData[j].TOTALHOURS).toFixed(2) }
                                              </td>
                                              <td class="text-center"
                                                  style="width: 20%">
                                                  ${ parseFloat(arrData[j].OVERTIME).toFixed(2) }
                                              </td>
                                          </tr>`;
                          index = j;
                        }
                      }

                      if (flag == true) {
                        dailyRegTotal = dailyTotal > 8 ? 8 : dailyTotal;
                        dailyOverTotal = dailyTotal > 8 ? dailyTotal-8 : 0;
                        totalTime += dailyRegTotal;
                        overTotalTime += dailyOverTotal;

                        strInnerHtml += `<tr class="text-center font-weight-bold" style="font-size: 15px; padding-bottom:5px;">
                                            <td scope="row" class="text-right"
                                                colspan="2" style="width: 60%;">
                                                Daily Total
                                            </td>

                                            <td class="text-center"
                                                style="width: 20%">
                                                ${ dailyRegTotal.toFixed(2) }
                                            </td>
                                            <td class="text-center"
                                                style="width: 20%">
                                                ${ dailyOverTotal.toFixed(2) }
                                            </td>
                                        </tr>`;
                        i = index;
                      }


                      if(flag == false) {
                        totalTime += arrData[i].TOTALHOURS;
                        overTotalTime += arrData[i].OVERTIME;

                        strInnerHtml += `<tr>
                                            <td scope="row"
                                                style="width: 30%;">
                                                ${ converISODateToDefault(arrData[i].STARTSHIFT) }
                                            </td>
                                            <td style="width: 30%;">
                                                ${ converISODateToDefault(arrData[i].ENDSHIFT) }
                                            </td>
                                            <td class="text-center"
                                                style="width: 20%">
                                                ${ parseFloat(arrData[i].TOTALHOURS).toFixed(2) }
                                            </td>
                                            <td class="text-center"
                                                style="width: 20%">
                                                ${ parseFloat(arrData[i].OVERTIME).toFixed(2) }
                                            </td>
                                        </tr>
                                        <tr class="text-center font-weight-bold" style="font-size: 16px;">
                                            <td scope="row" class="text-right"
                                                colspan="2" style="width: 60%;">
                                                Daily Total
                                            </td>

                                            <td class="text-center"
                                                style="width: 20%">
                                                ${ parseFloat(arrData[i].TOTALHOURS).toFixed(2) }
                                            </td>
                                            <td class="text-center"
                                                style="width: 20%">
                                                ${ parseFloat(arrData[i].OVERTIME).toFixed(2) }
                                            </td>
                                        </tr>`;
                      }
                    } 
                  }

                  strInnerHtml += `<tr class="pb-3 text-info" style="font-size: 16px;">
                                      <td scope="row"
                                          class="text-right font-weight-bold pr-5"
                                          style="width: 60%;" colspan="2">
                                          Total
                                      </td>
                                      <td class="text-center font-weight-bold"
                                          style="width: 20%">
                                          ${ parseFloat(totalTime).toFixed(2) }
                                      </td>
                                      <td class="text-center font-weight-bold"
                                          style="width: 20%">
                                          ${ parseFloat(overTotalTime).toFixed(2) }
                                      </td>
                                    </tr>`;
                }
              } else {
                var totalTime = 0;
                var overTotalTime = 0;
                strInnerHtml += `<tr>
                                      <td scope="row" 
                                          class="font-weight-bold text-info" 
                                          style="font-size: 20px;"
                                          colspan="4">
                                          <span> ${ $('input#selected-people').val() } </span>
                                      </td>
                                  </tr>
                                  <tr style="font-size: 16px;">
                                      <td scope="row" 
                                          class="font-weight-bold"
                                          style="width: 30%;">
                                          TIME IN
                                      </td>
                                      <td class="font-weight-bold"
                                          style="width: 30%;">
                                          TIME OUT
                                      </td>
                                      <td class="text-center font-weight-bold" 
                                          style="width: 20%;">
                                          REG HOURS
                                      </td>
                                      <td class="text-center font-weight-bold"
                                          style="width: 20%;">
                                          OVERTIME HOURS
                                      </td>
                                  </tr>`;
                for(var i = 0; i < arrData.length; i++) {
                  var flag = false;
                  var dailyTotal = 0;
                  var dailyRegTotal = 0;
                  var dailyOverTotal = 0;
                  var index = 0;

                  for(var j = i; j < arrData.length; j++) {
                    if(arrData[i].NAME == arrData[j].NAME && arrData[i].STARTSHIFT.split(" ")[0] == arrData[j].STARTSHIFT.split(" ")[0]){
                        flag = true;
                        dailyTotal += arrData[j].TOTALHOURS;
                        dailyTotal += (arrData[j].OVERTIME);

                        strInnerHtml += `<tr>
                                            <td scope="row"
                                                style="width: 30%;">
                                                ${ converISODateToDefault(arrData[j].STARTSHIFT) }
                                            </td>
                                            <td style="width: 30%;">
                                                ${ converISODateToDefault(arrData[j].ENDSHIFT) }
                                            </td>
                                            <td class="text-center"
                                                style="width: 20%">
                                                ${ parseFloat(arrData[j].TOTALHOURS).toFixed(2) }
                                            </td>
                                            <td class="text-center"
                                                style="width: 20%">
                                                ${ parseFloat(arrData[j].OVERTIME).toFixed(2) }
                                            </td>
                                        </tr>`;
                        index = j;
                    }
                  }

                  if(flag == true) {
                    dailyRegTotal = dailyTotal > 8 ? 8 : dailyTotal;
                    dailyOverTotal = dailyTotal > 8 ? dailyTotal-8 : 0;
                    totalTime += dailyRegTotal;
                    overTotalTime += dailyOverTotal;

                    strInnerHtml += `<tr class="text-center font-weight-bold" style="font-size: 15px; padding-bottom:5px;">
                                        <td scope="row" class="text-right"
                                            colspan="2" style="width: 60%;">
                                            Daily Total
                                        </td>

                                        <td class="text-center"
                                            style="width: 20%">
                                            ${ dailyRegTotal.toFixed(2) }
                                        </td>
                                        <td class="text-center"
                                            style="width: 20%">
                                            ${ dailyOverTotal.toFixed(2) }
                                        </td>
                                    </tr>`;
                    i = index;
                  }  

                  if(flag == false) {
                    totalTime += arrData[i].TOTALHOURS;
                    overTotalTime += arrData[i].OVERTIME;

                    strInnerHtml += `<tr>
                                        <td scope="row"
                                            style="width: 30%;">
                                            ${ converISODateToDefault(arrData[i].STARTSHIFT) }
                                        </td>
                                        <td style="width: 30%;">
                                            ${ converISODateToDefault(arrData[i].ENDSHIFT) }
                                        </td>
                                        <td class="text-center"
                                            style="width: 20%">
                                            ${ parseFloat(arrData[i].TOTALHOURS).toFixed(2) }
                                        </td>
                                        <td class="text-center"
                                            style="width: 20%">
                                            ${ parseFloat(arrData[i].OVERTIME).toFixed(2) }
                                        </td>
                                    </tr>
                                    <tr class="text-center font-weight-bold" style="font-size: 16px;">
                                        <td scope="row" class="text-right"
                                            colspan="2" style="width: 60%;">
                                            Daily Total
                                        </td>

                                        <td class="text-center"
                                            style="width: 20%">
                                            ${ parseFloat(arrData[i].TOTALHOURS).toFixed(2) }
                                        </td>
                                        <td class="text-center"
                                            style="width: 20%">
                                            ${ parseFloat(arrData[i].OVERTIME).toFixed(2) }
                                        </td>
                                    </tr>`;
                    
                  }
                }

                strInnerHtml += `<tr class="pb-3 text-info" style="font-size: 16px;">
                                    <td scope="row"
                                        class="text-right font-weight-bold pr-5"
                                        style="width: 60%;" colspan="2">
                                        Total
                                    </td>
                                    <td class="text-center font-weight-bold"
                                        style="width: 20%">
                                        ${ parseFloat(totalTime).toFixed(2) }
                                    </td>
                                    <td class="text-center font-weight-bold"
                                        style="width: 20%">
                                        ${ parseFloat(overTotalTime).toFixed(2) }
                                    </td>
                                </tr>`;
              }

              $('tbody#display-report').html(strInnerHtml);
            } else {
              $('tbody#display-report').html(`<div class="report-no-data"><p>no data to display</p></div>`);
            }
          });
        } else {
          mkNoti(
            'Warning!',
            'Please select the filter as you want',
            {
                status:'warning'
            }
          );
        }
      } else {
        mkNoti(
          'Warning!',
          'Please choose the database',
          {
              status:'warning'
          }
        );
        
        $('select#select-db-host').focus();
      }
    }
  }

  this.downloadCSV = function() {
    var crrTime = (new Date()).toISOString().split('T')[0];

    $("table#report-table").table2excel({
        // exclude CSS class
        exclude: ".noExl",
        name: "Worksheet Name",
        filename: "Time_clock_report-"+crrTime, //do not include extension
        fileext: ".xls" // file extension
    });
  }
});