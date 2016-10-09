var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

var friendSchema = new Schema({
    id: String,
    friendId: String,
    createDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('friend', friendSchema);
