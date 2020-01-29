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
                            ${ data.barcode }
                        </td>
                        <td style="width: 30%;">
                            ${ data.name }
                        </td>
                        <td style="width: 7%;">
                            $${formatNumber(parseFloat(data.price).toFixed(2)) }
                        </td>
                        <td class="text-info text-center font-weight-bold" 
                          style="width: 7%;">
                            ${ data.qtyC }
                        </td>
                        <td class="text-success text-center font-weight-bold" 
                            style="width: 7%;">
                            ${ data.qtyF }
                        </td>
                        <td class="text-info text-center font-weight-bold" 
                            style="width: 6.5%;">
                            ${ data.c30d }
                        </td>
                        <td class="text-info text-center font-weight-bold" 
                            style="width: 6.5%;">
                            ${ data.c60d }
                        </td>
                        <td class="text-info text-center font-weight-bold" 
                            style="width: 6.5%;">
                            ${ data.c90d }
                        </td>
                        <td class="text-success text-center font-weight-bold" 
                            style="width: 6.5%;">
                            ${ data.f30d }
                        </td>
                        <td class="text-success text-center font-weight-bold" 
                            style="width: 6.5%;">
                            ${ data.f60d }
                        </td>
                        <td class="text-success text-center font-weight-bold" 
                            style="width: 6.5%;">
                            ${ data.f90d }
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
    var url = "/reports/inventorytransfer";
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
          var flagReference = obj.barcode.toLowerCase().indexOf(searchKey) !== -1 ? true : false;
          var flagName = obj.barcode.toLowerCase().indexOf(searchKey) !== -1 ? true : false;
          
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
  var fsb = false, fsn = false, fsp = false, fscq = false, fsfq = false, fc30 = false,
    fc60 = false, fc90 = false, ff30 = false, ff60 = false, ff90 = false;

  this.sortColumn = function(id) {
    crrPage = 1;
    var arrNewData = flagUsedGData == true ? gfilteredData : gData;

    if(arrNewData.length > 0) {
      switch (id) {
        case 1: // reference
          if(fsb == false) {
            arrNewData.sort(function(a, b) {
              if (a.barcode < b.barcode) {
                return -1;
              }
              if (b.barcode < a.barcode) {
                return 1;
              }
              return 0;
            });

            fsb = true;
          } else {
            arrNewData.sort(function(a, b) {
              if (a.barcode > b.barcode) {
                return -1;
              }
              if (b.barcode > a.barcode) {
                return 1;
              }
              return 0;
            });

            fsb = false;
          }
          break;
        case 2: //name
          if(fsn == false) {
            arrNewData.sort(function(a, b) {
              if (a.name < b.name) {
                return -1;
              }
              if (b.name < a.name) {
                return 1;
              }
              return 0;
            });

            fsn = true;
          } else {
            arrNewData.sort(function(a, b) {
              if (a.name > b.name) {
                return -1;
              }
              if (b.name > a.name) {
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
              return parseFloat(a.price) - parseFloat(b.price);
            });

            fsp = true;
          } else {
            arrNewData.sort(function(a, b) {
              return parseFloat(b.price) - parseFloat(a.price);
            });

            fsp = false;
          }
          break;
        case 4: // sqty
          if(fscq == false) {
            arrNewData.sort(function(a, b) {
              return parseInt(a.qtyC) - parseInt(b.qtyC);
            });

            fscq = true;
          } else {
            arrNewData.sort(function(a, b) {
              return parseInt(b.qtyC) - parseInt(a.qtyC);
            });

            fscq = false;
          }
          break;
        case 5: // wqty
          if(fsfq == false) {
            arrNewData.sort(function(a, b) {
              return parseInt(a.qtyF) - parseInt(b.qtyF);
            });

            fsfq = true;
          } else {
            arrNewData.sort(function(a, b) {
              return parseInt(b.qtyF) - parseInt(a.qtyF);
            });

            fsfq = false;
          }
          break;
        case 6: // 30
          if(fc30 == false) {
            arrNewData.sort(function(a, b) {
              return parseInt(a.c30d) - parseInt(b.c30d);
            });

            fc30 = true;
          } else {
            arrNewData.sort(function(a, b) {
              return parseInt(b.c30d) - parseInt(a.c30d);
            });

            fc30 = false;
          }
          break;
        case 7: // 60
          if(fc60 == false) {
            arrNewData.sort(function(a, b) {
              return a.c60d - b.c60d;
            });

            fc60 = true;
          } else {
            arrNewData.sort(function(a, b) {
              return parseInt(b.c60d) - parseInt(a.c60d);
            });

            fc60 = false;
          }
          break;
        case 8: // 90
          if(fc90 == false) {
            arrNewData.sort(function(a, b) {
              return parseInt(a.c90d) - parseInt(b.c90d);
            });

            fc90 = true;
          } else {
            arrNewData.sort(function(a, b) {
              return parseInt(b.c90d) - parseInt(a.c90d);
            });

            fc90 = false;
          }
          break;       
       
        case 9: // 30
          if(ff30 == false) {
            arrNewData.sort(function(a, b) {
              return parseInt(a.f30d) - parseInt(b.f30d);
            });

            ff30 = true;
          } else {
            arrNewData.sort(function(a, b) {
              return parseInt(b.f30d) - parseInt(a.f30d);
            });

            ff30 = false;
          }
          break;
        case 10: // 60
          if(ff60 == false) {
            arrNewData.sort(function(a, b) {
              return a.f60d - b.f60d;
            });

            ff60 = true;
          } else {
            arrNewData.sort(function(a, b) {
              return parseInt(b.f60d) - parseInt(a.f60d);
            });

            ff60 = false;
          }
          break;
        case 11: // 90
          if(ff90 == false) {
            arrNewData.sort(function(a, b) {
              return parseInt(a.f90d) - parseInt(b.f90d);
            });

            ff90 = true;
          } else {
            arrNewData.sort(function(a, b) {
              return parseInt(b.f90d) - parseInt(a.f90d);
            });

            ff90 = false;
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
