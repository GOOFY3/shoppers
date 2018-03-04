var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/shoppers');
var cors = require('cors');

var Product = require('./models/product');
var WishList = require('./models/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

//new Product
app.post('/product', function(req,res){
  var product = new Product();
  product.title = req.body.title;
  product.price = req.body.price;
  product.save(function(err, savedProduct){
    if(err){
      res.status(500).send({error:"That didn't work!"});
    } else {
      res.send(savedProduct);
    }
  });
});

//list of products
app.get('/product', function(req,res){
  Product.find({}, function(err, products){
    if(err){
      res.status(500).send({error:"Oops that did't work!"});
    } else {
      res.send(products);
    }
  });
});

//creating wishList
app.post('/wishlist', function(req,res){
  var wishList = new WishList();
  wishList.title = req.body.title;

  wishList.save(function(err, newWishList){
    if(err){
      res.status(500).send({error: "that failed!"});
    }else{
      res.send(newWishList);
    }
  });
});

//list of wishlists
app.get('/wishlist', function(req,res){
  WishList.find({}).populate({path:'products', model:'Product'}).exec(function(err, wishLists){
    if(err){
      res.status(500).send("failed!");
    }else{
      res.status(200).send(wishLists);
    }
  });
});

//updating wishLists
app.put('/wishlist/product/add', function(req,res){
  Product.findOne({_id: req.body.productId}, function(err, product){
    if(err){
      res.status(500).send({error:"failed!"});
    }else{
      WishList.update({_id:req.body.wishListId},{$addToSet:{products:product._id}},function(err,wishList){
        if(err){
          res.status(500).send({error:"failed!"});
        }else{
          res.send(wishList);
        }
      });
    }
  });
});

app.listen(3004, function(){
  console.log("App up and running on port 3004!");
});
