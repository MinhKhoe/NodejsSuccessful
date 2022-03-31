const models = require('../models/Association');
const jwt = require("jsonwebtoken");

async function generateToken  (data) {
    const token = await jwt.sign({ data }, ""+process.env.JWT_KEY, {
      expiresIn: "7d",
    });
  
    return { token };
}

module.exports ={
    storeUser: async function (req, res) {
        //console.log(req.body.username);
        try{
            const record = await models.User.create({
                username: req.body.username,
                password: req.body.password,
                first_name:  req.body.first_name,
                last_name: req.body.last_name
            });
            res.status(200).json({result: 'successful'});
        }catch{
            res.status(200).json({result: 'failed'});
        }

    },
    Login: async function(req,res){
        try{
            if(req.body.username.length==0 || req.body.password.length==0)
                res.status(200).json({result:'failed'});

            const Account = await models.User.findOne({ where: { username: req.body.username } });
            // console.log(Account.password);
            if(req.body.password == Account.password){
                const { token } = await generateToken(Account.dataValues.id);
                res.status(200).json({result: 'successful',token,id:Account.dataValues.id});

            }else{
                res.status(200).json({result: 'failed'});
            }
            
        }catch{
           res.status(200).json({result: 'failed'});
        }
        
        
    }
    
}