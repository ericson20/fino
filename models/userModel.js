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
	docType : {type: Array }
});

module.exports = User = mongoose.model("user", userSchema);
