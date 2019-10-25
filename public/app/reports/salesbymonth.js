$(document).ready(function () {
   mkNotifications({
    positionY: 'top',
    positionX: 'right',
    max: 15,
    scrollable: false
  });

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

  function returnHTML(data) {
    var newDateFormat = data.DATENEW.split('-')[1] + '-' + data.DATENEW.split('-')[0];

    var strHTML =  ` <tr>
                        <td scope="row">${newDateFormat}</td>
                        <td>${Math.round(parseFloat(data.ITEMSSOLD))}</td>
                        <td>$${formatNumber(data.LARGESTORDER.toFixed(2))}</td>
                        <td>$${formatNumber(validateNumber(data.TOTALSALES.toFixed(2)))}</td>
                        <td>$${formatNumber(validateNumber(data.TOTALTAXCOLLECTED.toFixed(2)))}</td>
                        <td>$${formatNumber(validateNumber(data.TOTAL.toFixed(2)))}</td>
                      </tr>`;
    return strHTML;
  }
  // Setting database connection
  $('select#select-db-host').change(function (e) {
    var data = JSON.parse(this.value);

    if(data != 0) {
      var method = "GET";
      var url = "/reports/categories";
      var sendData = {
        hostName: data.hostName,
      }

      returnData(method, url, sendData, callback => {
        if (callback && callback.flag == true) {
          var arrCategory = callback.data;

          arrCategory.sort((a, b) => {
              if(a.NAME < b.NAME) {return -1}
              if(a.NAME > b.NAME) {return 1}
              return 0;
          });

          var strHTML = `<option value="all" selected> All Categories </option>`;
          for (var obj of arrCategory) {
            if (obj.NAME != "") {
                strHTML += `<option value="${obj.ID}">${obj.NAME}</option>`;
            }
          }

          $('select#select-category').html(strHTML);
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

      $('input.report-show-database-name').val(data.dbName);
      $('input#database-index').val(data.hostName);       
      e.preventDefault();
    }
  });

  if ($('tbody#display-report').val() == "") {
    $('tbody#display-report').html(`<div class="report-no-data"><p>no data to display</p></div>`);
    // $('tfoot').attr('hidden', 'true');
  }

  this.downloadCSV = function() {
    var crrTime = (new Date()).toISOString().split('T')[0];

    $("table#report-table").table2excel({
        // exclude CSS class
      exclude: ".noExl",
      name: "Worksheet Name",
      filename: "Sales_by_month_report-"+crrTime, //do not include extension
      fileext: ".xls" // file extension
    });
  }


  this.generateReport = function () {
    var sendData = {};
    var hostName = $('input#database-index').val();
    var dateRange = $('select#date-range').val();

    if (hostName) {
      if(dateRange > 0) {
        var customStartDate;
        var customEndDate;
        var crrDate = new Date().toISOString();
        var arrDate = crrDate.split('T')[0].split('-');
        var categoryID = $('#select-category').val();

        switch (parseInt(dateRange)) {
          case 1: // THIS YEAR.
            customStartDate = arrDate[0] + '-01-01T00:00:00.000Z';
            customEndDate = arrDate[0] + '-12-31T23:59:59.999Z';
            break;

          case 2: // LAST YEAR.
            customStartDate = (arrDate[0]-1) + '-01-01T00:00:00.000Z';
            customEndDate = (arrDate[0]-1) + '-12-31T23:59:59.999Z';
            break;

          case 3: // ALL
            customStartDate = (arrDate[0]-100) + '-01-01T00:00:00.000Z';
            customEndDate = arrDate[0] + '-12-31T23:59:59.999Z';
            break;
      
          default:
            break;
        }

        sendData = {
          startDate: customStartDate,
          endDate: customEndDate,
          hostName: hostName,
          categoryID: categoryID
        }
      }

      if(getObjectSize(sendData) > 0) {
        EasyLoading.show();
        var method = "GET";
        var url = "/reports/salesbymonth"
        
        returnData(method, url, sendData, callback => {
          if(callback && callback.flag == true) {
            EasyLoading.hide();
            if(callback.data.length > 0) { 
              var strInnerHtml = '';
              var totalSales = 0;
              var totalTaxCollected = 0;
              var tatal = 0;

              for (var obj of callback.data) {
                totalSales += obj.TOTALSALES;
                totalTaxCollected += obj.TOTALTAXCOLLECTED;
                tatal += obj.TOTAL;

                strInnerHtml += returnHTML(obj);
              }

              $('tbody#display-report').html(strInnerHtml);
              $('tfoot').html(` <tr>
                                    <th class="text-dark font-weight-bold p-1"></th>
                                    <th class="text-dark font-weight-bold p-1"></th>
                                    <th class="text-dark font-weight-bold p-1">
                                        Grand Total 
                                    </th>
                                    <th class="text-dark font-weight-bold p-1">
                                        $${formatNumber(validateNumber(totalSales.toFixed(2)))}
                                    </th>
                                    <th class="text-dark font-weight-bold p-1">
                                        $${formatNumber(validateNumber(totalTaxCollected.toFixed(2)))}
                                    </th>
                                    <th class="text-dark font-weight-bold p-1">
                                        $${formatNumber(validateNumber(tatal.toFixed(2)))}
                                    </th>
                              </tr>`);
            } else {
              $('tbody#display-report').html(`<div class="report-no-data"><p>no data to display</p></div>`);
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
        });
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
});
