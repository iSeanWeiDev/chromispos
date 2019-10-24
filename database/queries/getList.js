var getList = {
  categories: `SELECT
                ID, NAME, CATSHOWNAME
              FROM
                CATEGORIES`,
  suppliers: `SELECT
                ID, SUPPLIERNAME
              FROM
                suppliers`,
}

module.exports = getList;
