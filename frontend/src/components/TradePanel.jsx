import React, {useState} from "react";

export const TradingPanel = () => {
    const [orderType, setOrderType] = useState('limit');
    const [side, setSide] = useState('buy');
    const [price, setPrice] = useState('107926.1');
    const [quantity, setQuantity] = useState('0');
    const [percentage, setPercentage] = useState(0);

    const handlePercentageChange = (percent) => {
        setPercentage(percent);
        // Calculate quantity based on percentage
        const maxQuantity = 0.1; // Mock available balance
        setQuantity((maxQuantity * percent / 100).toFixed(6));
    };

    return (
        <div className="bg-gray-900 border rounded m-1 border-gray-800 w-70 flex flex-col">
            <div className="border-b border-gray-800 p-4">
                <div className="flex bg-gray-800 rounded-lg">
                    <button
                        onClick={() => setSide('buy')}
                        className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-lg ${
                            side === 'buy' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Buy / Long
                    </button>
                    <button
                        onClick={() => setSide('sell')}
                        className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-lg ${
                            side === 'sell' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Sell / Short
                    </button>
                </div>
            </div>

            <div className="flex-1 p-4 space-y-4">
                {/* Order Type */}
                <div className="flex bg-gray-800 rounded-lg">
                    <button
                        onClick={() => setOrderType('limit')}
                        className={`flex-1 py-2 px-3 text-sm rounded-l-lg ${
                            orderType === 'limit' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Limit
                    </button>
                    <button
                        onClick={() => setOrderType('market')}
                        className={`flex-1 py-2 px-3 text-sm ${
                            orderType === 'market' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Market
                    </button>
                </div>

                {/* Available Balance */}
                <div className="text-sm">
                    <div className="flex justify-between text-gray-400">
                        <span>Available Equity</span>
                        <span>0 USD</span>
                    </div>
                </div>

                {/* Price Input */}
                <div>
                    <label className="text-sm text-gray-400">Price</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Quantity Input */}
                <div>
                    <label className="text-sm text-gray-400">Quantity</label>
                    <input
                        type="text"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Order Value */}
                <div className="text-sm">
                    <div className="flex justify-between text-gray-400">
                        <span>Order Value</span>
                        <span>0</span>
                    </div>
                </div>

                {/* Margin Required */}
                <div className="text-sm">
                    <div className="flex justify-between text-gray-400">
                        <span>Margin Required</span>
                        <span>-</span>
                    </div>
                </div>

                {/* Place Order Button */}
                <button className={`w-full py-3 rounded-lg font-medium ${
                    side === 'buy'
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                }`}>
                    {side === 'buy' ? 'Buy/Long' : 'Sell/Short'}
                </button>
            </div>
        </div>
    );
};
