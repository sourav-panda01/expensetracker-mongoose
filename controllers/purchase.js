const Razor_pay = require("razorpay");

const Purchase = require("../models/purchase");
const User = require('../models/user')

require('dotenv').config()

exports.purchasePremium = async (req, res, next) => {
  console.log("inside purchase premium sadsadasd===-=----")
  console.log(req,"----this is req")
  try {
    //console.log('Expense Tarcker',purchase.id)
    var instance = new Razor_pay({
      key_id: process.env.Key_Id,
      key_secret: process.env.Key_Secret,
    });
    const amount = 3500;
    console.log("hadbugihigsuicjspcdjn");
    instance.orders.create(
      {
        amount,
        currency: "INR",
      },
    (error, purchase) => {
      console.log(purchase)
      if (error) {
        throw new Error(error,"error in purchase");
    }
        Purchase.create({ purchaseid: purchase.id, status: "PENDING" ,userId:req.user.id})
          .then(() => {
            return res.status(201).json({ purchase, key_id: instance.key_id });
          })
          .catch((error) => {
            throw new Error(error);
          });
      }
    );
    console.log('Hiiiiiiiiiiiiii')
  } catch (error) {
    return res.status(403).json({ message: "Something Went wrong", error });
  }
};



exports.updateStatus = async (req, res, next) => {
  try {
    //console.log(req.body)
    console.log(req.user,"Thi s is user")
    const { paymentId, purchaseId } = req.body;

    let order = await Purchase.create({
      paymentId:paymentId,
      orderId:purchaseId,
      status:"successful",
      userId:req.user._id
  })
  console.log(order);
        if(order.status == "successful" ){
            console.log('sucesss')

            let user = await  User.findById(req.user._id);
            console.log(user);
            user.ispremiumuser = true ;
            await user.save();
            res.status(200).json({message: "Successfully Saved"});
        }
    

      }
      catch(err){
        console.log(err)
      }





    
};