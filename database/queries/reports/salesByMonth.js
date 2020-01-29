var salesByMonth = {
  getData: `SELECT
              AAA.DATENEW,
              AAA.ITEMSSOLD,
              AAA.LARGESTORDER,
              AAA.TOTALSALES,
              AAA.TOTALTAXCOLLECTED,
              AAA.TOTAL,
              BBB.COUNTORDER
            FROM (
              SELECT 
                DATENEW, 
                SUM(UNITS) AS ITEMSSOLD, 
                MAX(SUBTOTALSALES) AS LARGESTORDER, 
                SUM(SUBTOTALSALES) AS TOTALSALES, 
                SUM(SUBTOTALTAXCOLLECTED) AS TOTALTAXCOLLECTED, 
                SUM(SUBTOTAL) AS TOTAL
              FROM  ( 
                SELECT  
                  DATE_FORMAT(RECEIPTS.DATENEW,'%Y-%m') AS DATENEW, 
                  TICKETS.ID, 
                  SUM(TICKETLINES.UNITS) AS UNITS, 
                  SUM(TICKETLINES.PRICE * TICKETLINES.UNITS) AS SUBTOTALSALES, 
                  SUM(TICKETLINES.PRICE * TICKETLINES.UNITS * TAXES.RATE) AS SUBTOTALTAXCOLLECTED, 
                  SUM((TICKETLINES.PRICE+TICKETLINES.PRICE*TAXES.RATE)*TICKETLINES.UNITS) AS SUBTOTAL
                FROM  
                  TICKETLINES, PRODUCTS, TICKETS, RECEIPTS, TAXES, CATEGORIES 
                WHERE 
                  RECEIPTS.ID = TICKETS.ID 
                  AND TICKETS.ID = TICKETLINES.TICKET 
                  AND TICKETLINES.PRODUCT = PRODUCTS.ID 
                  AND TICKETLINES.TAXID = TAXES.ID  
                  AND TICKETLINES.PRODUCT = PRODUCTS.ID 
                  AND TICKETS.ID = TICKETLINES.TICKET 
                  AND RECEIPTS.ID = TICKETS.ID 
                  AND CATEGORIES.id = PRODUCTS.CATEGORY
                  AND DATENEW BETWEEN ? AND ? 
                  ***
                GROUP BY DATE_FORMAT(RECEIPTS.DATENEW,'%Y-%m'), TICKETS.ID
              ) AS SQ 
              GROUP BY DATENEW 
              ORDER BY DATENEW DESC) AS AAA
              LEFT JOIN (SELECT
                          DATE_FORMAT(RECEIPTS.DATENEW,'%Y-%m') AS DATENEW,
                          COUNT(*) AS COUNTORDER
                          FROM 
                          receipts
                          GROUP BY DATE_FORMAT(RECEIPTS.DATENEW,'%Y-%m')
                          ORDER BY DATE_FORMAT(RECEIPTS.DATENEW,'%Y-%m') DESC) AS BBB 
              ON AAA.DATENEW = BBB.DATENEW`,
};

module.exports = salesByMonth;
