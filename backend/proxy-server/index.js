const express=require('express')
const cors=require('cors')
const app=express()
const axios=require('axios')
app.use(cors())

app.get("/api/proxy",async (req,res)=>{
const data=(await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,binancecoin")).data;
res.json({
    data
})
})

app.get("/api/coin",async (req,res)=>{
    const symbol=req.query.symbol;
    const data=(await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${symbol}`)).data;
    res.json({
        data
    })
})

app.get("/api/depth",async (req,res)=>{
    const symbol=req.query.symbol;
    const data=(await axios.get(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=100`)).data;
    res.json({
        data
    })
})

app.listen(5000)