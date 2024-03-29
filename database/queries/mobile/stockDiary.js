var stockDiary = {
  getData: `SELECT 
              PRODUCTS.ID AS PRODUCTID,
              CATEGORIES.ID AS CATEGORYID,                    
              PRODUCTS.REFERENCE, 
              PRODUCTS.NAME AS PRODUCTNAME, 
              PRODUCTS.PRICESELL, 
              IF(LOCATIONS.ID = ?, STOCKCURRENT.UNITS, "##") as SALESFLOORUNIT,											
              IF(LOCATIONS.ID = ?, STOCKCURRENT.UNITS, "##") as WAREHOUSEUNIT
            FROM STOCKCURRENT 
              JOIN LOCATIONS ON STOCKCURRENT.LOCATION = LOCATIONS.ID 
              JOIN PRODUCTS ON STOCKCURRENT.PRODUCT = PRODUCTS.ID 
              JOIN CATEGORIES ON PRODUCTS.CATEGORY = CATEGORIES.ID 
            WHERE 
              LOCATIONS.SITEGUID = PRODUCTS.SITEGUID
              AND PRODUCTS.REFERENCE like ?`,
  productUpdate: `UPDATE PRODUCTS SET NAME = ?, PRICESELL = ? WHERE ID = ?`,
  stockCurrentUpdate: `UPDATE STOCKCURRENT 
                        INNER JOIN LOCATIONS ON STOCKCURRENT.LOCATION = LOCATIONS.ID 
                        INNER JOIN PRODUCTS ON STOCKCURRENT.PRODUCT = PRODUCTS.ID 
                        INNER JOIN CATEGORIES ON PRODUCTS.CATEGORY = CATEGORIES.ID 
                      SET STOCKCURRENT.UNITS = ?
                      WHERE PRODUCTS.ID = ?
                        AND CATEGORIES.ID = ?
                        AND LOCATIONS.ID = ?`,
  stockCurrentInsert: `INSERT INTO STOCKCURRENT (LOCATION, PRODUCT, ATTRIBUTESETINSTANCE_ID, UNITS, SITEGUID, SFLAG)
                        VALUES (?, ?, null, ?, ?, ?)`,
}

module.exports = stockDiary;
