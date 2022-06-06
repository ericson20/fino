const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/customerModel");


router.post("/create", async (req, res) => {
  try {
    let { doc, name, direction, sellerId } = req.body;
    const existingUser = await Customer.findOne({ name: name });

    if (existingUser)
      return res
        .json({ msg: "An account with this name already exists.", status: 400 });

    const newCustomer = new Customer({
      name: name,
      doc: doc,
      direction: direction,
      sellerId: sellerId,
    });
    const savedCustomer = await newCustomer.save();
    res.json({status: 200});
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/all/:id", async (req, res) => {

  let sellerId = req.params.id;
  const customers = await Customer.find({sellerId: sellerId});
  var customerMaps = [];

  await Promise.all(customers.map( async (customer, index) => {
    var customerMap = [];
    customerMap = {
      id: customer._id,
      name: customer.name,
      doc: customer.doc,
      sellerId: customer.sellerId,
      date: customer.createdAt,
      direction : customer.direction
    };
    customerMaps.push(customerMap);
  }));
  
  res.json(customerMaps);
});

router.get("/get/:id", async (req, res) => {

  let customerId = req.params.id;
  const customer = await Customer.find({_id: customerId});
  res.json(customer);
});

router.delete("/delete/:id",async(req, res) =>{
  let customerId = req.params.id;
  Customer.deleteOne({_id : customerId}, (err, data) =>{
    if(err){
      res.status(500).json({ msg: err.message})
    }else{
      res.status(200).json({
        msg:'success'
      })
    }
  })


})

router.put("/update", async (req, res)=>{
  const filter = { _id: req.body.id };
  const update = { name : req.body.name, direction: req.body.direction};
  const customer = await Customer.findOneAndUpdate(filter, update);
  res.json(customer);
})
module.exports = router;