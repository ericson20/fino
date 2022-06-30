const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
	sellerId: {type: String},
	name: { type: String },
	doc: { type: String },
	direction: { type: String },
	docType: {type: String}
},
{ timestamps: { createdAt: true }},
);

module.exports = Customer = mongoose.model("customer", customerSchema);