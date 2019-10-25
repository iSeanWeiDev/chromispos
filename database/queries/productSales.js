var productSales = {
  getData: `SELECT
              AAA.REFERENCE,
              AAA.NAME,
              SUM(AAA.UNITS) AS UNITS,
              SUM(AAA.PRICE * AAA.UNITS) / SUM(AAA.UNITS) AS PRICE,
              SUM(AAA.TOTAL) AS TOTAL
            FROM
              (SELECT
                PRODUCTS.REFERENCE AS REFERENCE,
                PRODUCTS.NAME AS NAME,
                TICKETLINES.PRICE AS PRICE,
                TICKETLINES.UNITS UNITS,
                TICKETLINES.UNITS * TICKETLINES.PRICE AS TOTAL
              FROM
                RECEIPTS, PRODUCTS, CATEGORIES, TICKETS, TICKETLINES
              WHERE
                PRODUCTS.ID = TICKETLINES.PRODUCT
                AND TICKETS.ID = TICKETLINES.TICKET
                AND RECEIPTS.ID = TICKETS.ID
                AND PRODUCTS.CATEGORY = CATEGORIES.ID
                AND RECEIPTS.DATENEW BETWEEN ? AND ?
                ***
              ORDER BY
                PRODUCTS.NAME) AS AAA
            GROUP BY
              AAA.NAME
            ORDER BY
              AAA.NAME`,
}

module.exports = productSales;
