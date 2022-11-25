const uuid = require('uuid');
// const sgMail = require('@sendgrid/mail');
const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');
require('dotenv').config()


const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');

exports.forgotpassword = async(req,res,next)=>{
    try {
      console.log("Inside forget password controller")
        const {email} =req.body ;
        const user = await User.findOne({where:{email}});
        console.log(user,email)
        if(!user){
             return res.status(404).json('User doesnt exist')
        }
        const id = uuid.v4();
        user.createForgotpassword({id , active:true})
        .catch(err => {
            throw new Error(err)
        })

       console.log(email);

        const client = Sib.ApiClient.instance

        const apiKey = client.authentications['api-key']
        apiKey.apiKey = process.env.SENDINBLUE_KEY ;

        console.log(process.env.SENDINBLUE_KEY)
        

        const tranEmailApi = new Sib.TransactionalEmailsApi()

        const sender = {
        	email: 'souravpanda601+abc@gmail.com',
        	name: 'Sourav',
        }

        const receivers = [
        	{
        		email: email ,
        	},
        ]
        
        console.log('////////////////////////////////')

        tranEmailApi
	      .sendTransacEmail({
	    	sender,
	    	to: receivers,
	    	subject: "Reset your password ",
	    	textContent: "follow the link to rest password",
	    	htmlContent: `Click on the link below to reset password <br> <a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
	    })
	    .then((response) => {
            console.log(response)
            return res.status(202).json({message: 'Link to reset password sent to your mail ', sucess: true})
        })
	    .catch(error=>console.log(error))


    } catch (error) {
        return res.json({ message: err, sucess: false });
    }
}

exports.resetpassword = async(req,res,next)=>{

    let  id = req.params.id ;

    try {
        let forgotpasswordrequest = await Forgotpassword.findOne({where:{id}})
        if(!forgotpasswordrequest){
            return res.status(404).json('User doesnt exist')
        }
        forgotpasswordrequest.update({ active:false });
        res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end();
    } catch (err) {
        return res.status(500).json({ message: err});
    }
}

exports.updatepassword = async(req,res,next)=>{
    const { newpassword } = req.query;
    const id = req.params.resetpasswordid;

    console.log(typeof(newpassword) ) 
    try {
        const resetpasswordrequest  = await Forgotpassword.findOne({where:{id}})
        const user = await User.findOne({where:{id:resetpasswordrequest.userId }})
        if(!user){
            return res.status(404).json({ error: 'No user Exists', success: false})
        }

        const saltRounds = 10;
        bcrypt.hash(newpassword, saltRounds, async(err, hash)=>{
            if(err){
                throw new Error(err);
            }
            await user.update({ password:hash })
            res.status(201).json({message: 'Successfuly update the new password'})
        });
        

    } catch (error) {
        return res.status(403).json({ error, success: false } )
    }
}