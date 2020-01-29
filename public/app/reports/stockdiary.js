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
  var rowCount = 15;
  var crrPage = 1;
  var gEditedRow = [];
  var gCatertories = [];
  var gSuppliers = [];

  function returnRowHTML(data) {
    var salesFloorUnit = data.SALESFLOORUNIT != "##" ? data.SALESFLOORUNIT : "-";
    var wareHouseUnit = data.WAREHOUSEUNIT != "##" ? data.WAREHOUSEUNIT : "-";

    // Category append text.
    var strAppendCategory = `<select class="custom-select" name="" id="select-category-${data.PRODUCTID}-${data.CATEGORYID}">
                              <option value="0">
                                  NONE
                              </option>`;
    for (var obj of gCatertories) {
      if (obj.ID == data.CATEGORYID) {
        strAppendCategory += (`<option value="${obj.ID}" selected>
                                  ${obj.NAME}
                              </option>`);
      } else {
        strAppendCategory += (`<option value="${obj.ID}">
                                  ${obj.NAME}
                              </option>`);
      }
    
    }
    strAppendCategory += (`</select></div>`);

    // Supplier append text.
    var strAppendSupplier = `<select class="custom-select" name="" id="select-supplier-${data.PRODUCTID}-${data.CATEGORYID}">
                              <option value="0">
                                  NONE
                              </option>`;
    for (var obj of gSuppliers) {
      if (obj.ID == data.SUPPLIER) {
        strAppendSupplier += (`<option value="${obj.ID}" selected>
                    ${obj.SUPPLIERNAME}
                </option>`);
      } else {
        strAppendSupplier += (`<option value="${obj.ID}">
                    ${obj.SUPPLIERNAME}
                </option>`);
      }
    }
    strAppendSupplier += (`</select></div>`);

    var strHTML = ` <tr onclick="editRow(${"'"+data.PRODUCTID+"'"}, ${"'"+data.CATEGORYID+"'"})"
                      onkeypress="trKeypressEvent(${"'"+data.PRODUCTID+"'"}, ${"'"+data.CATEGORYID+"'"})"
                      id="tr-row-${data.PRODUCTID}-${data.CATEGORYID}">

                      <td scope="row" style="width: 15%;">
                          <input type="text" 
                              id="input-row-ref-${data.PRODUCTID}-${data.CATEGORYID}"
                              class="table-row-edit-disabled"
                              value="${ data.REFERENCE }" disabled>
                      </td>

                      <td style="width: 32%;">
                          <input type="text" 
                              id="input-row-pname-${data.PRODUCTID}-${data.CATEGORYID}"
                              class="table-row-edit-disabled"
                              value="${ data.PRODUCTNAME.replace('"', `'`) }" disabled>
                      </td>

                      <td style="width: 8%;">
                          <input type="text" 
                              id="input-row-rprice-${data.PRODUCTID}-${data.CATEGORYID}"
                              class="table-row-edit-disabled text-center font-weight-bold"
                              value="$${formatNumber(parseFloat(data.PRICESELL).toFixed(2)) }" disabled>
                      </td> 
                      
                      <td style="width: 10%" id="category-${data.PRODUCTID}-${data.CATEGORYID}">
                        ${strAppendCategory}
                      </td>
                      
                      <td style="width: 10%" id="supplier-${data.PRODUCTID}-${data.CATEGORYID}">
                        ${strAppendSupplier}
                      </td>

                      <td id="td-row-sqty-${data.PRODUCTID}-${data.CATEGORYID}"
                          style="width: 7.5%;">
                          <input type="text" 
                              id="input-row-sqty-${data.PRODUCTID}-${data.CATEGORYID}"
                              class="table-row-edit-disabled text-center font-weight-bold"
                              value="${ salesFloorUnit }" disabled>
                      </td>

                      <td id="td-row-wqty-${data.PRODUCTID}-${data.CATEGORYID}"
                          style="width: 7.5%;">
                          <input type="text" 
                              id="input-row-wqty-${data.PRODUCTID}-${data.CATEGORYID}"
                              class="table-row-edit-disabled text-center font-weight-bold"
                              value="${ wareHouseUnit }" disabled>
                      </td>

                      <td class="text-left"
                          style="width: 10%">
                          <button onclick="saveRow(${"'"+data.PRODUCTID+"'"}, ${"'"+data.CATEGORYID+"'"})" 
                              id="btn-save-row-${data.PRODUCTID}-${data.CATEGORYID}"
                              class="btn btn-outline-success btn-sm pl-2 pr-2 pt-1 pb-1 mb-2"
                              style="display: none">
                              <i class="fa fa-floppy-o" />
                              SAVE
                          </button>

                          <button onclick="editRow(${"'"+data.PRODUCTID+"'"}, ${"'"+data.CATEGORYID+"'"})" 
                              id="btn-edit-row-${data.PRODUCTID}-${data.CATEGORYID}"
                              class="btn btn-outline-info btn-sm pl-2 pr-2 pt-1 pb-1 mb-0"
                              style="display: inline-block">
                              <i class="fa fa-edit" />
                              Edit
                          </button>
                      </td>
                  </tr>`;      

    return strHTML;
  }

  function updateData(productID, categoryID) {
    var wasNullSale = gEditedRow[0].SALESFLOORUNIT == "##" ? true : false;
    var wasNullWare = gEditedRow[0].WAREHOUSEUNIT == "##" ? true : false;

    var sendData = {
      productID: productID,
      categoryID: categoryID,
      valRef: $(`input[id*='input-row-ref-${productID}-${categoryID}']`).val(),
      valName: $(`input[id*='input-row-pname-${productID}-${categoryID}']`).val(),
      valPrice: $(`input[id*='input-row-rprice-${productID}-${categoryID}']`).val(),
      wasNullSale: wasNullSale,
      wasNullWare: wasNullWare,
      valSale: $(`input[id*='input-row-sqty-${productID}-${categoryID}']`).val(),
      valWare: $(`input[id*='input-row-wqty-${productID}-${categoryID}']`).val(),
      changedSupplierID: $(`select[id*='select-supplier-${productID}-${categoryID}']`).val(),
      changedCategoryID: $(`select[id*='select-category-${productID}-${categoryID}']`).val(),
    }

    if (getObjectSize(sendData) > 0) {
      EasyLoading.show();
      var method = "POST";
      var url = "/reports/stockdiary";
      returnData(method, url, sendData, callback => {
        EasyLoading.hide();
        if(callback && callback.flag == true) {
          $(`button[id*='btn-save-row-${productID}-${categoryID}']`).css("display", "none");
          $(`button[id*='btn-cancel-row-${productID}-${categoryID}']`).css("display", "none");
          $(`button[id*='btn-edit-row-${productID}-${categoryID}']`).css("display", "inline-block");

          if (flagUsedGData == true) {
            for (var obj of gfilteredData) {
              if (obj.CATEGORYID == categoryID && obj.PRODUCTID == productID) {
                var saleUnit = $(`input[id*='input-row-sqty-${productID}-${categoryID}']`).val() == "" 
                                ? "##" : $(`input[id*='input-row-sqty-${productID}-${categoryID}']`).val();
                var wareUnit = $(`input[id*='input-row-wqty-${productID}-${categoryID}']`).val() == ""
                                ? "##" : $(`input[id*='input-row-wqty-${productID}-${categoryID}']`).val();
                obj.CATEGORYID = categoryID;
                obj.PRODUCTID = productID;
                obj.PRICESELL = $(`input[id*='input-row-rprice-${productID}-${categoryID}']`).val();
                obj.PRODUCTNAME = $(`input[id*='input-row-pname-${productID}-${categoryID}']`).val();
                obj.REFERENCE = $(`input[id*='input-row-ref-${productID}-${categoryID}']`).val()
                obj.SALESFLOORUNIT = saleUnit;
                obj.WAREHOUSEUNIT = wareUnit;
              }
            }
          }

          $(`input[id*='input-row-ref-${productID}-${categoryID}']`)
              .addClass('table-row-edit-disabled')
              .removeClass('table-row-edit-enabled')
              .prop("disabled", true);

          $(`input[id*='input-row-pname-${productID}-${categoryID}']`)
              .addClass('table-row-edit-disabled')
              .removeClass('table-row-edit-enabled')
              .prop("disabled", true);

          $(`input[id*='input-row-rprice-${productID}-${categoryID}']`)
              .addClass('table-row-edit-disabled')
              .removeClass('table-row-edit-enabled')
              .prop("disabled", true);
          var replacedRetailPrice = "$"+$(`input[id*='input-row-rprice-${productID}-${categoryID}']`).val(); 
          $(`input[id*='input-row-rprice-${productID}-${categoryID}']`)
              .prop("type", "text")
              .val(replacedRetailPrice);

          $(`input[id*='input-row-sqty-${productID}-${categoryID}']`)
              .addClass('table-row-edit-disabled')
              .removeClass('table-row-edit-enabled')
              .prop("disabled", true);

          $(`input[id*='input-row-wqty-${productID}-${categoryID}']`)
              .addClass('table-row-edit-disabled')
              .removeClass('table-row-edit-enabled')
              .prop("disabled", true);

          $(`td[id*='td-row-qty-${productID}-${categoryID}']`).children().remove();

          if(flagUsedGData == true) {
            for(var obj of gfilteredData) {
              if(obj.CATEGORYID == categoryID && obj.PRODUCTID == productID) {
                  var saleUnitDisable = obj.SALESFLOORUNIT == "##" ? "-" : obj.SALESFLOORUNIT;
                  var wareUnitDisable = obj.WAREHOUSEUNIT == "##" ? "-" : obj.WAREHOUSEUNIT;

                  $(`td[id*='td-row-sqty-${productID}-${categoryID}']`).html(`<input type="text" 
                                                                          id="input-row-sqty-${obj.PRODUCTID}-${obj.CATEGORYID}"
                                                                          class="table-row-edit-disabled text-center font-weight-bold"
                                                                          value="${ saleUnitDisable }" disabled>`);
                  $(`td[id*='td-row-wqty-${productID}-${categoryID}']`).html(`<input type="text" 
                                                                          id="input-row-wqty-${obj.PRODUCTID}-${obj.CATEGORYID}"
                                                                          class="table-row-edit-disabled text-center font-weight-bold"
                                                                          value="${ wareUnitDisable }" disabled>`);
              }
            }
          }
          $(`tr[id*='tr-row-${productID}-${categoryID}']`).children().children()
              .css("color", "green")
              .css("font-weight", "bold");
              
          $(`button[id*='btn-edit-row-${productID}-${categoryID}']`).parent().html('<p class="font-weight-bold pt-1" style="color:green;">SAVED</p>');
          $(`button[id*='btn-edit-row-${productID}-${categoryID}']`).remove();   

          $('input#table-search').focus().select();
          gEditedRow = [];
        }
      });
    }
  }

  function getCategoryList() {
    var method = "GET";
    var url = "/reports/stockdiary/categories";
    var sendData = {}

    returnData(method, url, sendData, callback => {
      if (callback && callback.flag == true) {
        gCatertories = callback.data;
      } else {
        gCatertories = [];
      }
    });
  }

  function getSupplierList() {
    var method = "GET";
    var url = "/reports/stockdiary/suppliers";
    var sendData = {}
    returnData(method, url, sendData, callback => {
      if (callback && callback.flag == true) {
        gSuppliers = callback.data;
      } else {
        gSuppliers = [];
      }
    });
  }

  function init() {
    gCatertories = [];
    gSuppliers = [];
    EasyLoading.show();
    var method = "GET";
    var url = "/reports/stockdiary";
    var sendData = {
      report: "stockdiary",
    }

    returnData(method, url, sendData, callback => {
      EasyLoading.hide();
      gData = callback.data;

      if(gData.length > 0) {
        $('input#table-search').focus();

        $('tbody#display-report').html(`<div class="report-got-data text-center"><p>Ready to start the work!</p></div>`);
      }  else {
          $('tbody#display-report').html(`<div class="report-no-data text-center"><p>Product not found</p></div>`);
      }
    });

    getCategoryList();
    getSupplierList();
  }

  init(); 
  $('div#pagination').css("display", "none");
  
  if ($('tbody#display-report').val() == "") {
    $('tbody#display-report').html(`<div class="report-no-data text-center"><p>Product not found</p></div>`);
  }

  $('input#table-search').keypress(function(e) {
    if (event.which == 13) {
      var arrNewData = [];
      var searchKey = $(this).val().toLowerCase(); 
      var flagReference = false;
      var flagName = false;
      if(searchKey != "") {
        for(var obj of gData) {
          var flagReference = obj.CODE.toLowerCase().indexOf(searchKey) !== -1 ? true : false;
          var flagName = obj.PRODUCTNAME.toLowerCase().indexOf(searchKey) !== -1 ? true : false;
          
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

        if (arrNewData.length > 0) {
          $('div#pagination').css("display", "block");
          var strInnerHtml = '';

          for(var i=0; i<initCountRow; i++) {
              strInnerHtml += returnRowHTML(arrNewData[i]);
          }

          $('tbody#display-report').html(strInnerHtml);
          $('#pagination-display').val(` ${crrPage} / ${initTotal}`);
          $('span#current-rows').html(`Current rows: ${ initCountRow }`);
          $('span#total-rows').html(`Total rows: ${ arrNewData.length }`);

          $('input#table-search').val("");
          gEditedRow = [];

          // $('button#btn-save-row-'+arrNewData[0].PRODUCTID+'-'+arrNewData[0].CATEGORYID).css("display", "inline-block");
          // $('button#btn-cancel-row-'+arrNewData[0].PRODUCTID+'-'+arrNewData[0].CATEGORYID).css("display", "inline-block");
          $(`button[id*='btn-save-row-${arrNewData[0].PRODUCTID}-${arrNewData[0].CATEGORYID}']`).css("display", "inline-block");
          $(`button[id*='btn-cancel-row-${arrNewData[0].PRODUCTID}-${arrNewData[0].CATEGORYID}']`).css("display", "inline-block");
          
          $(`button[id*='btn-edit-row-${arrNewData[0].PRODUCTID}-${arrNewData[0].CATEGORYID}']`).css("display", "none");

          $(`input[id*='input-row-ref-${arrNewData[0].PRODUCTID}-${arrNewData[0].CATEGORYID}']`)
              .removeClass('table-row-edit-disabled')
              .addClass('table-row-edit-enabled')
              .prop("disabled", true);

          $(`input[id*='input-row-pname-${arrNewData[0].PRODUCTID}-${arrNewData[0].CATEGORYID}']`)
              .removeClass('table-row-edit-disabled')
              .addClass('table-row-edit-enabled')
              .prop("disabled", false);

          $(`input[id*='input-row-rprice-${arrNewData[0].PRODUCTID}-${arrNewData[0].CATEGORYID}']`)
              .removeClass('table-row-edit-disabled')
              .addClass('table-row-edit-enabled')
              .prop("disabled", false);

          var replacedRetailPrice = $(`input[id*='input-row-rprice-${arrNewData[0].PRODUCTID}-${arrNewData[0].CATEGORYID}']`).val().replace("$", "").replace(",", ""); 
          $(`input[id*='input-row-rprice-${arrNewData[0].PRODUCTID}-${arrNewData[0].CATEGORYID}']`)
              .prop("type", "number")
              .val(parseFloat(replacedRetailPrice));

          $(`input[id*='input-row-sqty-${arrNewData[0].PRODUCTID}-${arrNewData[0].CATEGORYID}']`)
              .removeClass('table-row-edit-disabled')
              .addClass('table-row-edit-enabled')
              .prop("disabled", false)
              .prop("type", "number");

          $(`input[id*='input-row-wqty-${arrNewData[0].PRODUCTID}-${arrNewData[0].CATEGORYID}']`)
              .removeClass('table-row-edit-disabled')
              .addClass('table-row-edit-enabled')
              .prop("disabled", false)
              .prop("type", "number");


          for(var obj of gData) {
            if(obj.CATEGORYID == arrNewData[0].CATEGORYID && obj.PRODUCTID == arrNewData[0].PRODUCTID) {
                gEditedRow.push(obj);
            }
          }
          $(`input[id*='input-row-sqty-${arrNewData[0].PRODUCTID}-${arrNewData[0].CATEGORYID}']`).focus().select();

          arrNewData = [];
        } else {
          $('div#pagination').css("display", "none");
          $('tbody#display-report').html(`<div class="report-no-data text-center"><p>Product not found</p></div>`);
        }
      } else {
        gData = [];
        gfilteredData = [];
        flagUsedGData = false;
        crrPage = 1;

        init();
      }
    }
  });

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

  this.previousPage = function () {
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
    var arrNewData = flagUsedGData == true ? gfilteredData : gData;
    var total = Math.round(arrNewData.length/rowCount);
    crrPage++;

    if(crrPage <= total) {
      var strInnerHtml = '';
      var newRow = arrNewData.length-crrPage*rowCount < rowCount ? arrNewData.length : crrPage*rowCount;

      for(var i=(crrPage-1)*rowCount; i < newRow; i++) {
          strInnerHtml += returnRowHTML(arrNewData[i]);
      }
      $('tbody#display-report').html(strInnerHtml);
      $('span#current-rows').html(`Current rows: ${ arrNewData.length-(crrPage-1)*rowCount > rowCount ? rowCount : arrNewData.length-(crrPage-1)*rowCount }`);
      $('#pagination-display').val(` ${crrPage} / ${total}`);
    } else {
      crrPage = total;
    }
  }

  this.lastPage = function () {
    var strInnerHtml = '';
    var arrNewData = flagUsedGData == true ? gfilteredData : gData;
    var total = Math.round(arrNewData.length/rowCount);
    crrPage = total;
    var newRow = arrNewData.length-crrPage*rowCount < rowCount ? arrNewData.length : crrPage*rowCount;

    for(var i=(crrPage-1)*rowCount; i < newRow; i++) {
        strInnerHtml += returnRowHTML(arrNewData[i]);
    }
    $('tbody#display-report').html(strInnerHtml);
    $('span#current-rows').html(`Current rows: ${ arrNewData.length-(crrPage-1)*rowCount }`);
    $('#pagination-display').val(` ${crrPage} / ${total}`);
  }

  this.editRow = function(productID, categoryID) {
    gEditedRow = [];

    $(`button[id*='btn-save-row-${productID}-${categoryID}']`).css("display", "inline-block");
    $(`button[id*='btn-cancel-row-${productID}-${categoryID}']`).css("display", "inline-block");
    $(`button[id*='btn-edit-row-${productID}-${categoryID}']`).css("display", "none");

    $(`input[id*='input-row-ref-${productID}-${categoryID}']`)
        .removeClass('table-row-edit-disabled')
        .addClass('table-row-edit-enabled')
        .prop("disabled", true);

    $(`input[id*='input-row-pname-${productID}-${categoryID}']`)
        .removeClass('table-row-edit-disabled')
        .addClass('table-row-edit-enabled')
        .prop("disabled", false);

    $(`input[id*='input-row-rprice-${productID}-${categoryID}']`)
        .removeClass('table-row-edit-disabled')
        .addClass('table-row-edit-enabled')
        .prop("disabled", false);

    var replacedRetailPrice = $(`input[id*='input-row-rprice-${productID}-${categoryID}']`).val().replace("$", "").replace(",", ""); 
    $(`input[id*='input-row-rprice-${productID}-${categoryID}']`)
        .prop("type", "number")
        .val(parseFloat(replacedRetailPrice));

    $(`input[id*='input-row-sqty-${productID}-${categoryID}']`)
        .removeClass('table-row-edit-disabled')
        .addClass('table-row-edit-enabled')
        .prop("disabled", false)
        .prop("type", "number");

    $(`input[id*='input-row-wqty-${productID}-${categoryID}']`)
        .removeClass('table-row-edit-disabled')
        .addClass('table-row-edit-enabled')
        .prop("disabled", false)
        .prop("type", "number");

    for(var obj of gData) {
      if(obj.CATEGORYID == categoryID && obj.PRODUCTID == productID) {
        gEditedRow.push(obj);
      }
    }
  }

  this.trKeypressEvent = function (productID, categoryID) {
    if(event.which == 13) {
      var valSale = parseInt($(`input[id*='input-row-sqty-${productID}-${categoryID}']`).val()) == NaN ? 0 : parseInt($(`input[id*='input-row-sqty-${productID}-${categoryID}']`).val());
      var valWare = parseInt($(`input[id*='input-row-wqty-${productID}-${categoryID}']`).val()) == NaN ? 0 : parseInt($(`input[id*='input-row-wqty-${productID}-${categoryID}']`).val());

        if(valSale > 100000 || valWare > 100000) {
            $.confirm({
              title: "<h3 class='text-danger font-weight-bold'> That's way too many </h3>",
              content: "", 
              buttons: {
                cancelButton: {
                  text: 'Mea Culpa', // text for button
                  btnClass: 'btn-red', // class for the button
                  // keys: ['enter', 'a'], // keyboard event for button
                  isHidden: false, // initially not hidden
                  isDisabled: false, // initially not disabled
                  action: function(cancelButton) {
                      $(`input[id*='input-row-sqty-${productID}-${categoryID}']`).focus().select();
                  }
                }
              }
            })
        } else {
          updateData(productID, categoryID);
        }
    }
  }

  this.saveRow = function (productID, categoryID) {
    var valSale = parseInt($(`input[id*='input-row-sqty-${productID}-${categoryID}']`).val()) == NaN ? 0 : parseInt($(`input[id*='input-row-sqty-${productID}-${categoryID}']`).val());
    var valWare = parseInt($(`input[id*='input-row-wqty-${productID}-${categoryID}']`).val()) == NaN ? 0 : parseInt($(`input[id*='input-row-wqty-${productID}-${categoryID}']`).val());

    if(valSale > 100000 || valWare > 100000) {
        $.confirm({
            title: "<h3 class='text-danger font-weight-bold'> That's way too many </h3>",
           content: "", 
            buttons: {
                cancelButton: {
                    text: 'Mea Culpa', // text for button
                    btnClass: 'btn-red', // class for the button
                    // keys: ['enter', 'a'], // keyboard event for button
                    isHidden: false, // initially not hidden
                    isDisabled: false, // initially not disabled
                    action: function(cancelButton) {
                        $(`input[id*=input-row-sqty-${productID}-${categoryID}']`).focus().select();
                    }
                }
            }
        })
    } else {
        updateData(productID, categoryID);
    }
  }

  var fsr = false, fsn = false, fsp = false;
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
            $('span#total-rows').html(`Total rows: ${ arrNewData.length }`);
            $('#pagination-display').val(` ${crrPage} / ${initTotal}`);

            gEditedRow = [];

            $(`button[id*='btn-save-row-${arrNewData[0].PRODUCTID}-${arrNewData[0].CATEGORYID}']`).css("display", "inline-block");
            $(`button[id*='btn-cancel-row-${arrNewData[0].PRODUCTID}-${arrNewData[0].CATEGORYID}']`).css("display", "inline-block");
            $(`button[id*='btn-edit-row-${arrNewData[0].PRODUCTID}-${arrNewData[0].CATEGORYID}']`).css("display", "none");

            $(`input[id*='input-row-ref-${arrNewData[0].PRODUCTID}-${arrNewData[0].CATEGORYID}']`)
                .removeClass('table-row-edit-disabled')
                .addClass('table-row-edit-enabled')
                .prop("disabled", true);

            $(`input[id*='input-row-pname-${arrNewData[0].PRODUCTID}-${arrNewData[0].CATEGORYID}']`)
                .removeClass('table-row-edit-disabled')
                .addClass('table-row-edit-enabled')
                .prop("disabled", false);

            $(`input[id*='input-row-rprice-${arrNewData[0].PRODUCTID}-${arrNewData[0].CATEGORYID}']`)
                .removeClass('table-row-edit-disabled')
                .addClass('table-row-edit-enabled')
                .prop("disabled", false);

            var replacedRetailPrice = $(`input[id*='input-row-rprice-${arrNewData[0].PRODUCTID}-${arrNewData[0].CATEGORYID}']`).val().replace("$", "").replace(",", ""); 
            $(`input[id*='input-row-rprice-${arrNewData[0].PRODUCTID}-${arrNewData[0].CATEGORYID}']`)
                .prop("type", "number")
                .val(parseFloat(replacedRetailPrice));

            $(`input[id='input-row-sqty-${arrNewData[0].PRODUCTID}-${arrNewData[0].CATEGORYID}']`)
                .removeClass('table-row-edit-disabled')
                .addClass('table-row-edit-enabled')
                .prop("disabled", false)
                .prop("type", "number");

            $(`input[id*='input-row-wqty-${arrNewData[0].PRODUCTID}-${arrNewData[0].CATEGORYID}']`)
                .removeClass('table-row-edit-disabled')
                .addClass('table-row-edit-enabled')
                .prop("disabled", false)
                .prop("type", "number");

            for(var obj of gData) {
                if(obj.CATEGORYID == arrNewData[0].CATEGORYID && obj.PRODUCTID == arrNewData[0].PRODUCTID) {
                    gEditedRow.push(obj);
                }
            }

            $(`input[id*='input-row-sqty-${arrNewData[0].PRODUCTID}-${arrNewData[0].CATEGORYID}']`).focus().select();

        } else {
            $('tbody#display-report').html(`<div class="report-no-data"><p>no data to display</p></div>`);
        }
    }
  }
});