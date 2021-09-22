  
if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
// const cors = require('cors');

const data = require("./data.js");

app.use(express.json());
app.use(cookieParser());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const inventoryRouter = require('./routes/inventory');
const salesRouter = require('./routes/sales');
const productsRouter = require('./routes/products');
const supplierRouter = require('./routes/supplier');
const deliveryRouter = require('./routes/delivery');

app.get("/", (req,res)=>{
    res.send("Sales and inventory system api");
});

app.use('/auth',authRouter);
app.use('/users',userRouter);
app.use('/admin',adminRouter);
app.use('/inventory',inventoryRouter);
app.use('/sales',salesRouter);
app.use('/products',productsRouter);
app.use('/supplier',supplierRouter);
app.use('/delivery',deliveryRouter);


app.listen(process.env.PORT || 5000, () => console.log(`server started`));

