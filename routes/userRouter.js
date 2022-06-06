const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

router.post("/register", async (req, res) => {
  try {
    let { name, ruc, branch, token, email, vendor, process, credit, paid, password, docType} = req.body;
    console.log(req.body)
    const existingUser = await User.findOne({ email: email });

    if (existingUser)
      return res
        .json({ msg: "An account with this ID already exists.", status: 400 });

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
      docType : docType === undefined ? [true, true, true] : [docType.invoice, docType.ticket, docType.note]
    });
    const savedUser = await newUser.save();
    res.json({status: 200});
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    
    var activeStatus = false;

    if (user) {
      activeStatus = user.active_status;
    }
    // Check if User ID exist.
    if (!user) 
      return res
        .json({ msg: "No account with this ID has been registered.", status: 'No User' });

    // Check if Password is correct.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ msg: "Sorry, Password is not correct.", status: 'Wrong Password' });

    // Check if User is active.
    if (!activeStatus)
      return res
        .json({ msg: "You are not actived.", status: 'No Active' });

    // when login is succes
    return res.json({ status: 'Success' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
  const update = { name: req.body.name, ruc: req.body.ruc, branch: req.body.branch, token: req.body.token, vendor: req.body.vendor, process: req.body.process, credit: req.body.credit, paid: req.body.paid, email: req.body.email, docType : [req.body.docType.invoice, req.body.docType.ticket, req.body.docType.note] };
  const user = await User.findOneAndUpdate(filter, update);
  res.json(user);

});

// Get User Information for invoice
router.post('/info', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({email: email});
  res.json(user);
});

router.get('/getId/:id', async (req, res) => {
  const user = await User.findOne({email: req.params.id});
  res.json(user);
});
module.exports = router;
