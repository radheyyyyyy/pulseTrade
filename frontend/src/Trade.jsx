import React, { useState } from 'react';
import { PriceTicker } from "./components/PriceTicker.jsx";
import { Header } from "./components/Header.jsx";
import { OrderBook } from "./components/OrderBook.jsx";
import { TradingPanel } from "./components/TradePanel.jsx";
import { ChartSection } from "./components/ChartSection.jsx";
import { useSearchParams } from "react-router-dom";

const Trade = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [searchParams] = useSearchParams();


    return (
        <div className="min-h-screen bg-gray-900 text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Montserrat&display=swap" rel="stylesheet" />

            <Header onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
            <PriceTicker market={searchParams.get("symbol") || "bitcoin"} />

            <div className="flex min-h-screen">
                {/* Left Side - Chart */}
                <div className="flex-1 min-h-screen">
                    <ChartSection symbol={searchParams.get("symbol") || "BTCUSDT"} />
                    <div className='border rounded border-gray-800'>
                        Orders Tab
                    </div>
                </div>

                {/* Right Side - Order Book, Trading Panel, Trade History */}
                <div className="flex">
                    <OrderBook key={searchParams.get("symbol") || "BTCUSDT"}  symbol={searchParams.get("symbol") || "BTCUSDT"} />
                    <TradingPanel />
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
                    <div className="bg-gray-900 w-64 h-full border-r border-gray-800">
                        <div className="p-4 border-b border-gray-800">
                            <div className="flex items-center justify-between">
                                <span className="text-white font-bold">Menu</span>
                                <button onClick={() => setMobileMenuOpen(false)}>
                                    <X className="text-gray-400" size={24} />
                                </button>
                            </div>
                        </div>
                        <nav className="p-4 space-y-4">
                            <a href="#" className="block text-gray-300 hover:text-white">Spot</a>
                            <a href="#" className="block text-gray-300 hover:text-white">Futures</a>
                            <a href="#" className="block text-gray-300 hover:text-white">Options</a>
                            <a href="#" className="block text-gray-300 hover:text-white">Margin</a>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Trade;
