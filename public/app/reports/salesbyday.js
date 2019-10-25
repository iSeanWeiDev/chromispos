$(document).ready(function () {
    mkNotifications({
    positionY: 'top',
    positionX: 'right',
    max: 15,
    scrollable: false
    });

    $('input#report-start-date').datetimepicker({
        format:'Y.m.d H:i',
        lang:'en'
    });

    $('input#report-end-date').datetimepicker({
            format:'Y.m.d H:i',
            lang:'en'
    });

    function returnRowHTML(data) {
        var newDateFormat = data.DATENEW.split('-')[1] + '-' + data.DATENEW.split('-')[2] + '-' + data.DATENEW.split('-')[0];
        var  strHTML =  ` <tr>
                              <td scope="row">${newDateFormat}</td>
                              <td>${Math.round(parseFloat(data.ITEMSSOLD))}</td>
                              <td>$${formatNumber(data.LARGESTORDER.toFixed(2))}</td>
                              <td>$${formatNumber(validateNumber(data.TOTALSALES.toFixed(2)))}</td>
                              <td>$${formatNumber(validateNumber(data.TOTALTAXCOLLECTED.toFixed(2)))}</td>
                              <td>$${formatNumber(validateNumber(data.TOTAL.toFixed(2)))}</td>
                          </tr>`;
        return strHTML;
    }

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
    
  // Setting database connection
    $('select#select-db-host').change(function (e) {
        var data = JSON.parse(this.value);
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

    this.downloadCSV = function() {
        var crrTime = (new Date()).toISOString().split('T')[0];

        $("table#report-table").table2excel({
            // exclude CSS class
            exclude: ".noExl",
            name: "Worksheet Name",
            filename: "Sales_by_day_report-"+crrTime, //do not include extension
            fileext: ".xls" // file extension
        });
    }

    this.generateReport = function () {
        var hostName = $('input#database-index').val();
        if (hostName) {
            var sendData = {};
            var startDate = $('input#report-start-date').val();
            var endDate = $('input#report-end-date').val();
            var dateRange = $('select#date-range').val();
            var categoryID = $('#select-category').val();

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
                    startDate: startDate,
                    endDate: endDate,
                    hostName: hostName,
                    categoryID: categoryID
                }
            }

            if (dateRange > 0) {
                var customStartDate;
                var customEndDate;

                var crrDate = new Date().toISOString();
                var arrDate = crrDate.split('T')[0].split('-');

                switch (parseInt(dateRange)) {
                    case 1: // THIS MONTH.
                            customStartDate = arrDate[0] + '-' + arrDate[1] + '-01T00:00:00.000Z';
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
                        categryID: categoryID
                }
            }

            if (getObjectSize(sendData) > 0) {
                EasyLoading.show();
                var method = "GET";
                var url = "/reports/salesbyday";

                returnData(method, url, sendData, callback => {
                    EasyLoading.hide();
                    if (callback && callback.flag == true) {
                        if (callback.data.length > 0) {
                            var strInnerHtml = '';
                            var totalSales = 0;
                            var totalTaxCollected = 0;
                            var total = 0;

                            for (var obj of callback.data) {
                                totalSales += parseFloat(obj.TOTALSALES);
                                totalTaxCollected += parseFloat(obj.TOTALTAXCOLLECTED);
                                total += parseFloat(obj.TOTAL);

                                strInnerHtml += returnRowHTML(obj);
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
                                                                            $${formatNumber(validateNumber(total.toFixed(2)))}
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