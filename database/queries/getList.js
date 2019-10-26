var getList = {
  categories: `SELECT
                ID, NAME, CATSHOWNAME
              FROM
                CATEGORIES`,
  suppliers: `SELECT
                ID, SUPPLIERNAME
              FROM
                suppliers`,
  peoples: `SELECT
              ID, NAME
            FROM
              PEOPLE`,
}

module.exports = getList;
