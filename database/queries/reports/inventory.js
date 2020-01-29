var inventory = {
  stockCurrent: `SELECT 
                  PRODUCTS.ID AS PRODUCTID,
                  CATEGORIES.ID AS CATEGORYID,
                  CATEGORIES.NAME AS CATEGORYNAME,            
                  PRODUCTS.REFERENCE AS REFERENCE, 
                  PRODUCTS.CODE as CODE,
                  PRODUCTS.NAME AS PRODUCTNAME, 
                  PRODUCTS.PRICESELL AS PRICESELL, 
                  PRODUCTS.SUPPLIER AS SUPPLIERID,
                  IF(LOCATIONS.ID = ?, STOCKCURRENT.UNITS, "##") as SALESFLOORUNIT,											
                  IF(LOCATIONS.ID = ?, STOCKCURRENT.UNITS, "##") as WAREHOUSEUNIT
                FROM STOCKCURRENT 
                  JOIN LOCATIONS ON STOCKCURRENT.LOCATION = LOCATIONS.ID 
                  JOIN PRODUCTS ON STOCKCURRENT.PRODUCT = PRODUCTS.ID 
                  JOIN CATEGORIES ON PRODUCTS.CATEGORY = CATEGORIES.ID 
                WHERE 
                  LOCATIONS.SITEGUID = PRODUCTS.SITEGUID
                  ***
                ORDER BY PRODUCTS.ID`,
  sellHistory: `(SELECT 'DATA15' AS TYPE,
                  TICKETLINES.PRODUCT,
                  SUM(TICKETLINES.UNITS) AS UNITS
                FROM 
                  RECEIPTS, 
                  TICKETLINES
                WHERE 
                  RECEIPTS.ID  = TICKETLINES.TICKET 
                  AND RECEIPTS.DATENEW BETWEEN (NOW() -INTERVAL 15 DAY) AND NOW()  
                GROUP BY TICKETLINES.PRODUCT 
                ORDER BY TICKETLINES.PRODUCT)

                UNION ALL

                (SELECT 'DATA30' AS TYPE,
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
                ORDER BY TICKETLINES.PRODUCT)

                UNION ALL

                (SELECT 'DATA120' AS TYPE,
                  TICKETLINES.PRODUCT,
                  SUM(TICKETLINES.UNITS) AS UNITS
                FROM 
                  RECEIPTS, 
                  TICKETLINES
                WHERE 
                  RECEIPTS.ID  = TICKETLINES.TICKET  
                  AND RECEIPTS.DATENEW BETWEEN (NOW() -INTERVAL 120 DAY) AND NOW()  
                GROUP BY TICKETLINES.PRODUCT 
                ORDER BY TICKETLINES.PRODUCT)

                UNION ALL

                (SELECT 'DATA180' AS TYPE,
                  TICKETLINES.PRODUCT,
                  SUM(TICKETLINES.UNITS) AS UNITS
                FROM 
                  RECEIPTS, 
                  TICKETLINES
                WHERE 
                  RECEIPTS.ID  = TICKETLINES.TICKET  
                  AND RECEIPTS.DATENEW BETWEEN (NOW() -INTERVAL 180 DAY) AND NOW()  
                GROUP BY TICKETLINES.PRODUCT 
                ORDER BY TICKETLINES.PRODUCT)

                UNION ALL

                (SELECT 'DATA365' AS TYPE,
                  TICKETLINES.PRODUCT,
                  SUM(TICKETLINES.UNITS) AS UNITS
                FROM 
                  RECEIPTS, 
                  TICKETLINES
                WHERE 
                  RECEIPTS.ID  = TICKETLINES.TICKET  
                  AND RECEIPTS.DATENEW BETWEEN (NOW() -INTERVAL 365 DAY) AND NOW()  
                GROUP BY TICKETLINES.PRODUCT
                ORDER BY TICKETLINES.PRODUCT)`,
    // itemSoldHistory: `select 
    //                     DATE_FORMAT( d.DATENEW,'%m-%d-%Y') AS DATENEW, 
    //                     a.TICKETID, 
    //                     b.units, 
    //                     b.price, 
    //                     e.TOTAL
    //                   from
    //                     tickets a, 
    //                     ticketlines b, products c, receipts d, payments e
    //                   where a.id = b.TICKET
    //                     and c.id = b.PRODUCT
    //                     and b.PRODUCT = ?
    //                     and a.id = d.id
    //                     and e.RECEIPT = d.ID
    //                   order by  DATENEW desc, a.TICKETID`
    itemSoldHistory: `select 
                        DATE_FORMAT( d.DATENEW,'%m-%d-%Y') AS DATENEW, 
                        a.TICKETID as TICKETID, 
                        sum(b.units) as units, 
                        b.price, 
                        sum(e.TOTAL) as TOTAL
                      from
                        tickets a, 
                        ticketlines b, products c, receipts d, payments e
                      where a.id = b.TICKET
                        and c.id = b.PRODUCT
                        and b.PRODUCT = ?
                        and a.id = d.id
                        and e.RECEIPT = d.ID
                      GROUP BY DATE_FORMAT(DATENEW,'%m-%d-%Y'), TICKETID
                      order by  DATENEW desc, a.TICKETID`
}

module.exports = inventory;
