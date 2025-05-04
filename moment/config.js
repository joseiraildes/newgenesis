// Import the moment library
const moment = require('moment');
moment.locale('pt-br'); // Set the locale to Portuguese
// Make a function for return date in format LLLL
function Datetime() {
  return moment().format('LLLL'); // Format the date to 'LLLL' format
}

module.exports = Datetime