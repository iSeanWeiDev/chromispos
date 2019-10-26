$(document).ready(function () {
  mkNotifications({
    positionY: 'top',
    positionX: 'right',
    max: 15,
    scrollable: false
  });

  var gDBConn;

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
    var data = JSON.parse(this.value);
    gDBConn = data;

    $('input.report-show-database-name').val(data.dbName);
    $('input#database-index').val(data.hostName);    
    $('div#sub-report').css('display', 'none');

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

  // generate the report
  this.generateReport = function() {
    var hostName = $('input#database-index').val();
    if (hostName) {
      var sendData = {};
      var startDate = $('input#report-start-date').val();
      var endDate = $('input#report-end-date').val();
      var dateRange = $('select#date-range').val();

      if((new Date(startDate)).getTime() > (new Date(endDate)).getTime()) {
        mkNoti(
          'Warning!',
          'Invalid date field',
          {
              status:'warning'
          }
        );

        $('input#report-end-date').focus();
      }

      if(startDate && endDate) {
        sendData = {
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          hostName: hostName
        }
      }

      if(dateRange > 0) {
        var customStartDate;
        var customEndDate;
        var crrDate = new Date();

        switch (parseInt(dateRange)) {
            case 1: // THIS MONTH.
                customStartDate = crrDate.getFullYear() + '/' + (crrDate.getMonth()+1) + '/' + '01';
                customEndDate = new Date().toISOString();
                break;

            case 2: // LAST MONTH.
                var year = crrDate.getFullYear();
                var month = crrDate.getMonth();
                var last = new Date(year, month, 0);

                crrDate.setMonth(crrDate.getMonth()-1);
                crrDate.setDate('01');

                customStartDate = crrDate.toISOString().split('T')[0];
                last.setHours(20,0,0);
                customEndDate = last.toISOString();
                break;

            case 3: // LAST 90 DAYS
                crrDate.setDate(crrDate.getDate() - 90);
                customStartDate = crrDate.toISOString().split('T')[0];
                customEndDate = new Date().toISOString();
                break;

            case 4: // THIS YEAR
                customStartDate = crrDate.getFullYear() + '/' + '01' + '/' + '01';
                customEndDate = new Date().toISOString();
                break;

            case 5: // LAST YEARR
                customStartDate = (crrDate.getFullYear()-1) + '/' + '01' + '/' + '01';
                customEndDate = (crrDate.getFullYear()-1) + '/' + '12' + '/' + '31';
                break;
        
            default:
                break;
        }

        sendData = {
          startDate: new Date(customStartDate).toISOString(),
          endDate: customEndDate,
          hostName: hostName
        }
      }

      if(getObjectSize(sendData) > 0) {
        var method = "GET";
        var url = "/reports/categoysales";
        
        EasyLoading.show();
        returnData(method, url, sendData, callback => {
          EasyLoading.hide();
          if (callback && callback.flag == true) {
            if (callback.data.length > 0) {
              var strInnerHtml = '';
              var totalQTY = 0;
              var totalGross = 0;
              var totalTax = 0;
              var totalAll = 0;
              
              // custom service
              var sumCCSouvenirs = 0;
              var sumCathedralOwned = 0;
              var sumFoodDrink = 0;

              for (var obj of callback.data) {
                if (gDBConn.hostName == "Windows server") {
                  if(obj.NAME == "CC Souvenirs") {
                    sumCCSouvenirs = obj.CATPRICE
                  }

                  if(obj.NAME == "Cathedral Owned") {
                    sumCathedralOwned = obj.CATPRICE
                  }

                  if(obj.NAME == "Food + Drink") {
                    sumFoodDrink = obj.CATPRICE
                  }
                }

                totalQTY += Math.round(obj.QTY);
                totalGross += obj.CATPRICE;
                totalTax += obj.CATTAX;
                totalAll += obj.CATTOTAL;

                strInnerHtml +=  ` <tr>
                                      <td scope="row" style="width: 20%;">${ obj.NAME }</td>
                                      <td style="width: 20%;">${ Math.round(parseFloat(obj.QTY)) }</td>
                                      <td style="width: 20%;">$${ formatNumber(obj.CATPRICE.toFixed(2)) }</td>
                                      <td style="width: 20%;">$${ formatNumber(validateNumber(obj.CATTAX.toFixed(2))) }</td>
                                      <td style="width: 20%;">$${ formatNumber(validateNumber(obj.CATTOTAL.toFixed(2))) }</td>
                                  </tr>`;
              }

              var allOtherTotal = totalGross - sumCCSouvenirs - sumCathedralOwned - sumFoodDrink;
              if(gDBConn.hostName == "Windows server") {
                $('div#sub-report').css('display', 'block');
                $('div#sub-report-values').html(`<span>
                                                        20% = $${ formatNumber((0.2*sumCCSouvenirs).toFixed(2)) } &emsp;
                                                        25% = $${ formatNumber((0.25*sumCCSouvenirs).toFixed(2)) }
                                                    </span>
                                                    <span>
                                                        75% = $${ formatNumber((0.75*sumCathedralOwned).toFixed(2)) } &emsp;
                                                        80% = $${ formatNumber((0.8*sumCathedralOwned).toFixed(2)) }
                                                    </span>
                                                    <span>
                                                        90% = $${ formatNumber((0.9*sumFoodDrink).toFixed(2)) } &emsp;
                                                        95% = $${ formatNumber((0.95*sumFoodDrink).toFixed(2)) }
                                                    </span>
                                                    <span>
                                                        10% = $${ formatNumber((0.1*allOtherTotal).toFixed(2)) } &emsp;
                                                        15% = $${ formatNumber((0.15*allOtherTotal).toFixed(2)) } &emsp;
                                                        20% = $${ formatNumber((0.2*allOtherTotal).toFixed(2)) }
                                                    </span>`);
              }

              $('tbody#display-report').html(strInnerHtml);
              $('tfoot').html(` <tr>
                                  <th class="text-dark font-weight-bold p-1" style="width: 20%;">
                                    Totals
                                  </th>
                                  <th class="text-dark font-weight-bold p-1" style="width: 20%;">
                                    ${totalQTY} 
                                  </th>
                                  <th class="text-dark font-weight-bold p-1" style="width: 20%;">
                                    $${formatNumber(parseFloat(validateNumber(totalGross.toFixed(2))))} 
                                  </th>
                                  <th class="text-dark font-weight-bold p-1" style="width: 20%;">
                                      $${formatNumber(parseFloat(validateNumber(totalTax.toFixed(2))))} 
                                  </th>
                                  <th class="text-dark font-weight-bold p-1" style="width: 20%;">
                                      $${formatNumber(parseFloat(validateNumber(totalAll.toFixed(2))))}
                                  </th>
                              </tr>`);
            } else {
              $('tbody#display-report').html(`<div class="report-no-data"><p>no data to display</p></div>`);
            }
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


  this.downloadCSV = function() {
    var crrTime = (new Date()).toISOString().split('T')[0];

    $("table#report-table").table2excel({
      // exclude CSS class
      exclude: ".noExl",
      name: "Worksheet Name",
      filename: "Category_sales_report-"+crrTime, //do not include extension
      fileext: ".xls" // file extension
    });
  }
});