$(document).ready(function () {
  mkNotifications({
    positionY: 'top',
    positionX: 'right',
    max: 15,
    scrollable: false
  });

  var gData = [];
  var gfilteredData = [];

  var flagUsedGData = false;
  var rowCount = 20;
  var crrPage = 1;

  function returnRowHTML(data) {
    var price = data.PRICE == null ? 0 : data.PRICE.toFixed(2);
    var strHTML = `<tr>
                    <td scope="row" 
                        class="text-left"
                        style="width: calc(100%/6)">
                        ${data.REFERENCE}
                    </td>
                    <td class="text-left"
                        style="width: calc(100%/3)">
                        ${data.NAME}
                    </td>
                    <td "text-left"
                        style="width: calc(100%/6)">
                        $${formatNumber(price)}
                    </td>
                    <td class="text-center"
                        style="width: calc(100%/6)">
                        ${formatNumber(data.UNITS)}
                    </td>
                    <td class="text-center"
                        style="width: calc(100%/6)">
                        $${formatNumber(data.TOTAL.toFixed(2))}
                    </td>
                  </tr>`;
    return strHTML;
  }

  $('input#report-start-date').datetimepicker({
    format:'Y.m.d H:i',
    lang:'en'
  });

  $('input#report-end-date').datetimepicker({
      format:'Y.m.d H:i',
      lang:'en'
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

  if($('tbody#display-report').val() == "") {
    $('tbody#display-report').html(`<div class="report-no-data"><p>No data to display</p></div>`);
    $('div#pagination').css("display", "none");
  }

  $('select#select-db-host').change(function (e) {
    var data = JSON.parse(this.value);
    var method = "GET";
    var url1 = "/reports/categories";
    var url2 = "/reports/suppliers";
    var sendData = {
      report: "productSales",
      hostName: data.hostName,
    }

    returnData(method, url1, sendData, callback => {
      var arrCategory = callback.data;
      arrCategory.sort(function(a, b) {
        if (a.NAME < b.NAME) {
            return -1;
        }
        if (b.NAME < a.NAME) {
            return 1;
        }
        return 0;
      });

      if(callback && callback.flag == true) {
        var strHtml = `<option value="all" selected> All Categories </option>`;

        for(var obj of arrCategory) {
          if(obj.NAME != "") {
            strHtml += `<option value="${obj.ID}">${obj.NAME}</option>`;
          }
        }

        $('select#select-category').html(strHtml);
      } else {
         mkNoti(
          'Warning!',
          'Database connection error, try again.',
          {
              status:'warning'
          }
        );
      }
    });

    returnData(method, url2, sendData, callback => {
      var arrSupplier = callback.data;
      arrSupplier.sort(function(a, b) {
        if (a.SUPPLIERNAME < b.SUPPLIERNAME) {
            return -1;
        }
        if (b.SUPPLIERNAME < a.SUPPLIERNAME) {
            return 1;
        }
        return 0;
      });

      if(callback && callback.flag == true) {
        var strHtml = `<option value="all" selected> All Suppliers </option>`;

        for(var obj of arrSupplier) {
          if(obj.SUPPLIERNAME != "") {
            strHtml += `<option value="${obj.ID}">${obj.SUPPLIERNAME}</option>`;
          }
        }

        $('select#select-supplier').html(strHtml);
      } else {
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

  this.generateReport = function() {
    gData = [];
    gfilteredData = [];
    flagUsedGData = false;
    crrPage = 1;

    var hostName = $('input#database-index').val();
    if (hostName != "") {
      var sendData = {};
      var dateRange = $('select#date-range').val();
      var startDate = $('input#report-start-date').val();
      var endDate = $('input#report-end-date').val();
      var categoryID = $('#select-category').val();
      var supplierID = $('#select-supplier').val();

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
            categoryID: categoryID.toString(),
            supplierID: supplierID.toString(),
        }
      }

      if(dateRange > 0) {
        var customStartDate;
        var customEndDate;
        
        switch (parseInt(dateRange)) {
          case 1: // Today
            // var crrDate = new Date().setHours((new Date()).getHours-8).toISOString();
            var currDate = new Date(Date.now());
            currDate.setHours(currDate.getHours() - 8);
            currDate = new Date(currDate).toISOString();
            var arrDate = currDate.split('T')[0].split('-');

            customStartDate = arrDate[0] + '-' + arrDate[1] + '-' + arrDate[2] + 'T00:00:00.000Z';
            customEndDate = arrDate[0] + '-' + arrDate[1] + '-' + arrDate[2] + 'T23:59:59.999Z';
            break;
          case 2: // Yesterday
            var currDate = new Date(Date.now());
            currDate.setHours(currDate.getHours() - 8);
            var date2 = (currDate).setDate(currDate.getDate() - 1);
            var isoDate2 = (new Date(date2)).toISOString();
            var arrDate2 = isoDate2.split('T')[0].split('-');

            customStartDate = arrDate2[0] + '-' + arrDate2[1] + '-' + arrDate2[2] + 'T00:00:00.000Z';
            customEndDate = arrDate2[0] + '-' + arrDate2[1] + '-' + arrDate2[2] + 'T23:59:59.999Z';
            break;
          case 3: // Last 7 Days
            var date7 = (new Date(Date.now())).setDate((new Date(Date.now())).getDate() - 7);
            var isoDate7 = (new Date(date7)).toISOString();
            var arrDate7 = isoDate7.split('T')[0].split('-');
            var crrDate7 = new Date().toISOString();
            var arrEndDate7 = crrDate7.split('T')[0].split('-');

            customStartDate = arrDate7[0] + '-' + arrDate7[1] + '-' + arrDate7[2] + 'T00:00:00.000Z';
            customEndDate= arrEndDate7[0] + '-' + arrEndDate7[1] + '-' + arrEndDate7[2] + 'T23:59:59.999Z';
            break;
          case 4: // This month
            var crrDate = new Date(Date.now()).toISOString();
            var arrDate = crrDate.split('T')[0].split('-');
            customStartDate = arrDate[0] + '-' + arrDate[1] + '-01T00:00:00.000Z';
            customEndDate = (new Date(arrDate[0], arrDate[1], 0).toISOString()).split('T')[0] + 'T23:59:59.999Z';
            break;
          case 5: // Last month
            var dateObj = new Date(Date.now());
            dateObj.setDate(0);
        
            var month = dateObj.getMonth() + 1;
            var day = dateObj.getDate();
            var year = dateObj.getFullYear();
            var strDate = new Date(year + '-' + month + '-' + day).toISOString().split('T')[0];

            customEndDate = strDate + 'T23:59:59.999Z';
            customStartDate = strDate.split('-')[0] + '-' + strDate.split('-')[1] + '-01T00:00:00.000Z'
            break;
          case 6: // Last 90 days
            var newDate = new Date(Date.now());
            newDate.setDate(newDate.getDate() - 90);
            customStartDate = newDate.toISOString().split('T')[0] + 'T00:00:00.000Z';
            customEndDate = new Date(Date.now()).toISOString();
            break;
          case 7: // This year
            var crrDate = new Date(Date.now()).toISOString();
            var arrDate = crrDate.split('T')[0].split('-');
            customStartDate = arrDate[0] + '-01-01T00:00:00.000Z';
            customEndDate = new Date(Date.now()).toISOString();
            break;
          case 8: // Last year
            var crrDate = new Date(Date.now()).toISOString();
            var arrDate = crrDate.split('T')[0].split('-');
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
          categoryID: categoryID.toString(),
          supplierID: supplierID.toString(),
        }
      }

      if (getObjectSize(sendData) > 0) {
        // console.log(sendData);
        EasyLoading.show();
        var method = "GET";
        var url = "/reports/productsales";
        
        returnData(method, url, sendData, callback => {
          EasyLoading.hide();
          if (callback && callback.flag == true) {
            gData = callback.data;
            if(gData.length > 0) {
              var total = Math.round(gData.length/rowCount);
              var initCountRow = gData.length < rowCount ? gData.length : rowCount;
              var initTotal = gData.length < rowCount ? 1 : total;
              var strInnerHtml = '';

              for(var i=0; i<initCountRow; i++) {
                strInnerHtml +=  returnRowHTML(gData[i]);
              }

              $('tbody#display-report').html(strInnerHtml);
              $('div#pagination').css("display", "block");
              $('span#current-rows').html(`Current rows: ${ initCountRow }`);
              $('span#total-rows').html(`Total rows: ${ gData.length }`);
              $('#pagination-display').val(` ${crrPage} / ${initTotal}`);
            } else {
              $('tbody#display-report').html(`<div class="report-no-data"><p>No data to display</p></div>`);
              $('div#pagination').css("display", "none");
            }
          } else {
            $('tbody#display-report').html(`<div class="report-no-data"><p>No data to display</p></div>`);
          }
        });
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

  this.firstPage = function() {
    crrPage = 1;
    var strInnerHtml = '';
    var arrNewData = flagUsedGData == true ? gfilteredData : gData;
    var total = Math.round(arrNewData.length/rowCount);

    for(var i=(crrPage-1)*rowCount; i < crrPage*rowCount; i++) {
        strInnerHtml += returnRowHTML(arrNewData[i]);
    }

    $('tbody#display-report').html(strInnerHtml);
    $('span#current-rows').html(`Current rows: ${ rowCount }`);
    $('#pagination-display').val(` ${crrPage} / ${total}`);
  }

  this.previousPage = function() {
      crrPage--;

      if(crrPage > 0) {
          var strInnerHtml = '';
          var arrNewData = flagUsedGData == true ? gfilteredData : gData;
          var total = Math.round(arrNewData.length/rowCount);
          
          for(var i=(crrPage-1)*rowCount; i < crrPage*rowCount; i++) {
              strInnerHtml += returnRowHTML(arrNewData[i]);
          }

          $('tbody#display-report').html(strInnerHtml);
          $('span#current-rows').html(`Current rows: ${ rowCount }`);
          $('#pagination-display').val(` ${crrPage} / ${total}`);
      } else {
          crrPage = 1; 
      }
  }

  this.nextPage = function() {
    crrPage++;
    var strInnerHtml = '';
    var arrNewData = flagUsedGData == true ? gfilteredData : gData;
    var total = Math.round(arrNewData.length/rowCount);

    if(crrPage <= total) {
      var newRow = arrNewData.length-crrPage*rowCount < rowCount ? arrNewData.length : crrPage*rowCount;
      var disCurrRows = crrPage == total ? arrNewData.length-(crrPage-1)*rowCount :  rowCount;

      for(var i=(crrPage-1)*rowCount; i < newRow; i++) {
          strInnerHtml += returnRowHTML(arrNewData[i]);
      }

      $('tbody#display-report').html(strInnerHtml);
      $('span#current-rows').html(`Current rows: ${ disCurrRows }`);
      $('#pagination-display').val(` ${crrPage} / ${total}`);
    } else {
      crrPage = total;
    }
  }

  this.lastPage = function() {
    var strInnerHtml = '';
    var arrNewData = flagUsedGData == true ? gfilteredData : gData;
    var total = Math.round(arrNewData.length/rowCount);
    crrPage = total;
    var newRow = (arrNewData.length-crrPage*rowCount) < rowCount ? arrNewData.length : crrPage*rowCount;
  
    for(var i=(crrPage-1)*rowCount; i < newRow; i++) {
        strInnerHtml += returnRowHTML(arrNewData[i]);
    }

    $('tbody#display-report').html(strInnerHtml);
    $('span#current-rows').html(`Current rows: ${ arrNewData.length-(crrPage-1)*rowCount }`);
    $('#pagination-display').val(` ${crrPage} / ${total}`);
  }

  $('input#table-search').keypress(function (e) { 
    if (event.which == 13) {
        var arrNewData = [];
        var searchKey = $(this).val(); 
        var flagReference = false;
        var flagName = false;

        if(searchKey != "") {
          searchKey = searchKey.toLowerCase();

          for(var obj of gData) {
              var flagReference = obj.REFERENCE.toLowerCase().indexOf(searchKey) !== -1 ? true : false;
              var flagName = obj.NAME.toLowerCase().indexOf(searchKey) !== -1 ? true : false;
              
              if(flagReference == true || flagName == true) {
                  arrNewData.push(obj);
              }
          }

          crrPage = 1;
          var total = Math.round(arrNewData.length/rowCount);
          var initCountRow = arrNewData.length < rowCount ? arrNewData.length : rowCount;
          var initTotal = arrNewData.length < rowCount ? 1 : total;

          gfilteredData = arrNewData;
          flagUsedGData = true;

          if(arrNewData.length > 0) {
            var strInnerHtml = '';

            for(var i = 0; i < initCountRow; i++) {
                strInnerHtml += returnRowHTML(arrNewData[i]);
            }

            $('tbody#display-report').html(strInnerHtml);
            $('#pagination-display').val(` ${crrPage} / ${initTotal}`);
            $('span#current-rows').html(`Current rows: ${ initCountRow }`);
            $('span#total-rows').html(`Total rows: ${ arrNewData.length }`);
            arrNewData = [];
          } else {
            $('tbody#display-report').html(`<div class="report-no-data"><p>No data to display</p></div>`);
          }
      } else {
        if(gData.length > 0) {
            var total = Math.round(gData.length/rowCount);
            var initCountRow = gData.length < rowCount ? gData.length : rowCount;
            var initTotal = gData.length < rowCount ? 1 : total;
            var strInnerHtml = '';

            for(var i=0; i<initCountRow; i++) {
                strInnerHtml +=  returnRowHTML(gData[i]);
            }

            $('tbody#display-report').html(strInnerHtml);
            $('div#pagination').css("display", "block");
            $('span#current-rows').html(`Current rows: ${ initCountRow }`);
            $('span#total-rows').html(`Total rows: ${ gData.length }`);
            $('#pagination-display').val(` ${crrPage} / ${initTotal}`);
        } else {
            $('tbody#display-report').html(`<div class="report-no-data"><p>No data to display</p></div>`);
        }
      }
    }
  });

  var fsi = false,
        fsn = false,
        fsp = false,
        fsq = false,
        fst = false;

    this.sortColumn = function(id) {
        crrPage = 1;
        var arrNewData = flagUsedGData == true ? gfilteredData : gData;
        if(arrNewData.length > 0) {
            switch (id) {
                case 1: // reference
                    if(fsi == false) {
                        arrNewData.sort(function(a, b) {
                            if (a.REFERENCE < b.REFERENCE) {
                                return -1;
                            }
                            if (b.REFERENCE < a.REFERENCE) {
                                return 1;
                            }
                            return 0;
                        });
    
                        fsi = true;
                    } else {
                        arrNewData.sort(function(a, b) {
                            if (a.REFERENCE > b.REFERENCE) {
                                return -1;
                            }
                            if (b.REFERENCE > a.REFERENCE) {
                                return 1;
                            }
                            return 0;
                        });

                        fsi = false;
                    }
                    break;
                case 2: //name
                    if(fsn == false) {
                        arrNewData.sort(function(a, b) {
                            if (a.NAME < b.NAME) {
                                return -1;
                            }
                            if (b.NAME < a.NAME) {
                                return 1;
                            }
                            return 0;
                        });
    
                        fsn = true;
                    } else {
                        arrNewData.sort(function(a, b) {
                            if (a.NAME > b.NAME) {
                                return -1;
                            }
                            if (b.NAME > a.NAME) {
                                return 1;
                            }
                            return 0;
                        });
    
                        fsn = false;
                    }
                    break;
                case 3: // price
                    if(fsp == false) {
                        arrNewData.sort(function(a, b) {
                            return parseFloat(a.PRICE) - parseFloat(b.PRICE);
                        });
    
                        fsp = true;
                    } else {
                        arrNewData.sort(function(a, b) {
                            return parseFloat(b.PRICE) - parseFloat(a.PRICE);
                        });
    
                        fsp = false;
                    }
                    break;
                case 4: // sqty
                    if(fsq == false) {
                        arrNewData.sort(function(a, b) {
                            return parseInt(a.UNITS) - parseInt(b.UNITS);
                        });
    
                        fsq = true;
                    } else {
                        arrNewData.sort(function(a, b) {
                            return parseInt(b.UNITS) - parseInt(a.UNITS);
                        });
    
                        fsq = false;
                    }
                    break;
                case 5: // wqty
                    if(fst == false) {
                        arrNewData.sort(function(a, b) {
                            return parseInt(a.TOTAL) - parseInt(b.TOTAL);
                        });
    
                        fst = true;
                    } else {
                        arrNewData.sort(function(a, b) {
                            return parseInt(b.TOTAL) - parseInt(a.TOTAL);
                        });
    
                        fst = false;
                    }
                    break;
                default:
                    break;
            }

            gfilteredData = arrNewData;
            var total = Math.round(arrNewData.length/rowCount);

            var initCountRow = arrNewData.length < rowCount ? arrNewData.length : rowCount;
            var initTotal = arrNewData.length < rowCount ? 1 : total;
    
            if(arrNewData.length > 0) {
                var strInnerHtml = '';
    
                for(var i = 0; i < initCountRow; i++) {
                    strInnerHtml += returnRowHTML(arrNewData[i]);
                }
    
                $('tbody#display-report').html(strInnerHtml);
                $('span#current-rows').html(`Current rows: ${ initCountRow }`);
                $('span#total-rows').html(`Total rows: ${ gData.length }`);
                
    
                $('#pagination-display').val(` ${crrPage} / ${initTotal}`);
            } else {
                $('tbody#display-report').html(`<div class="report-no-data"><p>no data to display</p></div>`);
            }
        }
    } 
});