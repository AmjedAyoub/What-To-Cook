var express = require('express');
var router = express.Router();
var User = require('../models/user');
var ObjectID = require('mongodb').ObjectID;

router.get('/', function (req, res, next) {
  // return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
  return res.send('Logging');
});

router.post('/login', function (req, res, next) {
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }
  if (req.body.email &&
    req.body.password &&
    req.body.passwordConf) {
      var userData = {
        email: req.body.email,
        user: req.body.user,
        password: req.body.password
      }
      User.create(userData, function (error, user) {
        let userExists = false;
        User.find({email:req.body.email})
        .then(function(res)
        {if (res) {
          userExists=true;
          if (userExists){
            let err = new Error ('User already exists');
            err.status = 400;
            return next(err);
          }
          else {
            req.session.userId = user._id;
            return res.json(user);
          }
        }}
        )
      });
      
    } else if (req.body.logemail && req.body.logpassword) {
      
      User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
        if (error) {
          var err = new Error('Wrong email or password.');
          err.status = 401;
          return next(err);
        } else {
          req.session.userId = user._id;
          return res.json(user)
        }
      });
    } else {
      const err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
  })
  
router.post('/logout', function (req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        } else {
          return res.send('/Logging');
        }
      });
    }
  });

router.post('/addItems', function (req, res, next) {
   User.find({_id: req.body.userID}).then(function(user){
     let existItem=false;
    for (let i = 0; i < user[0].items.length; i++){
      if(user[0].items[i].name.toLowerCase() === req.body.name.toLowerCase()){
        // console.log(user[0].items[i].name.toLowerCase(),req.body.name.toLowerCase())
        existItem=true;
        const qty = parseFloat(user[0].items[i].quantity)
        const total = qty+parseFloat(req.body.quantity)
        // console.log(total,"      ",user[0].items[i].name)
        if(req.body.image==="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtUW-NhL541eHkTOKzBjghAfFPz-D1FUHjNQ&usqp=CAU"){
          User.updateOne({"_id": user[0]._id, "items._id": user[0].items[i]._id}, {$set: {"items.$.quantity":total,"items.$.name":req.body.name,"items.$.unit":req.body.unit}, new: true}).then(function (params) {
            // console.log(params)
          }).catch(function (err) {
            throw err
          })
        }else{
            User.updateOne({"_id": user[0]._id, "items._id": user[0].items[i]._id}, {$set: {"items.$.quantity":total,"items.$.name":req.body.name,"items.$.unit":req.body.unit,"items.$.image":req.body.image}, new: true}).then(function (params) {
              // console.log(params)
            }).catch(function (err) {
              throw err
            })
        }}      
    }
    if(!existItem){
      const newData = User.updateOne({"_id": user[0]._id}, {$push: {"items":{name:req.body.name,quantity:req.body.quantity,unit:req.body.unit,image:req.body.image}}, new: true})
      return newData
    }
  }).then(function(data){
    return res.json(data)
  }).catch(function(err){
    throw err
  });
});

router.post('/cookItems', function (req, res, next) {
   User.find({_id: req.body.userID}).then(function(user){
    for (let i = 0; i < user[0].items.length; i++){
      if(user[0].items[i].name.toLowerCase() === req.body.name.toLowerCase()){
        const qty = parseFloat(user[0].items[i].quantity)
        const total = qty-parseFloat(req.body.quantity)
        const newData = User.updateOne({"_id": user[0]._id,"items.name": user[0].items[i].name}, {$set: {"items.$.quantity":total}, new: true})
        return newData
      }      
    }  
  }).then(function(data){
    return res.json(data)
  }).catch(function(err){
    throw err
  });  
});

router.post('/deleteItem', function(req, res) {
  User.update(
    {"_id": ObjectID(req.body.userID)}, {$pull: {items:{_id:ObjectID(req.body.itemID)}}})         
.then(function(data){
  return res.json(data)
}).catch(function(err){
  console.log(err)
});
});

router.post('/addRecipe', function(req, res) {
  User.update(
    {"_id": ObjectID(req.body.userID)}, {$addToSet: {meals:{  
      id: req.body.id,
      image: req.body.image,
      title: req.body.title,
      readyInMinutes:req.body.readyInMinutes
    }}})         
.then(function(data){
  return res.json(data)
}).catch(function(err){
  console.log(err)
});
});

router.post('/updateItem', function (req, res, next) {
  User.find({_id: req.body.userID}).then(function(user){  
    for (let i = 0; i < user[0].items.length; i++){   
          if(user[0].items[i]._id == req.body.itemID){
            const newData = User.updateOne(
              {
                "items._id": user[0].items[i]._id,
              }, 
              {$set:
                {
                  "items.$.name":req.body.name,
                  "items.$.quantity":req.body.quantity,
                  "items.$.unit":req.body.unit,
          }, new: true})
            return newData
          }      
   }
 }).then(function(data){
   return res.json(data)
 }).catch(function(err){
   throw err
 }); 
});

router.post('/deleteRecipe', function(req, res) {
  // Remove a note using the objectID
  User.update(
    {"_id": ObjectID(req.body.userID)}, {$pull: {meals:{_id:ObjectID(req.body.recipeID)}}})         
.then(function(data){
  return res.json(data)
}).catch(function(err){
  console.log(err)
});
});

router.post('/cooking', function(req, res) {
  // Remove a note using the objectID
  User.update(
    {"_id": ObjectID(req.body.userID)}, {cookingId:req.body.cookingId})         
.then(function(data){
  return res.json(data)
}).catch(function(err){
  console.log(err)
});
});

router.post('/finishTime', function(req, res) {
  // Remove a note using the objectID
  User.update(
    {"_id": ObjectID(req.body.userID)}, {finishTime:req.body.finishTime})         
.then(function(data){
  return res.json(data)
}).catch(function(err){
  console.log(err)
});
});

router.post('/wash', function(req, res) {
  // Remove a note using the objectID
  User.update(
    {"_id": ObjectID(req.body.userID)}, {washLoads:req.body.washLoads})         
.then(function(data){
  return res.json(data)
}).catch(function(err){
  console.log(err)
});
});

router.get('/AllItems/:query', function (req,res) {
  User.find({_id: req.params.query}).then(function(user){
    return res.json(user);
  })
});

module.exports = router;


