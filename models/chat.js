var mongoose = require('mongoose');
var Schema 	 = mongoose.Schema;

var chatSchema = new Schema({
    from: String,
	to: String,
    content: String,
    createDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('chat', chatSchema);
