var categorySales = {
  getData: `SELECT 
              CATEGORIES.ID, 
              CATEGORIES.NAME, 
              SUM(TICKETLINES.UNITS) AS QTY, 
              SUM(TICKETLINES.PRICE * TICKETLINES.UNITS) AS CATPRICE, 
              SUM((PRODUCTS.PRICESELL * TICKETLINES.UNITS)-((PRODUCTS.ISVPRICE ) * (TICKETLINES.PRICE * TICKETLINES.UNITS))) AS DISC, 
              SUM((TICKETLINES.PRICE * TAXES.RATE)* TICKETLINES.UNITS) AS CATTAX, 
              SUM((TICKETLINES.PRICE * TICKETLINES.UNITS) + ((TICKETLINES.PRICE * TAXES.RATE)* TICKETLINES.UNITS)) AS CATTOTAL, 
              (SELECT SITES.NAME FROM SITES WHERE SITES.GUID = TICKETLINES.SITEGUID) AS SITE 
            FROM 
              TICKETS, 
              RECEIPTS, 
              CATEGORIES, 
              PRODUCTS, 
              TAXES, 
              TICKETLINES
            WHERE 
              TICKETS.ID = RECEIPTS.ID
              AND CATEGORIES.ID = PRODUCTS.CATEGORY 
              AND TAXES.ID = TICKETLINES.TAXID 
              AND PRODUCTS.ID = TICKETLINES.PRODUCT
              AND TICKETS.ID = TICKETLINES.TICKET 
              AND RECEIPTS.DATENEW BETWEEN ? AND ? 
            GROUP BY 
              RECEIPTS.SITEGUID, 
              CATEGORIES.ID, 
              CATEGORIES.NAME 
            ORDER BY 
              RECEIPTS.SITEGUID, 
              CATEGORIES.NAME`,
}

module.exports = categorySales;
