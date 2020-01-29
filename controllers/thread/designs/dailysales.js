var dailySales = {
  subtitle: `shopName date Daily Sales`,
  header: `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
  </head>
  <body 
    style="font-family:cursive;
      font-weight:normal;
      font-style:normal;
      padding: 10px 100px 0 100px">
    <h2 
      style="padding-left: 20px; 
        margin: 5px;
        padding: 20px 0 0 20px;">
      Daily Sales
      <span style="color: bule;">(shopName)</span>
    </h2>
    <table 
      style="width:100%;
        border: 1px solid rgba(125, 167, 191, 0.4);
        background-color: rgba(225, 236, 241, 0.35);
        padding: 20px;">
      <thead 
        style="font-weight:bold;font-size:15px">
        <tr style="text-align:left">
          <th style="width:25%">Date</th>
          <th style="width:25%">Order Count</th>
          <th style="width:25%;text-align:center;">Largest Order</th>
          <th style="width:25%;text-align:center">Total Sales</th>
        </tr>
      </thead>
      <tbody>`,
  footer: `</tbody>
          </table>
        </body>
        </html>`,
}

module.exports = dailySales;
