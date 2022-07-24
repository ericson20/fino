const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const auth = require("../middleware/auth");
const { findOneAndUpdate } = require("../models/userModel");

router.post("/register", async (req, res) => {
  try {
    let { name, ruc, branch, token, email, vendor, process, credit, paid, password, docType, phoneNumber} = req.body;
     const existingUser = await User.findOne({ email: { $regex : new RegExp(email, "i")}});
    // const existingUser = await User.findOne({email : email});
    if (existingUser)
      return res
        .json({ msg: "Este email ya está registrado", status: 400 });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name,
      ruc: ruc,
      branch: branch,
      vendor: vendor,
      process: process,
      credit: credit,
      paid: paid,
      token: token,
      email: email,
      password: passwordHash,
      docType : docType === undefined ? [true, true, true] : [docType.invoice, docType.ticket, docType.note],
      showCant: true,
      directSale:false,
      quickPrint:false,
      showMultiItems:true,
      formatShareA4:false,
      formatPrintA4:false,
      itemsIgv:false,
      defaultText: '',
      phoneNumber, phoneNumber,
      items: []
    });
    await newUser.save();
    res.json({status: 200});
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: { $regex : new RegExp(email, "i")}});
 
    var activeStatus = false;

    if (user) {
      activeStatus = user.active_status;
    }
    // Check if User ID exist.
    if (!user) 
      return res
        .json({ msg: "No se ha registrado ninguna cuenta con este ID", status: 'No User' });

    // Check if Password is correct.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ msg: "La contraseña no es correcta", status: 'Wrong Password' });

    // Check if User is active.
    if (!activeStatus)
      return res
        .json({ msg: "No estás activado", status: 'No Active' });

    // when login is succes
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      msg:'Success',
      token,
      directSale: user.directSale,
      email: user.email
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.id);
  res.json({
    email: user.email,
    id: user._id,
  });
});


router.get("/all", async (req, res) => {

  const users = await User.find({});
  var userMaps = [];

  await Promise.all(users.map( async (user, index) => {
    var userMap = [];
    userMap = {
      id: user.id,
      name: user.name,
      ruc: user.ruc,
      branch: user.branch,
      vendor: user.vendor,
      process: user.process,
      credit: user.credit,
      paid: user.paid,
      token: user.token,
      email: user.email,
      active_status: user.active_status,
    };
    userMaps.push(userMap);
  }));
  
  res.json(userMaps);
});

router.delete('/delete/:id', async (req, res) => {


  User.deleteOne({_id: req.params.id}, (error, data) => {
    if (error) {
      res.status(500).json({ msg: error.message });
    } else {
      res.status(200).json({ 
        msg: 'success',
        del_id: req.params.id
      });
    }
  });
});

router.get('/deactive/:id', async (req, res) => {
  
  const filter = { _id: req.params.id };
  const update = { active_status: false };
  const result = await User.findOneAndUpdate(filter, update);
  
  //After updating, get all data again.
  const users = await User.find({});
  var userMaps = [];

  await Promise.all(users.map( async (user, index) => {
    var userMap = [];
    userMap = {
      id: user.id,
      name: user.name,
      ruc: user.ruc,
      branch: user.branch,
      vendor: user.vendor,
      process: user.process,
      credit: user.credit,
      paid: user.paid,
      token: user.token,
      email: user.email,
      active_status: user.active_status,
    };
    userMaps.push(userMap);
  }));
  res.json(userMaps);
});

router.get('/active/:id', async (req, res) => {
  
  const filter = { _id: req.params.id };
  const update = { active_status: true };
  const result = await User.findOneAndUpdate(filter, update);
  
  //After updating, get all data again.
  const users = await User.find({});
  var userMaps = [];

  await Promise.all(users.map( async (user, index) => {
    var userMap = [];
    userMap = {
      id: user.id,
      name: user.name,
      ruc: user.ruc,
      branch: user.branch,
      vendor: user.vendor,
      process: user.process,
      credit: user.credit,
      paid: user.paid,
      token: user.token,
      email: user.email,
      active_status: user.active_status,
    };
    userMaps.push(userMap);
  }));
  res.json(userMaps);
});

router.get('/get/:id', async (req, res) => {
  const filter = { _id: req.params.id };
  const user = await User.findOne(filter);
  res.json(user);
});

router.put('/update', async (req, res) => {
  
  const filter = { _id: req.body.id };
  const update = { name: req.body.name, ruc: req.body.ruc, branch: req.body.branch, token: req.body.token, vendor: req.body.vendor, process: req.body.process, credit: req.body.credit, paid: req.body.paid, email: req.body.email, docType : [req.body.docType.invoice, req.body.docType.ticket, req.body.docType.note], phoneNumber : req.body.phoneNumber };
  const user = await User.findOneAndUpdate(filter, update);
  res.json(user);

});

// Get User Information for invoice

router.get('/getId/:id', async (req, res) => {
  const user = await User.findOne({email: req.params.id});
  res.json(user);
});

router.put('/updateProfile', async (req, res) => {
  
  const filter = { email: req.body.email };
  const update = { showCant: req.body.showCant, directSale: req.body.directSale, quickPrint: req.body.quickPrint, showMultiItems: req.body.showMultiItems, formatShareA4: req.body.formatShareA4, formatPrintA4: req.body.formatPrintA4, itemsIgv: req.body.itemsIgv, defaultText: req.body.defaultText };
  const user = await User.findOneAndUpdate(filter, update);
  res.json(user);

});

router.post('/items/add', async (req, res) =>{
  const filter = { email : req.body.email};
  const update = req.body.item;
  const result  = await User.findOneAndUpdate(filter, { $addToSet: { items: update}}, (err, doc, res)=> {
    return doc;
  });
  res.json(result)
})

router.post('/items/delete', async(req, res)=>{
  const filter = { email : req.body.email};
  const update = req.body.item;
  const result  = await User.findOneAndUpdate(filter, { $pull: { items: update }}, (err, doc, res)=> {
    return doc;
  });
  res.json(result)
})

router.put('/items/update', async (req, res) => {
  
  const filter = { email : req.body.email};
  const index = req.body.index;
  const item = req.body.item;
  const result = await User.findOne(filter);
  result.items[index] = item

  const up = await User.findOneAndUpdate(filter, result, (err, doc, res)=>{
    return doc
  });

    res.json(up)
})
module.exports = router;
