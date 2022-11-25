const path = require('path');
const cors=require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const app = express();
const dotenv = require('dotenv')
dotenv.config();

const mongoose = require('mongoose')
app.use(bodyParser.json());
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')));

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes=require('./routes/purchase')
const forgotpasswordRoutes=require('./routes/forgotpassword')

app.use(userRoutes)
app.use(expenseRoutes)
app.use(purchaseRoutes)
app.use('/password',forgotpasswordRoutes)
app.use(errorController.get404);
// User.hasMany(Expense);
// User.hasMany(Purchase)
// Purchase.belongsTo(User);
// Expense.belongsTo(User);
// User.hasMany(Forgotpassword);
// Forgotpassword.belongsTo(User);


mongoose.connect('mongodb+srv://sourav:sourav@newmongodbcluster.tcgxxqe.mongodb.net/expensetracker?retryWrites=true&w=majority')
.then(()=>{
    app.listen(3000 , (req,res)=>{
        console.log('running')
    })
})
