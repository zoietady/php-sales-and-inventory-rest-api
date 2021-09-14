require('dotenv').config()

const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");

const data = require("./data.js");

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const inventoryRouter = require('./routes/inventory');
const salesRouter = require('./routes/sales');
const productsRouter = require('./routes/products');
const deliveryRouter = require('./routes/supplier');
const supplierRouter = require('./routes/delivery');


app.use('/auth',authRouter);
app.use('/users',userRouter);
app.use('/admin',adminRouter);
app.use('/inventory',inventoryRouter);
app.use('/sales',salesRouter);
app.use('/products',productsRouter);
app.use('/supplier',productsRouter);
app.use('/delivery',productsRouter);


app.listen(3000, () => console.log(`server started`))