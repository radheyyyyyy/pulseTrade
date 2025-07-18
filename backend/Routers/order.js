const express=require('express')
const z=require('zod');
const redis=require("redis")
const orderRouter=express.Router();
const client=redis.createClient();
const orderSchema=z.object({
    type:z.literal("limit").or(z.literal("market")),
    market:z.string(),
    price:z.number(),
    quantity:z.number(),
    side:z.literal("buy").or(z.literal("sell"))
})
client.connect().then(()=>{
    console.log("Connected to redis successfully")
}).catch((err)=>{
    console.log(err)
})
orderRouter.post("/",async (req,res)=>{
    const order=req.body;
    if(!orderSchema.safeParse(order).success){
        res.json({
            msg:"invalid_inputs"
        })
        return
    }
    if(order.market!=="BTCUSD"){
        res.json({
            msg:"wrong_asset"
        })
        return
    }
    await client.lPush("orders",JSON.stringify(order));
    res.json({
        msg:"order_placed"
    })

})

module.exports={
    orderRouter
}