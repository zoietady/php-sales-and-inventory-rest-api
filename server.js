require('dotenv').config()

const express = require('express');
const app = express();

const data = require("./data.js");

app.use(express.json());

const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const inventoryRouter = require('./routes/inventory');
const salesRouter = require('./routes/sales');


app.use('/auth',authRouter);
app.use('/users',userRouter);
app.use('/admin',adminRouter);
app.use('/inventory',inventoryRouter);
app.use('/sales',salesRouter);


app.listen(3000, () => console.log(`server started`))