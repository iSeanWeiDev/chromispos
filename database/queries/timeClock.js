var timeClock = {
  getData: `SELECT 
              PEOPLE.NAME, 
              PEOPLE.ID,
              SUBSTRING(SHIFTS.STARTSHIFT FROM 1)	AS STARTSHIFT, 
            SUBSTRING(SHIFTS.ENDSHIFT FROM 1)	AS ENDSHIFT
            FROM PEOPLE LEFT JOIN SHIFTS ON SHIFTS.PPLID = PEOPLE.ID 
            WHERE 
              SHIFTS.STARTSHIFT BETWEEN ? AND ?
              ***
            ORDER BY 
            PEOPLE.NAME, SHIFTS.STARTSHIFT ASC`,
}

module.exports = timeClock;
