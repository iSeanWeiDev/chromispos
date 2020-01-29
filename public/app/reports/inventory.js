$(document).ready(function () {
  var gData = [];
  var gfilteredData = [];
  var gSupplier = [];

  var flagUsedGData = false;
  var rowCount = 20;
  var crrPage = 1;

  mkNotifications({
    positionY: 'top',
    positionX: 'right',
    max: 15,
    scrollable: false
  });

  function returnRowHTML(data) {
    if (data.SUPPLIERID == null || data.SUPPLIERID == undefined) {
      var supplierName = "Null";
    } else {
      for (var obj of gSupplier) {
        if (obj.ID == data.SUPPLIERID) {
          var supplierName = obj.SUPPLIERNAME;
        }
      }
    }
    var strRowHTML = `<tr>
                        <td scope="row" style="width: 10%;">
                            ${ data.REFERENCE }
                        </td>
                        <td style="width: 30%;">
                            <i class="fa fa-search-plus" style="color: #03a9f4!important; font-weight: 400 !important; cursor: pointer!important;" 
                                onclick="getModalData(${"'"+data.PRODUCTID+"'"}, ${"'"+data.CATEGORYID+"'"})"
                                data-toggle="modal" 
                                data-target="#modal-${data.PRODUCTID}-${data.CATEGORYID}"/>
                            &nbsp;&nbsp;
                            ${ data.PRODUCTNAME }
                        </td>
                        <td style="width: 6%;">
                            $${formatNumber(data.PRICESELL.toFixed(2)) }
                        </td>
                        <th class="text-info p-1" 
                            style="width: 6%;">
                            ${data.CATEGORYNAME.substring(0, 8)}
                        </th>
                        <th class="text-info p-1" 
                            style="width: 6%;">
                            ${supplierName}
                        </th>
                        <td class="text-info text-center font-weight-bold" style="width: 5%;">
                            ${ data.SALESFLOORUNIT }
                        </td>
                        <td class="text-info text-center font-weight-bold" style="width: 5%;">
                            ${ data.WAREHOUSEUNIT }
                        </td>
                        <td class="text-info text-center font-weight-bold" 
                            style="width: 4%;">
                            ${ data.DATA15 }
                        </td>
                        <td class="text-success text-center font-weight-bold" 
                            style="width: 4%;">
                            ${ data.DATA30 }
                        </td>
                        <td class="text-primary text-center font-weight-bold" 
                            style="width: 4%;">
                            ${ data.DATA60 }
                        </td>
                        <td class="text-dark text-center font-weight-bold" 
                            style="width: 4%;">
                            ${ data.DATA90 }
                        </td>
                        <td class="text-success text-center font-weight-bold" 
                            style="width: 4%;">
                            ${ data.DATA120 }
                        </td>
                        <td class="text-primary text-center font-weight-bold" 
                            style="width: 4%;">
                            ${ data.DATA180 }
                        </td>
                        <td class="text-dark text-center font-weight-bold" 
                            style="width: 4%;">
                            ${ data.DATA365 }
                        </td>
                        <td class="text-danger text-center font-weight-bold" 
                            style="width: 4%;">
                            ${ data.ESTIMATION }
                        </td>
                    </tr>`;
    return strRowHTML;
  }

  function returnModalHTML(productID, categoryID) {
    var productName = '';
    for(var obj of gData) {
      if(obj.PRODUCTID == productID) {
        productName = obj.PRODUCTNAME;
      }
    }
    var strModalHTML = `<div class="modal fade" 
                          id="modal-${productID}-${categoryID}"
                          tabindex="-1" 
                          role="dialog" 
                          aria-hidden="true">
                          
                          <div class="modal-dialog modal-right" 
                            role="document">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h4 class="modal-title font-weight-bold text-info">
                                    ${ productName }
                                </h4>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                              </div>
                              <div class="modal-body">
                                <div class="container-fluid">
                                  <div class="report-body-content">
                                    <hr class="p-0 m-0 text-info" style="border-top: 3px solid #03a9f4!important;">
                                    
                                    <table class="table table-fixed table-hover m-0" id="report-table">
                                      <thead>
                                        <tr style="font-size:17px">
                                          <th onclick=""
                                            class="text-center text-dark font-weight-bold p-1 sortStyle" 
                                            style="width: 20%;">
                                            Date
                                          </th>
                                          <th onclick=""
                                            class="text-center text-dark font-weight-bold p-1 sortStyle" 
                                            style="width: 20%;">
                                            Order Number
                                          </th>
                                          <th onclick=""
                                            class="text-center text-dark font-weight-bold p-1 sortStyle"
                                            style="width: 20%;">
                                            QTY in Order
                                          </th>
                                          <th onclick=""
                                            class="text-center text-dark font-weight-bold p-1 sortStyle" 
                                            style="width: 20%;">
                                            Price in Order
                                          </th>
                                          <th onclick=""
                                            class="text-center text-dark font-weight-bold p-1 sortStyle" 
                                            style="width: 20%;">
                                            Total Sales
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody id="modal-table-body-${productID}-${categoryID}">
                                        <!-- Add body dynamically -->
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                              <div class="modal-footer">
                                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                  <button type="button" class="btn btn-primary">Save</button>
                              </div>
                            </div>
                          </div>`;
    return strModalHTML;
  }

  function returnModalBodyHTML(data) {
    var strModalBodyHTML =  `<tr style="font-size:15px;">
                              <td scope="row"
                                class="p-1 text-center" 
                                style="width: 20%;">
                                ${ data.DATENEW }
                              </td>
                              <td class="p-1 text-center"
                                style="width: 20%;">
                                ${ data.TICKETID }
                              </td>
                              <td class="p-1 text-center"
                                style="width: 20%;">
                                ${formatNumber(data.units) }
                              </td>
                              <td class="p-1 text-center"
                                style="width: 20%;">
                                $${ formatNumber(data.price.toFixed(2)) }
                              </td>
                              <td class="p-1 text-center"
                                style="width: 20%;">
                                $${ formatNumber(data.TOTAL.toFixed(2)) }
                              </td>
                          </tr>`;

        return strModalBodyHTML;
  }

  function getCategoryList() {
    var method = "GET";
    var url = "/reports/categories";
    var sendData = {
      report: 'inventory',
    }

    returnData(method, url, sendData, callback => {
      var arrCategory = callback.data;

      arrCategory.sort(function(a, b) {
        if (a.NAME < b.NAME) { return -1 };
        if (b.NAME < a.NAME) { return 1 };

        return 0;
      });

      if(callback && callback.flag == true) {
        var strInnerHtml = `<option value="all" selected> All Categories </option>`;

        for(var obj of arrCategory) {
          if(obj.NAME != "") {
            strInnerHtml += `<option value="${obj.ID}">${obj.NAME}</option>`;
          }
        }

        $('select#category').html(strInnerHtml);
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

  function getSupplierList() {
    gSupplier = [];
    var method = "GET";
    var url = "/reports/suppliers";
    var sendData = {
      report: 'inventory',
    }

    returnData(method, url, sendData, callback => {
      var arrSupplier = callback.data;

      arrSupplier.sort(function(a, b) {
          if (a.SUPPLIERNAME < b.SUPPLIERNAME) { return -1 };
          if (b.SUPPLIERNAME < a.SUPPLIERNAME) { return 1 };

          return 0;
      });
      gSupplier = arrSupplier;
      if(callback && callback.flag == true) {
        var strInnerHtml = `<option value="all" selected> All Suppliers </option>`;

        for(var obj of arrSupplier) {
            if(obj.NAME != "") {
                strInnerHtml += `<option value="${obj.ID}">${obj.SUPPLIERNAME}</option>`;
            }
        }
        strInnerHtml += `<option value="none">No supplier</option>`;
        $('select#supplier').html(strInnerHtml);
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

  function customEventCapture(method, url, sendData) {
    gData = [];
    gfilteredData = [];
    flagUsedGData = false;
    EasyLoading.show();

    // if ($('tbody#display-report').val() == "") {
    //   $('tbody#display-report').html(`<div class="report-no-data"><p>No data to display</p></div>`);
    //   $('div#pagination').css("display", "none");
    // }

    returnData(method, url, sendData, callback => {
      EasyLoading.hide();

      if (callback && callback.flag == true) {
        if (callback.data.length > 0) {
          gData = callback.data;
          var total = Math.round(gData.length / rowCount);
          var initRowCount = gData.length < rowCount ? gData.length : rowCount;
          var initTotal = gData.length < rowCount -1 ? 1 : total;
          var strHTML = '';
  
          for (var i = 0; i < initRowCount; i++) {
            strHTML += returnRowHTML(gData[i]);
          }
  
          $('tbody#display-report').html(strHTML);
          $('div#pagination').css("display", "block");
          $('span#current-rows').html(`Current rows: ${ initRowCount }`);
          $('span#total-rows').html(`Total rows: ${ gData.length }`);
          $('#pagination-display').val(` ${crrPage} / ${initTotal}`);
        } else {
          $('tbody#display-report').html(`<div class="report-no-data"><p>No data to display</p></div>`);
        }
        
      } else {
        EasyLoading.hide();
        $('tbody#display-report').html(`<div class="report-no-data"><p>No data to display</p></div>`);
      }
    });
  }

  function init() {
    // EasyLoading.show();
    gData = [];
    if ($('tbody#display-report').val() == "") {
      $('tbody#display-report').html(`<div class="report-got-data"><p>Ready to start</p></div>`);
      // $('tbody#display-report').html(`<div class="report-no-data"><p>No data to display</p></div>`);
      $('div#pagination').css("display", "none");
    }

    // var method = "GET";
    // var url = '/reports/inventory';
    // var sendData = {
    //   category: "all",
    //   supplier: "all"
    // }

    getCategoryList();
    getSupplierList();
    // customEventCapture(method, url, sendData);
  }

  init();
  this.runReport = function() {
    gData = [];
    var method = "GET";
    var url = "/reports/inventory";
    var sendData = {
      category: $('select#category').val().toString(),
      supplier: $('select#supplier').val().toString(),
    }

    customEventCapture(method, url, sendData);
  }
  
  this.getModalData = function(productID, categoryID) {
    var strModalHTML = returnModalHTML(productID, categoryID);
    $('div#modal-content').html(strModalHTML);

    var method = "GET";
    var url = "/reports/inventory/items/history";
    var sendData = {
      productID: productID,
      categoryID: categoryID,
    }

    returnData(method, url, sendData, callback => {
      if (callback && callback.flag == true) {
        var strInnerHtml = '';
        for (var i=0; i<callback.data.length; i++) {
          strInnerHtml += returnModalBodyHTML(callback.data[i]);
        }

        $(`tbody[id*='modal-table-body-${productID}-${categoryID}']`)
          .html(strInnerHtml);
      } else {
        EasyLoading.hide();
        $(`tbody[id*='modal-table-body-${productID}-${categoryID}']`)
          .html(`<div class="report-no-data"><p>No data to display</p></div>`);
      }
    });
  }

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

  $('select#category').change(function (e) {
    // var method = "GET";
    // var url = "/reports/inventory";
    // var sendData = {
    //   category: $('select#category').val().toString(),
    //   supplier: $('select#supplier').val().toString(),
    // }

    // customEventCapture(method, url, sendData);
    // e.preventDefault();
  });

  $('select#supplier').change(function (e) {
    // var method = "GET";
    // var url = "/reports/inventory";
    // var sendData = {
    //   category: $('select#category').val().toString(),
    //   supplier: $('select#supplier').val().toString(),
    // }

    // customEventCapture(method, url, sendData);
  //   e.preventDefault();
  });

  $('input#table-search').keypress(function (e) { 
    if (event.which == 13) {
      var arrNewData = [];
      var searchKey = $(this).val(); 
      var flagReference = false;
      var flagName = false;

      if(searchKey != "") {
        searchKey = searchKey.toLowerCase();

        for(var obj of gData) {
          var flagReference = obj.CODE.toLowerCase().indexOf(searchKey) !== -1 ? true : false;
          var flagName = obj.PRODUCTNAME.toLowerCase().indexOf(searchKey) !== -1 ? true : false;
          
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

  var fsr = false, fsn = false, fsp = false, fssq = false, fswq = false, fs15 = false,
      fs30 = false, fs60 = false, fs90 = false, fs120 = false, fs180 = false,
      fs365 = false, fsd = false;
  this.sortColumn = function(id) {
    crrPage = 1;
    var arrNewData = flagUsedGData == true ? gfilteredData : gData;
    
    if(arrNewData.length > 0) {
      switch (id) {
        case 1: // reference
          if(fsr == false) {
            arrNewData.sort(function(a, b) {
              if (a.REFERENCE < b.REFERENCE) {
                return -1;
              }
              if (b.REFERENCE < a.REFERENCE) {
                return 1;
              }
              return 0;
            });

            fsr = true;
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
        case 6: // 15
          if(fs15 == false) {
            arrNewData.sort(function(a, b) {
              return parseInt(a.DATA15) - parseInt(b.DATA15);
            });

            fs15 = true;
          } else {
            arrNewData.sort(function(a, b) {
              return parseInt(b.DATA15) - parseInt(a.DATA15);
            });

            fs15 = false;
          }
          break;
        case 7: // 30
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
        case 8: // 60
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
        case 9: // 90
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
        case 10: // 120
          if(fs120 == false) {
            arrNewData.sort(function(a, b) {
              return parseInt(a.DATA120) - parseInt(b.DATA120);
            });

            fs120 = true;
          } else {
            arrNewData.sort(function(a, b) {
              return parseInt(b.DATA120) - parseInt(a.DATA120);
            });

            fs120 = false;
          }
          break;
        case 11: // 90
          if(fs180 == false) {
            arrNewData.sort(function(a, b) {
              return parseInt(a.DATA180) - parseInt(b.DATA180);
            });

            fs180 = true;
          } else {
            arrNewData.sort(function(a, b) {
              return parseInt(b.DATA180) - parseInt(a.DATA180);
            });

            fs180 = false;
          }
          break;
        case 12: // 90
          if(fs365 == false) {
            arrNewData.sort(function(a, b) {
              return parseInt(a.DATA365) - parseInt(b.DATA365);
            });

            fs365 = true;
          } else {
            arrNewData.sort(function(a, b) {
              return parseInt(b.DATA365) - parseInt(a.DATA365);
            });

            fs365 = false;
          }
          break;
        case 13: // days
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
          $('tbody#display-report').html(`<div class="report-no-data"><p>no data to display</p></div>`);
      }
    }
  }
});
