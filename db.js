const mongojs = require('mongojs');
const db = mongojs('mongodb://kinhdomcom:kinhdomcom@ds141185.mlab.com:41185/vsbg', ['toyota']);
db.on('error', function (err) {
    console.log('database error', err)
})

module.exports = db;