import React, {useEffect, useState} from "react";
import axios from "axios";
import * as events from "node:events";

export const OrderBook = ({symbol}) => {
    const [orderBook,setOrderbook]=useState({asks:[],bids:[]});
    const [loading,setLoading]=useState(true);
    const [maxAskVolume,setAskVolume]=useState(1);
    const [maxBidVolume,setBidVolume]=useState(1);
    const [ws,setWs]=useState(null)
    async function getOrderBook(){
        let currentTotal=0;
        const res=(await axios.get(`http://localhost:5000/api/depth?symbol=${symbol}`)).data.data;
        const releventAsks=res.asks.slice(0,8);
        const releventBids=res.bids.slice(0,8);
        const asksWithTotal=[];
        const bidsWithTotal=[];
        for(let i=0;i<releventAsks.length;i++){
            const [price,quantity]=releventAsks[i];
            asksWithTotal.push([parseFloat(price).toFixed(5),parseFloat(quantity).toFixed(5),parseFloat(currentTotal+=parseFloat(quantity)).toFixed(5)])
        }
        setAskVolume(currentTotal)
        currentTotal=0;

        for(let i=0;i<releventBids.length;i++){
            const [price,quantity]=releventBids[i];
            bidsWithTotal.push([parseFloat(price).toFixed(5),parseFloat(quantity).toFixed(5),parseFloat(currentTotal+=parseFloat(quantity)).toFixed(5)])
        }
        setBidVolume(currentTotal)
        setOrderbook({bids:bidsWithTotal,asks: asksWithTotal.reverse()})
        setLoading(false)
        const ws=new WebSocket("ws://localhost:8080");
        ws.onopen=()=> {
            ws.send(JSON.stringify({type: "SUBSCRIBE", coin: symbol.toLowerCase()}))
        }
        ws.onmessage=(event)=>{
            let obj=JSON.parse(event.data)
            setOrderbook({asks:obj.a.slice(0,8).reverse(),bids:obj.b.slice(0,8).reverse()})
        }

    }
    useEffect(()=>{
            getOrderBook()
        }
        ,[])
    return (

        loading ?
            <div className="min-h-screen flex justify-center items-center bg-black">
                <div role="status">
                    <svg aria-hidden="true"
                         className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"/>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
            :
            <div className=" bg-gray-900 border border-gray-800 rounded m-1 w-80 flex flex-col">
                <div className="border-b border-gray-800 p-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-white font-medium">Order Book</h3>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <div className="px-4 py-2 border-b border-gray-800">
                        <div className="flex justify-between text-xs text-gray-400"
                             style={{fontFamily: 'Inter, sans-serif'}}>
                            <span>Price (USDT)</span>
                            <span>Size ({symbol.slice(0,3)})</span>
                        </div>
                    </div>
                    {/* Asks */}
                    <div className="relative">
                        {orderBook.asks && Array.isArray(orderBook.asks) && orderBook.asks.map((ask, idx) => (
                            <div key={idx}
                                 className="flex justify-between items-center px-4 py-1 hover:bg-gray-800 relative">
                                <div className="absolute inset-0 bg-red-500 opacity-10"
                                     style={{width: `${(ask[1] /maxAskVolume ) * 100}%`}}></div>
                                <span className="text-red-400 text-sm relative z-10"
                                      style={{fontFamily: 'Inter, sans-serif'}}>{parseFloat(ask[0]).toFixed(4)}</span>
                                <span className="text-white text-sm relative z-10"
                                      style={{fontFamily: 'Inter, sans-serif'}}>{parseFloat(ask[1]).toFixed(4)}</span>
                            </div>
                        ))}
                    </div>
                    {/* Spread */}
                    <div className="px-4 py-2 bg-gray-800 border-y border-gray-700">
                        <div className="flex justify-between items-center">
                            <span className="text-yellow-400 text-sm"
                                  style={{fontFamily: 'Inter, sans-serif'}}>{((parseFloat(orderBook.asks[orderBook.asks.length - 1][0]) + parseFloat(orderBook.bids[0][0])) / 2).toFixed(3)}</span>
                        </div>
                    </div>

                    {/* Bids */}
                    <div className="relative">
                        {orderBook.bids && Array.isArray(orderBook.bids) && orderBook.bids.map((bid, idx) => (
                            <div key={idx}
                                 className="flex justify-between items-center px-4 py-1 hover:bg-gray-800 relative">
                                <div className="absolute inset-0 bg-green-500 opacity-10"
                                     style={{width:`${(bid[1]/maxBidVolume)*100}%`}}></div>
                                <span className="text-green-400 text-sm relative z-10"
                                      style={{fontFamily: 'Inter, sans-serif'}}>{parseFloat(bid[0]).toFixed(4)}</span>
                                <span className="text-white text-sm relative z-10"
                                      style={{fontFamily: 'Inter, sans-serif'}}>{parseFloat(bid[1]).toFixed(4)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
    );
};