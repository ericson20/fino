const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Trans = require("../models/transModel");
const Customer = require('../models/customerModel')

router.post("/create", async (req, res) => {
  try {
    let { name, doc, description, customerId, amount, sellerId, type, pdfLink } = req.body;
    const date = new Date();
    const newTrans = new Trans({
      name: name,
      doc: doc,
      description: description,
      customerId: customerId,
      amount: amount,
      pdfLink: pdfLink,
      sellerId: sellerId,
      createdAt: date,
      type: type,
      cancelled: false
    });
    let result = await Customer.findOneAndUpdate({_id: customerId}, {$inc : {'frequent' : 1}}, {new : true}).exec()
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
      pdfLink: tran.pdfLink,
      cancelled: tran.cancelled
    };
    tranMaps.push(tranMap);
  }));
  
  res.json(tranMaps);
});

router.put('/cancel', async (req, res) => {
  
  const filter = { _id: req.body.id };
  const update = { cancelled : true };
  const trans = await Trans.findOneAndUpdate(filter, update);
  res.json(trans);

});

module.exports = router;