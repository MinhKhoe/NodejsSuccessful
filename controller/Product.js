const path = require('path');
const models = require('../models/Association');
const User = require('./User');

module.exports = {
    getProductById: async(req,res) => {
        const Product = await models.Product.findOne({
            where: {id: req.params.id},
            include: models.Category
        });

        res.status(200).json(Product);
    },

    getProductsByCategory: async(req,res) =>{
        const Products =await models.Category.findAll({include: models.Product});

        res.status(200).json(Products);
    },

    orderProduct: async(req,res) => res.status(200),

    addProduct: async(req,res)=>{
        // try{
            
            const record = await models.Product.create({
                name: req.body.name,
                price: req.body.price,
                description:req.body.description

            });
            let image = req.files.file;
            console.log(path.extname(image.name));
            image.mv(path.resolve(__dirname,'..','public/pics',record.id+""+path.extname(image.name)),async function(err){
                let img_name =record.id+""+path.extname(image.name);
                await models.Product.update({image: img_name}, {
                    where:{
                        id: record.id
                    }
                });
            if (err) {
                return res.status(500).send(err); 
            }});
            res.status(200).json({result: 'successful'});
        // }catch{
        //     res.status(200).json({result: 'failed'});
        // }
    },

    deleteProduct: async(req,res)=>{
        try{ 
            await models.Product.destroy({
                where:{
                    id: req.params.id
                }
            });
            res.status(200).json({result: 'successful'});
        }catch{
            res.status(200).json({result: 'failed'});
        }

    },

    editProduct: async(req,res)=>{
        try{
            console.log(req.body)
            // const product = await models.Product.update({
                // name: req.params.name,
                // price: req.params.price,
                // description: req.params.description,
            // },{
            //     where:{
            //     id: req.params.id
            // }});
            const product = await models.Product.findOne({where:{id: req.params.id}})
            product.set({    
                name: req.body.username,
                price: req.body.price,
                description: req.body.description,
            });

            await product.save();
            console.log(product)
            res.status(200).json({result:'successful'});
        }catch(e){
            console.log(e)
            res.status(200).json({result: 'failed'});
        }
    }

}