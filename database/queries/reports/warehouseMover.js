var warehouseMover = {
  getData: `SELECT 
              PRODUCTS.ID AS PRODUCTID,
              CATEGORIES.ID AS CATEGORYID,           
              PRODUCTS.REFERENCE AS REFERENCE, 
              PRODUCTS.CODE as CODE,
              PRODUCTS.NAME AS PRODUCTNAME, 
              PRODUCTS.PRICESELL AS PRICESELL,
              IF(LOCATIONS.ID = ?, STOCKCURRENT.UNITS, "##") as SALESFLOORUNIT,											
              IF(LOCATIONS.ID = ?, STOCKCURRENT.UNITS, "##") as WAREHOUSEUNIT
            FROM STOCKCURRENT 
              JOIN LOCATIONS ON STOCKCURRENT.LOCATION = LOCATIONS.ID 
              JOIN PRODUCTS ON STOCKCURRENT.PRODUCT = PRODUCTS.ID 
              JOIN CATEGORIES ON PRODUCTS.CATEGORY = CATEGORIES.ID 
            WHERE 
              LOCATIONS.SITEGUID = PRODUCTS.SITEGUID
            ORDER BY PRODUCTS.ID`,
  sellHistory: `(SELECT 'DATA30' AS TYPE,
                  TICKETLINES.PRODUCT,
                  SUM(TICKETLINES.UNITS) AS UNITS
                FROM 
                  RECEIPTS, 
                  TICKETLINES
                WHERE 
                  RECEIPTS.ID  = TICKETLINES.TICKET 
                  AND RECEIPTS.DATENEW BETWEEN (NOW() -INTERVAL 30 DAY) AND NOW()  
                GROUP BY TICKETLINES.PRODUCT 
                ORDER BY TICKETLINES.PRODUCT)

                UNION ALL

                (SELECT 'DATA60' AS TYPE,
                  TICKETLINES.PRODUCT,
                  SUM(TICKETLINES.UNITS) AS UNITS
                FROM 
                  RECEIPTS, 
                  TICKETLINES
                WHERE 
                  RECEIPTS.ID  = TICKETLINES.TICKET
                  AND RECEIPTS.DATENEW BETWEEN (NOW() -INTERVAL 60 DAY) AND NOW()  
                GROUP BY TICKETLINES.PRODUCT
                ORDER BY TICKETLINES.PRODUCT)

                UNION ALL

                (SELECT 'DATA90' AS TYPE,
                  TICKETLINES.PRODUCT,
                  SUM(TICKETLINES.UNITS) AS UNITS
                FROM 
                  RECEIPTS, 
                  TICKETLINES
                WHERE 
                  RECEIPTS.ID  = TICKETLINES.TICKET  
                  AND RECEIPTS.DATENEW BETWEEN (NOW() -INTERVAL 90 DAY) AND NOW()  
                GROUP BY TICKETLINES.PRODUCT 
                ORDER BY TICKETLINES.PRODUCT)`,
}

module.exports = warehouseMover
