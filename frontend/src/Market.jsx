import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {Header} from "./components/Header.jsx";
import {useNavigate} from "react-router-dom";
import axios from "axios";
export const Market = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('volume');
    const [sortOrder, setSortOrder] = useState('desc');
    const navigate=useNavigate();
    const [markets, setMarkets] = useState([]);
    const [loading,setLoading]=useState(true);
    async function getTickerData(){
        const res=await axios.get("http://localhost:5000/api/proxy") ;
        res.data.data.map((coin)=>{
            const obj={
                name:coin.name,
                symbol:coin.symbol.toUpperCase()+"USDT",
                price:coin.current_price,
                change24h:coin.price_change_24h,
                changePercent:coin.price_change_percentage_24h,
                volume:coin.total_volume,
                high24h:coin.high_24h,
                low24h:coin.low_24h,
                marketCap:coin.market_cap,
                icon:coin.image
            }
            setMarkets(markets=>[...markets,obj])
        })
        setLoading(false)
    }
    useEffect(()=>{
        getTickerData()
    },[])

    const formatNumber = (num) => {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toFixed(2);
    };

    const formatPrice = (price) => {
        if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (price >= 1) return price.toFixed(4);
        return price.toFixed(6);
    };

    const filteredMarkets = markets.filter(market => {
        const matchesSearch = market.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            market.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || market.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const sortedMarkets = [...filteredMarkets].sort((a, b) => {
        let aValue, bValue;
        switch (sortBy) {
            case 'price':
                aValue = a.price;
                bValue = b.price;
                break;
            case 'change':
                aValue = a.changePercent;
                bValue = b.changePercent;
                break;
            case 'volume':
                aValue = a.volume;
                bValue = b.volume;
                break;
            case 'marketCap':
                aValue = a.marketCap;
                bValue = b.marketCap;
                break;
            default:
                aValue = a.symbol;
                bValue = b.symbol;
        }

        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });


    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
    };

    return (
        loading ?
            <div className="min-h-screen flex justify-center items-center bg-black">
            <div role="status">
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
            <div className="min-h-screen bg-black text-white" style={{fontFamily: 'Inter, sans-serif'}}>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Montserrat&display=swap"
                    rel="stylesheet"/>

                {/* Header */}
                <Header/>

                {/* Markets Table */}
                <div className="p-6">
                    <div className="bg-gray-900 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    <div className="flex items-center space-x-2">
                                        <span>Market</span>
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                                    onClick={() => handleSort('price')}
                                >
                                    <div className="flex items-center justify-end space-x-2">
                                        <span>Price</span>
                                        {sortBy === 'price' && (
                                            sortOrder === 'asc' ? <TrendingUp className="w-4 h-4"/> :
                                                <TrendingDown className="w-4 h-4"/>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                                    onClick={() => handleSort('change')}
                                >
                                    <div className="flex items-center justify-end space-x-2">
                                        <span>24h Change</span>
                                        {sortBy === 'change' && (
                                            sortOrder === 'asc' ? <TrendingUp className="w-4 h-4"/> :
                                                <TrendingDown className="w-4 h-4"/>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                                    onClick={() => handleSort('volume')}
                                >
                                    <div className="flex items-center justify-end space-x-2">
                                        <span>24h Volume</span>
                                        {sortBy === 'volume' && (
                                            sortOrder === 'asc' ? <TrendingUp className="w-4 h-4"/> :
                                                <TrendingDown className="w-4 h-4"/>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                                    onClick={() => handleSort('marketCap')}
                                >
                                    <div className="flex items-center justify-end space-x-2">
                                        <span>Market Cap</span>
                                        {sortBy === 'marketCap' && (
                                            sortOrder === 'asc' ? <TrendingUp className="w-4 h-4"/> :
                                                <TrendingDown className="w-4 h-4"/>
                                        )}
                                    </div>
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                            {sortedMarkets.map((market) => (
                                <tr key={market.symbol} onClick={() => {
                                    navigate(`/trade?symbol=${market.symbol}`)
                                }} className="cursor-pointer hover:bg-gray-800 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    <img src={market.icon}/>
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium">{market.symbol}</div>
                                                    <div className="text-gray-400 text-sm">{market.name}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="text-white">${formatPrice(market.price)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className={`font-medium ${
                                            market.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                                        }`}>
                                            {market.changePercent >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%
                                        </div>
                                        <div className={`text-sm ${
                                            market.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                            {market.changePercent >= 0 ? '+' : ''}${market.change24h.toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="text-white">${formatNumber(market.volume)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="text-white">${formatNumber(market.marketCap)}</div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
    );
};
