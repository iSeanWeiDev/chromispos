$(document).ready(function () {
  var gData = [];
  function init() {
    $('div.content').remove();
          $('div.card-body').html(`<div class="report-no-data text-center">
                                      <p style="left: calc(50% / 2) !important">
                                       No data to display</p>
                                    </div>`);
  }

  function returnHTML(data) {
    var qtySale = data.SALESFLOORUNIT == "##" ? "": data.SALESFLOORUNIT;
    var qtyWare = data.WAREHOUSEUNIT == "##" ? "": data.WAREHOUSEUNIT;
    var strHTML = `<div class="content">
                    <button class="float-right btn btn-raised btn-info"
                      onclick="saveProduct('${data.PRODUCTID}', '${data.CATEGORYID}')">
                      Save
                    </button>
                    <span class="reference text-info">
                        ${data.REFERENCE}
                    </span>
                    <div class="input-group">
                      
                      <input 
                        type="text"
                        id="productName"
                        value="${data.PRODUCTNAME}" 
                        class="form-control" 
                        aria-label="Default" 
                        aria-describedby="inputGroup-sizing-default">
                    </div>
                    <div class="row">
                      <div class="col-4">
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <span 
                              class="input-group-text font-weight-bold" 
                              id="inputGroup-sizing-default">
                              $:&nbsp;
                            </span>
                          </div>
                          <input 
                            type="number" 
                            id="price"
                            value="${formatNumber(data.PRICESELL.toFixed(2))}"
                            class="form-control" 
                            aria-label="Default" 
                            aria-describedby="inputGroup-sizing-default">
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <span 
                              class="input-group-text font-weight-bold" 
                              id="inputGroup-sizing-default">
                              SF:&nbsp;
                            </span>
                          </div>
                          <input 
                            type="number" 
                            id="qtySale"
                            value="${qtySale}"
                            class="form-control" 
                            aria-label="Default" 
                            aria-describedby="inputGroup-sizing-default">
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="input-group">
                          <div class="input-group-prepend">
                            <span 
                              class="input-group-text font-weight-bold" 
                              id="inputGroup-sizing-default">
                              WH: &nbsp;
                            </span>
                          </div>
                          <input 
                            type="number" 
                            id="qtyWare"
                            value="${qtyWare}"
                            class="form-control" 
                            aria-label="Default" 
                            aria-describedby="inputGroup-sizing-default">
                        </div>
                      </div>
                    </div>
                  </div>`;
    return strHTML;
  }
  this.searchData = () => {
    gData = [];
    var method = "GET";
    var url = "/mobiles/stockdiary"
    var sendData = {
      reference: $('input#searchInput').val()
    }

    returnData(method, url, sendData, callback => {
      console.log(callback);
      if (callback && callback.flag == true) {
        if (callback.data.length > 0) {
          gData = callback.data;
          var strHTML = returnHTML(callback.data[0]);
          $('div.card-body').html(strHTML);
        } else {
          init();
        }

        setTimeout(() => {
          $('input#searchInput').val('');
        }, 500);
      }
    });
  }

  this.saveProduct = (productID, categoryID) => {
    var wasNullSale = gData[0].SALESFLOORUNIT == "##" ? true : false;
    var wasNullWare = gData[0].WAREHOUSEUNIT == "##"  ? true : false;
    
    var method = "POST";
    var url = "/mobiles/stockdiary";
    var sendData = {
      productName: $('input#productName').val(),
      price: $('input#price').val(),
      qtySale: $('input#qtySale').val(),
      qtyWare: $('input#qtyWare').val(),
      productID: productID,
      categoryID: categoryID,
      wasNullSale: wasNullSale,
      wasNullWare: wasNullWare,
    }
    
    returnData(method, url, sendData, callback => {
      if (callback && callback.flag == true) {
        $('div.card-body').html(`<div class="report-got-data text-center">
                                      <p style="left: calc(50% / 2) !important">
                                       Succesfully saved</p>
                                    </div>`);
      } else {
        $('div.card-body').html(`<div class="report-no-data text-center">
                                    <p style="left: calc(50% / 2) !important">
                                    Doesn't saved</p>
                                  </div>`);
      }
    });
    gData = [];
  }

  init()
});
