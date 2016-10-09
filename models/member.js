var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

var memberSchema = new Schema({
    id: {type: String, unique: true},
    pass: String,
    gender: String,
    createDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('member', memberSchema);
