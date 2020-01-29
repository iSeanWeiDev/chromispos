var warehouseMover = {
  subtitle: `shopName date Warehouse Mover`,
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
      padding: 10px 50px 0 50px">
    <h2 
      style="padding-left: 20px; 
        margin: 5px;
        padding: 20px 0 0 20px;">
      Warehose Mover
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
          <th style="width:10%">Barcode</th>
          <th style="width:40%">Name</th>
          <th style="width:8%;text-align:center;">Price</th>
          <th style="width:8%;text-align:center">QTY.S</th>
          <th style="width:8%;text-align:center;">QTY.W</th>
          <th style="width:6.5%;text-align:center;">30</th>
          <th style="width:6.5%;text-align:center;">60</th>
          <th style="width:6.5%;text-align:center;">90</th>
          <th style="width:6.5%;text-align:center;">Stock Days</th>
        </tr>
      </thead>
      <tbody>`,
  footer: `</tbody>
          </table>
        </body>
        </html>`,
}

module.exports = warehouseMover;
