$(document).ready(function () {
  mkNotifications({
    positionY: 'top',
    positionX: 'right',
    max: 15,
    scrollable: false
  });

  var gData = [];
  var gfilteredData = [];
  var gSupplier = [];

  var flagUsedGData = false;
  var rowCount = 20;
  var crrPage = 1;

  function returnRowHTML(data) {
    var strRowHTML = `<tr>
                        <td scope="row" style="width: 10%;">
                            ${ data.CODE }
                        </td>
                        <td style="width: 40%;">
                            ${ data.PRODUCTNAME }
                        </td>
                        <td style="width: 8%;">
                            $${formatNumber(data.PRICESELL.toFixed(2)) }
                        </td>
                        <td class="text-info text-center font-weight-bold" style="width: 8%;">
                            ${ data.SALESFLOORUNIT }
                        </td>
                        <td class="text-info text-center font-weight-bold" style="width: 8%;">
                            ${ data.WAREHOUSEUNIT }
                        </td>
                        <td class="text-success text-center font-weight-bold" 
                            style="width: 6.5%;">
                            ${ data.DATA30 }
                        </td>
                        <td class="text-primary text-center font-weight-bold" 
                            style="width: 6.5%;">
                            ${ data.DATA60 }
                        </td>
                        <td class="text-dark text-center font-weight-bold" 
                            style="width: 6.5%;">
                            ${ data.DATA90 }
                        </td>
                        <td class="text-danger text-center font-weight-bold" 
                            style="width: 6.5%;">
                            ${ data.ESTIMATION }
                        </td>
                    </tr>`;

    return strRowHTML;
  }
  function init() {
    EasyLoading.show();

    if ($('tbody#display-report').val() == "") {
      // $('tbody#display-report').html(`<div class="report-got-data"><p>Ready to start</p></div>`);
      $('tbody#display-report').html(`<div class="report-no-data"><p>No data to display</p></div>`);
      $('div#pagination').css("display", "none");
    }

    var method = "GET";
    var url = "/reports/warehousemover";
    var sendData = {}

    returnData(method, url, sendData, callback => {
      EasyLoading.hide();
      if (callback && callback.flag == true) {
        if (callback.data.length > 0) {
          gData = callback.data;
          var strHTML = ``;
          var total = Math.round(gData.length / rowCount);
          var initRowCount = gData.length < rowCount ? gData.length : rowCount;
          var initTotal = gData.length < rowCount -1 ? 1 : total;
          
          for(var i = 0; i < initRowCount; i++) {
            strHTML += returnRowHTML(gData[i]);
        }
  
          $('tbody#display-report').html(strHTML);
          $('div#pagination').css("display", "block");
          $('span#current-rows').html(`Current rows: ${ initRowCount }`);
          $('span#total-rows').html(`Total rows: ${ gData.length }`);
          $('#pagination-display').val(` ${crrPage} / ${initTotal}`);
        } else {
          EasyLoading.hide();
          $('tbody#display-report').html(`<div class="report-no-data"><p>No data to display</p></div>`);
        }
      }
    });
  }
  
  init();

  $('input#table-search').keypress(function (event) { 
    if (event.which == 13) {
      var arrNewData = [];
      var searchKey = $(this).val(); 
      var flagReference = false;
      var flagName = false;

      if(searchKey != "") {
        searchKey = searchKey.toLowerCase();

        for(var obj of gData) {
          var flagReference = obj.CODE.toLowerCase().indexOf(searchKey) !== -1 ? true : false;
          var flagName = obj.CODE.toLowerCase().indexOf(searchKey) !== -1 ? true : false;
          
          if(flagReference == true || flagName == true) {
              arrNewData.push(obj);
          }
        }

        crrPage = 1;

        var total = Math.round(arrNewData.length/rowCount);
        var initRowCount = arrNewData.length < rowCount ? arrNewData.length : rowCount;
        var initTotal = arrNewData.length < rowCount ? 1 : total;

        gfilteredData = arrNewData;
        flagUsedGData = true;

        if(arrNewData.length > 0) {
          var strInnerHtml = '';

          for(var i = 0; i < initRowCount; i++) {
              strInnerHtml += returnRowHTML(arrNewData[i]);
          }

          $('tbody#display-report').html(strInnerHtml);
          $('#pagination-display').val(` ${crrPage} / ${initTotal}`);
          $('span#current-rows').html(`Current rows: ${ initRowCount }`);
          $('span#total-rows').html(`Total rows: ${ arrNewData.length }`);
          $('input#table-search').val('');
          arrNewData = [];
        } else {
            $('tbody#display-report').html(`<div class="report-no-data"><p>No data to display</p></div>`);
        }
      } else {
        init();
      }

      event.preventDefault();
    }
  });

  this.firstPage = function() {
    crrPage = 1;
    var strInnerHtml = '';
    var arrNewData = flagUsedGData == true ? gfilteredData : gData;
    var total = Math.round(arrNewData.length / rowCount);

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
  var fsc = false, fsn = false, fsp = false, fssq = false, fswq = false, fs15 = false,
    fs30 = false, fs60 = false, fs90 = false, fs120 = false, fs180 = false,
    fs365 = false, fsd = false;

  this.sortColumn = function(id) {
    crrPage = 1;
    var arrNewData = flagUsedGData == true ? gfilteredData : gData;

    if(arrNewData.length > 0) {
      switch (id) {
        case 1: // reference
          if(fsc == false) {
            arrNewData.sort(function(a, b) {
              if (a.CODE < b.CODE) {
                return -1;
              }
              if (b.CODE < a.CODE) {
                return 1;
              }
              return 0;
            });

            fsc = true;
          } else {
            arrNewData.sort(function(a, b) {
              if (a.CODE > b.CODE) {
                return -1;
              }
              if (b.CODE > a.CODE) {
                return 1;
              }
              return 0;
            });

            fsr = false;
          }
          break;
        case 2: //name
          if(fsn == false) {
            arrNewData.sort(function(a, b) {
              if (a.PRODUCTNAME < b.PRODUCTNAME) {
                return -1;
              }
              if (b.PRODUCTNAME < a.PRODUCTNAME) {
                return 1;
              }
              return 0;
            });

            fsn = true;
          } else {
            arrNewData.sort(function(a, b) {
              if (a.PRODUCTNAME > b.PRODUCTNAME) {
                return -1;
              }
              if (b.PRODUCTNAME > a.PRODUCTNAME) {
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
              return parseFloat(a.PRICESELL) - parseFloat(b.PRICESELL);
            });

            fsp = true;
          } else {
            arrNewData.sort(function(a, b) {
              return parseFloat(b.PRICESELL) - parseFloat(a.PRICESELL);
            });

            fsp = false;
          }
          break;
        case 4: // sqty
          if(fssq == false) {
            arrNewData.sort(function(a, b) {
              return parseInt(a.SALESFLOORUNIT) - parseInt(b.SALESFLOORUNIT);
            });

            fssq = true;
          } else {
            arrNewData.sort(function(a, b) {
              return parseInt(b.SALESFLOORUNIT) - parseInt(a.SALESFLOORUNIT);
            });

            fssq = false;
          }
          break;
        case 5: // wqty
          if(fswq == false) {
            arrNewData.sort(function(a, b) {
              return parseInt(a.WAREHOUSEUNIT) - parseInt(b.WAREHOUSEUNIT);
            });

            fswq = true;
          } else {
            arrNewData.sort(function(a, b) {
              return parseInt(b.WAREHOUSEUNIT) - parseInt(a.WAREHOUSEUNIT);
            });

            fswq = false;
          }
          break;
        case 6: // 30
          if(fs30 == false) {
            arrNewData.sort(function(a, b) {
              return parseInt(a.DATA30) - parseInt(b.DATA30);
            });

            fs30 = true;
          } else {
            arrNewData.sort(function(a, b) {
              return parseInt(b.DATA30) - parseInt(a.DATA30);
            });

            fs30 = false;
          }
          break;
        case 7: // 60
          if(fs60 == false) {
            arrNewData.sort(function(a, b) {
              return a.DATA60 - b.DATA60;
            });

            fs60 = true;
          } else {
            arrNewData.sort(function(a, b) {
              return parseInt(b.DATA60) - parseInt(a.DATA60);
            });

            fs60 = false;
          }
          break;
        case 8: // 90
          if(fs90 == false) {
            arrNewData.sort(function(a, b) {
              return parseInt(a.DATA90) - parseInt(b.DATA90);
            });

            fs90 = true;
          } else {
            arrNewData.sort(function(a, b) {
              return parseInt(b.DATA90) - parseInt(a.DATA90);
            });

            fs90 = false;
          }
          break;       
        case 9: // days
          if(fsd == false) {
            arrNewData.sort(function(a, b) {
              return parseInt(a.ESTIMATION) - parseInt(b.ESTIMATION);
            });

            fsd = true;
          } else {
            arrNewData.sort(function(a, b) {
              return parseInt(b.ESTIMATION) - parseInt(a.ESTIMATION);
            });

            fsd = false;
          }
          break;
        default:
            break;
      }

      flagUsedGData = true;
      gfilteredData = arrNewData;

      var total = Math.round(arrNewData.length/rowCount);
      var initRowCount = arrNewData.length < rowCount ? arrNewData.length : rowCount;
      var initTotal = arrNewData.length < rowCount ? 1 : total;

      if(arrNewData.length > 0) {
        var strInnerHtml = '';

        for(var i = 0; i < initRowCount; i++) {
          strInnerHtml += returnRowHTML(arrNewData[i]);
        }

        $('tbody#display-report').html(strInnerHtml);
        $('span#current-rows').html(`Current rows: ${ initRowCount }`);
        $('span#total-rows').html(`Total rows: ${ gfilteredData.length }`);
        
        $('#pagination-display').val(` ${crrPage} / ${initTotal}`);
      } else {
          $('tbody#display-report').html(`<div class="report-no-data"><p>No data to display</p></div>`);
      }
    }
  }
});
