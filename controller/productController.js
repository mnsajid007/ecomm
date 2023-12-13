const fs = require('fs');
const productModel = require('../model/productModel');
const slugify  = require('slugify');
var braintree = require("braintree");
const orderModel = require('../model/orderModel');

// var gateway = new braintree.BraintreeGateway({
//   environment: braintree.Environment.Sandbox,
//   merchantId: process.env.MID,
//   publicKey: process.env.PUBLIC,
//   privateKey: process.env.PRIVATE,
// });

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "vpz2zhhp6nr8yxz6",
    publicKey: "d232g5hdsrbzr6px",
    privateKey: "008a9117e73846e7fa13a68e76f77695",
  });

exports.createProductCon = async(req, res)=> {
    try {
         const {name, slug, description, price, category, quantity, shipping} =  req.fields;
         const {photo} = req.files;

         if(!name || !description || !price || !category || !quantity || !shipping || !photo || photo.size > 1000000){
            return res.status(400).send({
                success: false,
                message: 'name or slug field is required'
            })
         }

         const products = new productModel({...req.fields, slug:slugify(name)});
         if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
         }
         await products.save();
         return res.status(200).send({
            success: true,
            message: 'product created success',
            products
         })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'error in product callback'
        })
    }
}

exports.updateProduct = async(req, res)=> {
    try {
        const {name, slug, description, price, category, quantity, shipping} =  req.fields;
        const {photo} = req.files;

        
         const update = await productModel.findByIdAndUpdate(req.params.pid, {...req.fields, slug:slugify(name)}, {new:true})
         
         if(photo){
            update.photo.data = fs.readFileSync(photo.path);
            update.photo.contentType = photo.type;
         }

         res.status(200).send({
            success: true,
            message: "prodct updated",
            update
         })
    } 
        catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: 'error in product callback'
            })
    }
}

exports.getAllProduct = async(req, res)=>{
    try {
        const size = req.query.size ? req.query.size : 6;
        const getData = await productModel.find({}).limit(size).select('-photo').sort({createdAt: -1}).populate('category');

        return res.status(200).send({
            success: true,
            message:'get all product',
            getData,
            total:getData.length
        })
        
    } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: 'error in product callback'
            })
        }
    }

    exports.getSingleProd = async(req, res)=>{
        try {
            
            const single = await productModel.findOne({slug:req.params.slug}).select('-photo').populate('category');

            return res.status(200).send({
                success: true,
                message: 'single product by slug',
                single
            })

        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: 'error in product callback'
            })
        }
    }

    exports.deleteProduct = async(req, res)=>{
        try {
            
            const single = await productModel.findByIdAndDelete(req.params.pid);

            return res.status(200).send({
                success: true,
                message: 'product deleted',
                single
            })

        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: 'error in delete callback'
            })
        }
    }

    exports.getPhoto = async(req, res)=>{
        try {
            
            const single = await productModel.findById(req.params.pid).select('photo');

            if(single.photo.data){
                res.set('content-type', single.photo.contentType)
                return res.status(200).send(single.photo.data)
            }

        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: 'error in photo callback'
            })
        }
    }

    exports.filterProd = async(req, res) =>{
        try {
            const {check} = req.body;
            let args = {};
            if(check.length > 0) args.category = check;
            const product = await productModel.find({category: check}).select('-photo'); 
            res.status(200).send({
                success: true,
                message: 'filter product',
                product
            })

        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: 'error in photo callback'
            })
        }
    }

    exports.productCount = async(req, res)=> {
        try {
            const total = await productModel.find({}).estimatedDocumentCount();
            res.status(200).send({
                success:true,
                total
            })
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: 'error in count'
            })
        }
    }

    exports.productList = async(req, res)=> {
        try {
            const perPage = 6;
            const page = req.params.page;
            const product = await productModel.find().limit(perPage).skip((page-1) * perPage).sort({createdAt:-1}).populate('category');
            res.status(200).send({
                success:true,
                product
            })
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: 'error in list count'
            })
        }
    }

    exports.searchProduct = async(req, res)=>{
        try {
            const {keyword} = req.params;
            console.log(req.params.key)
            const product = await productModel.find({
                "$or": [
                    {name: {$regex:req.query.key}},
                    {description: {$regex:req.query.key}}
                ]
            }).select("-photo");
            // res.json(product);
            return res.status(200).send({
                success: true,
                product
            })
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: 'error search'
            })
        }
    }

    //order details

    exports.orderDetails = async(req, res)=> {
        try {
            const order = await orderModel.find({buyer: req.user._id}).select('-photo').populate('buyer');
            if(order){
                return res.status(200).send({
                    success: true,
                    message: 'order find',
                    order
                })
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                success: false,
                message: 'error oreder detail'
            })
        }
    }

    //braintree

    exports.braintreeToken = async(req, res) => {
        try {
            gateway.clientToken.generate({}, function(err, response){
                if(err){
                    res.status(500).send(err)
                }else{
                    res.send(response);
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    //braintree payment

    exports.braintreePayment = async(req, res) => {
        try {
           const {cart, nonce} = req.body;
          let total = 0;
          cart.map((i)=> {
          total += i.price * i.qty;
          })

          let newTransaction = gateway.transaction.sale({
            amount: total + 50,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
          }, 
          function (error, result) {
           if(result){
            const order = new orderModel({
                product : [...cart],
                payment : result,
                buyer: req.user._id
            }).save();
            res.json({ok: true})
           }else{
            console.log(error)
           }     
          }
          )
        } catch (error) {
            console.log(error)
        }
    }
