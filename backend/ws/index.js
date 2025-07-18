const express= require('express');
const ws=require('ws')
const {WebSocketServer} = require("ws");
const events = require("node:events");
const app=express();
const httpServer=app.listen(8080);
const wssServer=new ws.WebSocketServer({server:httpServer});

wssServer.on('connection',(ws)=>{
    console.log("Connected")
    ws.on('message',(data)=>{
        const msg=JSON.parse(data)
        console.log(msg)
        if(msg.type==="SUBSCRIBE"){
           const websocket=new WebSocket(`wss://stream.binance.com:9443/ws/${msg.coin}@depth`)
            websocket.onmessage=(event)=>{
               if(ws.readyState===WebSocket.OPEN) {
                   ws.send(event.data)
               }
            }

        }
    })
})