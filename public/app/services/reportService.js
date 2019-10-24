'use strict';

/**
 * @description
 * Get object size from validated object.
 * 
 * @param {OBJECT} obj 
 */
function getObjectSize(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

/**
 * @description
 * validate the number by pointer
 * 
 * @param {string} number 
 */
function validateNumber(number) {
    var arrNumber = number.split('.');

    if(arrNumber[1] == '00') {
        return arrNumber[0];
    }

    return number;
}

/**
 * @description
 * format change.
 * 
 * @param {integer} num 
 */
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

/**
 * @description
 * convert date to default from isoDate
 * 
 * @param {string} isoDate 
 */
function converISODateToDefault(isoDate) {
  if(isoDate != null) {
    var divDay = isoDate.split(" ");
    var bigDay = divDay[0].split('-');
    var smallDay = divDay[1].split(':');
    var year = bigDay[0];
    var month = bigDay[1];
    var day = bigDay[2];
    var index = smallDay[0] > 12 ? "PM" : "AM";
    var hh = smallDay[0] > 12 ? smallDay[0]-12 : smallDay[0];
    var mm = smallDay[1];
    var newDate = month + "/" + day + "/" + year + " " + hh + ":" + mm + " " + index;
    return newDate;
    // return typeof isoDate;
  } 

  return null;
}

/**
 * @description
 * calc the number between 2 isoDates
 * 
 * @param {string} isoDate1 
 * @param {string} isoDate2 
 */
function calcBetweenDates(isoDate1, isoDate2) {
  if (isoDate1 != null && isoDate2 != null) {
    var date1 = new Date(isoDate1);
    var date2 = new Date(isoDate2);

    return Math.abs(date1 - date2) / 36e5;
  }
  return null;
}
