const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Trans = require("../models/transModel");


router.post("/create", async (req, res) => {
  try {
    let { name, doc, description, customerId, amount, sellerId, type, pdfLink } = req.body;
    const newTrans = new Trans({
      name: name,
      doc: doc,
      description: description,
      customerId: customerId,
      amount: amount,
      pdfLink: pdfLink,
      sellerId: sellerId,
      type: type
    });
    await newTrans.save();
    res.json({status: 200});
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/all/:id", async (req, res) => {

  let sellerId = req.params.id;
  const trans = await Trans.find({sellerId: sellerId});
  var tranMaps = [];

  await Promise.all(trans.map( async (tran, index) => {
    var tranMap = [];
    tranMap = {
      id: tran._id,
      name: tran.name,
      doc: tran.doc,
      description: tran.description,
      customerId: tran.customerId,
      sellerId: tran.sellerId,
      amount: tran.amount,
      type: tran.type,
      date: tran.createdAt,
      pdfLink: tran.pdfLink
    };
    tranMaps.push(tranMap);
  }));
  
  res.json(tranMaps);
});

module.exports = router;