import React, { useEffect, useState, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import apiService from '../screens/service/apiService';

const LiveMetalsTicker = () => {
    const containerRef = useRef(null);
    const chartRef = useRef(null);
    const seriesRef = useRef(null);
    const [goldPrice, setGoldPrice] = useState({ current: 0, change: 0, changePercent: 0 });
    const [silverPrice, setSilverPrice] = useState({ current: 0, change: 0, changePercent: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('gold');
    const eventSourceRef = useRef(null);
    const pollingIntervalRef = useRef(null);

    // Initialize Chart
    useEffect(() => {
        if (!containerRef.current) return;

        const chart = createChart(containerRef.current, {
            layout: {
                textColor: '#333',
                background: { color: '#ffffff' },
            },
            width: containerRef.current.clientWidth,
            height: 400,
            timeScale: {
                timeVisible: true,
                secondsVisible: true,
            },
        });

        const series = chart.addLineSeries({
            color: activeTab === 'gold' ? '#FFD700' : '#C0C0C0',
            lineWidth: 2,
        });

        chartRef.current = chart;
        seriesRef.current = series;

        // Handle window resize
        const handleResize = () => {
            if (containerRef.current && chart) {
                chart.applyOptions({
                    width: containerRef.current.clientWidth,
                });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    // Update chart color when tab changes
    useEffect(() => {
        if (seriesRef.current) {
            seriesRef.current.applyOptions({
                color: activeTab === 'gold' ? '#FFD700' : '#C0C0C0',
            });
            updateChartData(activeTab);
        }
    }, [activeTab]);

    // Fetch initial data and setup SSE
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                console.log('🔄 Fetching live metals prices...');

                // Fetch live price data
                const result = await apiService.metals.getLivePrice();
                console.log('📊 Live metals response:', result);

                if (result.success && result.data) {
                    const { data } = result;

                    // Handle response structure
                    const goldData = data.gold || data.GOLD || {};
                    const silverData = data.silver || data.SILVER || {};

                    setGoldPrice({
                        current: goldData.current || goldData.price || 0,
                        change: goldData.change || 0,
                        changePercent: goldData.changePercent || goldData.change_percent || 0,
                    });

                    setSilverPrice({
                        current: silverData.current || silverData.price || 0,
                        change: silverData.change || 0,
                        changePercent: silverData.changePercent || silverData.change_percent || 0,
                    });

                    // Plot initial data on chart
                    if (seriesRef.current && goldData.history) {
                        const chartData = Array.isArray(goldData.history)
                            ? goldData.history.map((point) => ({
                                time: Math.floor(point.timestamp / 1000),
                                value: point.price || point.current,
                            }))
                            : [];

                        if (chartData.length > 0) {
                            seriesRef.current.setData(chartData);
                            if (chartRef.current) {
                                chartRef.current.timeScale().fitContent();
                            }
                        }
                    }
                }

                setError('');
            } catch (err) {
                console.error('❌ Error fetching metals data:', err);
                setError('Failed to fetch live rates. Retrying with polling...');
                // Start polling as fallback
                startPolling();
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();

        // Setup SSE subscription for real-time updates
        setupSSESubscription();

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, []);

    const setupSSESubscription = () => {
        try {
            console.log('📡 Setting up SSE subscription for live metals prices...');
            // Use a base URL and construct the full path. This is more robust.
            // Ensure VITE_API_URL is set to your backend's base URL (e.g., http://localhost:3000 or https://api.dgi.gold)
            const apiUrl = import.meta.env.VITE_API_URL || '';
            // Remove trailing slashes and /api/v1 if they exist to get a clean base
            const cleanBaseUrl = apiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
            const eventSourceUrl = `${cleanBaseUrl}/api/v1/metals/subscribe-live`;

            console.log(`🔌 Connecting to SSE at: ${eventSourceUrl}`);
            const eventSource = new EventSource(eventSourceUrl);

            eventSource.onopen = () => {
                console.log('✅ SSE connection established for live metals');
                setError('');
            };

            // Handle standard messages
            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('📨 Received price update:', data);
                    updatePricesFromData(data);
                } catch (err) {
                    console.error('❌ JSON Parse Error:', err);
                }
            };

            // Handle price-update events
            eventSource.addEventListener('price-update', (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('💹 Price update event:', data);
                    updatePricesFromData(data);
                } catch (err) {
                    console.error('❌ Price Update Parse Error:', err);
                }
            });

            // Handle error events
            eventSource.addEventListener('error', (event) => {
                console.error('❌ SSE "error" event received:', event);
                // The EventSource object is designed to automatically attempt to reconnect on errors.
                // However, if it fails consistently (e.g., due to CORS or network issues), we should switch to polling.
                if (event.target.readyState === EventSource.CLOSED) {
                    console.error('❌ SSE connection was closed. Switching to polling.');
                    setError('Live connection failed. Using fallback polling mode.');
                    eventSource.close();
                    startPolling();
                }
            });

            eventSource.onerror = (error) => {
                console.error('❌ SSE onerror triggered:', error);
                setError('Live connection lost. Switching to polling mode.');
                eventSource.close();
                startPolling();
            };

            eventSourceRef.current = eventSource;
        } catch (err) {
            console.error('❌ Error setting up SSE:', err);
            setError('SSE not available. Using polling...');
            startPolling();
        }
    };

    const updatePricesFromData = (data) => {
        if (data.gold) {
            setGoldPrice({
                current: data.gold.price || data.gold.current || 0,
                change: data.gold.change || 0,
                changePercent: data.gold.changePercent || data.gold.change_percent || 0,
            });

            // Update chart with new data point
            if (seriesRef.current && activeTab === 'gold') {
                seriesRef.current.update({
                    time: Math.floor(Date.now() / 1000),
                    value: data.gold.price || data.gold.current || 0,
                });
            }
        }

        if (data.silver) {
            setSilverPrice({
                current: data.silver.price || data.silver.current || 0,
                change: data.silver.change || 0,
                changePercent: data.silver.changePercent || data.silver.change_percent || 0,
            });

            // Update chart with new data point
            if (seriesRef.current && activeTab === 'silver') {
                seriesRef.current.update({
                    time: Math.floor(Date.now() / 1000),
                    value: data.silver.price || data.silver.current || 0,
                });
            }
        }
    };

    const startPolling = () => {
        console.log('🔁 Starting polling for live metals prices...');
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }

        // Poll every 5 seconds
        pollingIntervalRef.current = setInterval(async () => {
            try {
                const result = await apiService.metals.getLivePrice();
                if (result.success && result.data) {
                    updatePricesFromData(result.data);
                    setError('');
                }
            } catch (err) {
                console.error('❌ Polling error:', err);
            }
        }, 5000);
    };

    const updateChartData = async (metal) => {
        try {
            console.log(`📈 Updating chart data for ${metal}...`);
            const result = await apiService.metals.getLivePrice();

            if (result.success && seriesRef.current) {
                const metalData = metal === 'gold'
                    ? (result.data.gold || result.data.GOLD || {})
                    : (result.data.silver || result.data.SILVER || {});

                if (metalData && metalData.history && Array.isArray(metalData.history)) {
                    const chartData = metalData.history.map((point) => ({
                        time: Math.floor(point.timestamp / 1000),
                        value: point.price || point.current,
                    }));

                    if (chartData.length > 0) {
                        seriesRef.current.setData(chartData);

                        if (chartRef.current) {
                            chartRef.current.timeScale().fitContent();
                        }
                    }
                }
            }
        } catch (err) {
            console.error('❌ Error updating chart data:', err);
        }
    };

    const currentPrice = activeTab === 'gold' ? goldPrice : silverPrice;

    return (
        <div className="bg-white rounded-lg card-shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    💰 Live Metals Price Ticker
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('gold')}
                        className={`px-4 py-2 rounded font-medium transition-colors ${activeTab === 'gold'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Gold 24K
                    </button>
                    <button
                        onClick={() => setActiveTab('silver')}
                        className={`px-4 py-2 rounded font-medium transition-colors ${activeTab === 'silver'
                            ? 'bg-gray-400 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Silver 999
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="inline-block animate-spin">
                            <div className="w-8 h-8 border-4 border-gray-300 border-t-yellow-500 rounded-full"></div>
                        </div>
                        <p className="mt-4 text-gray-600">Loading live rates...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    <p className="font-medium">⚠️ Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            ) : (
                <>
                    {/* Price Display */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Current Price</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    ₹{currentPrice.current.toFixed(2)}/g
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Change</p>
                                <p className={`text-2xl font-bold ${currentPrice.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {currentPrice.change >= 0 ? '+' : ''}{currentPrice.change.toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Change %</p>
                                <p className={`text-2xl font-bold ${currentPrice.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {currentPrice.changePercent >= 0 ? '+' : ''}{currentPrice.changePercent.toFixed(2)}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="rounded-lg border border-gray-200 overflow-hidden">
                        <div ref={containerRef} style={{ width: '100%' }} />
                    </div>

                    {/* Live Status Indicator */}
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                            <span>Live Price Feed</span>
                        </div>
                        <span>Updated: {new Date().toLocaleTimeString()}</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default LiveMetalsTicker;
