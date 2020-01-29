var largeOrder = {
  getData: `SELECT
              RECEIPTS.DATENEW AS DATENEW,
              TICKETS.TICKETID AS ORDERS,
              TICKETLINES.PRICE*TICKETLINES.UNITS AS TOTAL
            FROM
              TICKETS, TICKETLINES, RECEIPTS
            WHERE
              TICKETS.ID = RECEIPTS.ID
              AND TICKETS.ID = TICKETLINES.TICKET 
            HAVING TOTAL > 100`,
}

module.exports = largeOrder;
