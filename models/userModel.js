const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: { type: String },
	ruc: { type: Number },
	branch: { type: Number },
	token: { type: String },
	email: { type: String, required: true, unique: true },
	vendor: { type: Number },
	process: { type: String },
	password: { type: String, required: true },
	credit: { type: Number },
	paid: { type: Number },
	active_status: { type: Boolean, default: true },
	docType : {type: Array },
	showCant:{type: Boolean},
	directSale:{type: Boolean},
	quickPrint:{type: Boolean},
	showMultiItems:{type: Boolean},
	formatShareA4:{type: Boolean},
	formatPrintA4:{type: Boolean},
	itemsIgv:{type: Boolean},
	defaultText: { type: String },
	items: {type: Array}
});

module.exports = User = mongoose.model("user", userSchema);
