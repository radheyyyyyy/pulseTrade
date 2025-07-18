const redis=require('redis')
const client=redis.createClient();
const express=require('express')
const app=express();

const bids=[]
const asks=[]
const booksWithQuantity={bid:{},ask:{}}
let GLOBAL_TRADE=0;
async function run(){
    console.log("orderBook server running")
    try {
        await client.connect();
        while (1){
            const data=JSON.parse((await client.brPop("orders", 0)).element)
            const res=fillOrder(data)
        }
    }
    catch (e) {
        console.log(e)
    }
}


function fillOrder(obj){
    const fills=[];



    //const totalQuantityAvailable=maxFillQuantity(obj.side,obj.price);
    if(obj.side==="buy"){
        let executedQuantity=0;
        asks.sort((a, b) => a.price - b.price);
        asks.forEach((o)=>{
            if(o.price<=obj.price && obj.quantity>0){
                const filledQuantity=Math.min(o.quantity,obj.quantity);
                o.quantity-=filledQuantity;
                booksWithQuantity.ask[o.price]=booksWithQuantity.ask[o.price]-filledQuantity;
                fills.push({
                    price:o.price,
                    qty:filledQuantity,
                    tradedId:GLOBAL_TRADE++
                });
                executedQuantity+=filledQuantity;
                obj.quantity-=filledQuantity;
                if(o.quantity===0){
                    asks.splice(asks.indexOf(o),1);
                }
                if(booksWithQuantity.ask[obj.price]===0){
                    delete booksWithQuantity.ask[obj.price]
                }

            }
        })
        if (obj.quantity !== 0) {
            bids.push({
                price:obj.price,
                quantity: obj.quantity - executedQuantity,
                side: 'buy',
            });
            booksWithQuantity.bid[obj.price] = (booksWithQuantity.bid[obj.price] ||0) + (obj.quantity - executedQuantity);
        }
        return {
            executedQuantity,
            fills
        }
    }
    else {
        let executedQuantity=0;
        bids.sort((a, b) => b.price - a.price);
        bids.forEach((o)=> {
            if (o.price >= obj.price && obj.quantity > 0) {
                const filledQuantity = Math.min(o.quantity, obj.quantity);
                o.quantity -= filledQuantity;
                booksWithQuantity.bid[o.price] = booksWithQuantity.bid[o.price] - filledQuantity;
                fills.push({
                    price: o.price,
                    qty: filledQuantity,
                    tradedId: GLOBAL_TRADE++
                });
                executedQuantity += filledQuantity;
                obj.quantity -= filledQuantity;
                if (o.quantity === 0) {
                    bids.splice(bids.indexOf(o), 1);
                }
                if (booksWithQuantity.bid[obj.price] === 0) {
                    delete booksWithQuantity.bid[obj.price]
                }

            }
        })
        if (obj.quantity !== 0) {
            asks.push({
                price: obj.price,
                quantity: obj.quantity - executedQuantity,
                side: 'sell',
            });
            booksWithQuantity.ask[obj.price] = (booksWithQuantity.ask[obj.price] || 0) + (obj.quantity - executedQuantity);

        }
        return {
            executedQuantity,
            fills
        }
    }

}


run();

app.get("/orderbook",(req,res)=>{
    res.json({
        booksWithQuantity
    })
})

app.listen(5000)