const express=require('express')
const {orderRouter} = require("./Routers/order");
const app=express();
app.use(express.json());
app.use('/api/order',orderRouter);

app.listen(3000)