var dailySales = {
  getData: `SELECT
              AAA.DATENEW,
              AAA.LARGESTORDER,
              AAA.TOTALSALES,
              BBB.COUNTORDER
            FROM (
              SELECT 
                DATENEW, 
                MAX(SUBTOTALSALES) AS LARGESTORDER, 
                SUM(SUBTOTALSALES) AS TOTALSALES
              FROM  ( 
                SELECT  
                  DATE_FORMAT(RECEIPTS.DATENEW,'%Y-%m-%d') AS DATENEW, 
                  SUM(TICKETLINES.PRICE * TICKETLINES.UNITS) AS SUBTOTALSALES 
                FROM  
                  TICKETLINES, TICKETS, RECEIPTS 
                WHERE 
                  RECEIPTS.ID = TICKETS.ID 
                  AND TICKETS.ID = TICKETLINES.TICKET 
                  AND TICKETS.ID = TICKETLINES.TICKET 
                  AND RECEIPTS.ID = TICKETS.ID 
                  AND DATENEW BETWEEN (NOW() - INTERVAL 7 DAY)  AND NOW()
                GROUP BY DATE_FORMAT(RECEIPTS.DATENEW,'%Y-%m-%d'), TICKETS.ID
              ) AS SQ 
              GROUP BY DATENEW 
              ORDER BY DATENEW DESC) AS AAA
              LEFT JOIN (SELECT
                          DATE_FORMAT(RECEIPTS.DATENEW,'%Y-%m-%d') AS DATENEW,
                          COUNT(*) AS COUNTORDER
                          FROM 
                          receipts
                          GROUP BY DATE_FORMAT(RECEIPTS.DATENEW,'%Y-%m-%d')
                          ORDER BY DATE_FORMAT(RECEIPTS.DATENEW,'%Y-%m-%d') DESC) AS BBB 
              ON AAA.DATENEW = BBB.DATENEW`,
}

module.exports = dailySales;
