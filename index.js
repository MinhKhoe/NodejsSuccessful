const express = require("express");
require("dotenv").config();
const port  =  3000;
const app = express();
const models = require('./models/Association');
const cors = require('cors')

const bodyParser = require('body-parser');
//const {getUserId} = require('./controller/getUserId');
const fileUpload = require('express-fileupload');
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(fileUpload());

const createTable = ()=>{
    let files = [ 'Category','Product','User', 'Cart_Item', 'Order', 'Order_Detail','Order_History']
   
    let models = files.map(file => require('./models/'+file))
    models.map(model => model.sync()) 

}
//const getUserId = async ()=>{
//    let Account = await models.User.findOne({ where: { username: 'dat', password : '12345'} });
//    console.log('abc: ',Account.dataValues.id);
//    return Account.dataValues.id;
//}
//const Account= getUserId();
//console.log('userid:'+Account);
const Controller = (controller)=> require('./controller/'+controller);

app.listen(port, ()=>{
    console.log(`http://localhost:${port}`);
    createTable()
})

app.post('/register/newUser', Controller('User').storeUser);

app.post('/login', Controller('User').Login);

app.put('/product/edit/:id', Controller('Product').editProduct);
app.delete('/product/delete/:id',Controller('Product').deleteProduct);
app.post('/product/add',Controller('Product').addProduct);
app.get('/product/:id', Controller('Product').getProductById);

app.get('/products', Controller('getAllProducts'));

 app.get('/cart/add', Controller('Cart').addCart);

app.get('/categories', Controller('Category').getAllCategories);
app.get('/category/:id/products', Controller('Product').getProductsByCategory);

//app.get('/user/:id/cart', Controller('getCart'));

app.use((err, req, res, next)=> res.status(404));
app.use((err, req, res, next)=> res.status(500));

app.use('/login', (req, res) => {
    res.send({
        token: 'test123'
    });
});