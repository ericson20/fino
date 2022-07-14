const mongoose = require("mongoose");

const transSchema = new mongoose.Schema({
	sellerId: {type: String},
	customerId: {type: String},
	name: { type: String },
	doc: { type: String },
	amount: { type: Number },
	description: { type: String },
	type: { type: String },
	pdfLink: {type: Array},
	createdAt : {type: String}
}
);

module.exports = Trans = mongoose.model("trans", transSchema);