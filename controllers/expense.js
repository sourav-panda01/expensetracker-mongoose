const User = require("../models/user");
const Expense = require("../models/expense");

exports.getexpense=(req,res)=>{
    console.log('in getexpense controller',req.user)
    Expense.find({userId:req.user.id})
        .then(expense => {
          res.json({Expenses:expense , success:true,user:req.user})
    })
    .catch(err=>{
        res.status(500).json({err,success:false})
    })
}

exports.pagination=(req,res)=>{
    console.log("Inside pagination controller");
    const pagenumber=req.query.page
    const Limit=10

    // const startIndex=(pagenumber-1)*limit
    // const endIndex=pagenumber*limit

    Expense.find({userId:req.user.id}).skip(pagenumber*Limit).limit(Limit)
    .then(
        expense => {res.json({Expenses:expense , success:true,user:req.user})
    })
    .catch(err => {
        return res.status(403).json({success : false, error: err})
    })
}




exports.addexpense = (req, res) => {
    console.log('in addexpense',req.body)
    const { amount, description, category } = req.body;
    Expense.create({ amount, description, category,userId:req.user.id }).then(expense => {
        console.log("---expense created")
        return res.status(201).json({expense, success: true } );
    }).catch(err => {
        return res.status(403).json({success : false, error: err})
    })
}




exports.deleteexpense = (req,res,next)=>{
    console.log("inside delete expense controller")
    console.log(req.params,"---")
    const expenseid = req.params.id;
    console.log(expenseid)
    
    Expense.findByIdAndDelete({ id: expenseid }).then(() => {
        res.status(204).json({ success: true, message: "Deleted Successfuly"})
    }).catch(err => {
        console.log(err);
        return res.status(403).json({ success: true, message: "Failed"})
    })
}

    

exports.showallUserPremium=(req,res,next)=>{
    User.find()
    .then(users=>{
        console.log("Inside get show all")
        res.status(200).json({users,success:true})
    })
}
  
  
exports.seeExpenseOfUser = (req,res,next)=>{
    const id =  req.params.id
    Expense.find({userId:id})
    .then(users=>{
    res.status(200).json({users,success:true})
    })
}
