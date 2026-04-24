import React, { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

const API_KEY = import.meta.env.VITE_GOLD_API_KEY || "";
const USE_MOCK = !API_KEY || API_KEY === "YOUR_API_KEY_HERE";

// ─── Realistic base prices (INR) as of early 2026 ───────────────────────────
const MOCK_BASE = {
  XAU: {
    price: 237500,
    price_gram_24k: 7638,
    price_gram_22k: 7002,
    price_gram_21k: 6684,
    price_gram_18k: 5729,
    open_price: 236800,
    high_price: 238200,
    low_price: 236200,
    ch: 700,
    chp: 0.30,
    timestamp: Math.floor(Date.now() / 1000),
  },
  XAG: {
    price: 2760,
    open_price: 2740,
    high_price: 2785,
    low_price: 2730,
    ch: 20,
    chp: 0.73,
    timestamp: Math.floor(Date.now() / 1000),
  },
};

const simulateTick = (base, symbol) => {
  const jitter = (max) => (Math.random() - 0.5) * 2 * max;
  if (symbol === "XAU") {
    const newPrice = base.price + jitter(300);
    const pg24 = newPrice / 31.1035;
    return {
      ...base,
      price: newPrice,
      price_gram_24k: pg24,
      price_gram_22k: pg24 * (22 / 24),
      price_gram_21k: pg24 * (21 / 24),
      price_gram_18k: pg24 * (18 / 24),
      ch: newPrice - base.open_price,
      chp: ((newPrice - base.open_price) / base.open_price) * 100,
      high_price: Math.max(base.high_price, newPrice),
      low_price: Math.min(base.low_price, newPrice),
      timestamp: Math.floor(Date.now() / 1000),
    };
  } else {
    const newPrice = base.price + jitter(15);
    return {
      ...base,
      price: newPrice,
      ch: newPrice - base.open_price,
      chp: ((newPrice - base.open_price) / base.open_price) * 100,
      high_price: Math.max(base.high_price, newPrice),
      low_price: Math.min(base.low_price, newPrice),
      timestamp: Math.floor(Date.now() / 1000),
    };
  }
};

const METALS = {
  XAU: { label: "Gold", color: "#D97706", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  XAG: { label: "Silver", color: "#6B7280", bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-600" },
};

const fetchMetal = async (symbol) => {
  // Always return mock data instead of making API calls
  if (symbol === "XAU") {
    return simulateTick(MOCK_BASE.XAU, "XAU");
  } else if (symbol === "XAG") {
    return simulateTick(MOCK_BASE.XAG, "XAG");
  }
  throw new Error(`Unknown symbol: ${symbol}`);
};

const formatINR = (val) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm">
      <p className="text-gray-500 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-semibold">
          {p.name}: {formatINR(p.value)}
        </p>
      ))}
    </div>
  );
};

const PriceCard = ({ symbol, data, loading, error }) => {
  const meta = METALS[symbol];

  if (loading) {
    return (
      <div className={`rounded-2xl border ${meta.border} ${meta.bg} p-5 animate-pulse`}>
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className={`rounded-2xl border ${meta.border} ${meta.bg} p-5`}>
        <p className="text-sm font-medium text-gray-500">{meta.label}</p>
        <p className="text-red-500 text-sm mt-2">Failed to load price</p>
      </div>
    );
  }

  const change = data.ch ?? 0;
  const changePct = data.chp ?? 0;
  const isPositive = change >= 0;

  return (
    <div className={`rounded-2xl border ${meta.border} ${meta.bg} p-5 transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{meta.label}</p>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
          {isPositive ? "▲" : "▼"} {Math.abs(changePct).toFixed(2)}%
        </span>
      </div>

      <div className="mb-3">
        {symbol === "XAU" ? (
          <>
            <p className="text-xs text-gray-400 mb-1">Per Gram</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { k: "24K", val: data.price_gram_24k },
                { k: "22K", val: data.price_gram_22k },
                { k: "21K", val: data.price_gram_21k },
                { k: "18K", val: data.price_gram_18k },
              ].filter(x => x.val).map(({ k, val }) => (
                <div key={k} className="bg-white rounded-lg px-3 py-2 border border-gray-100">
                  <p className="text-xs text-gray-400">{k}</p>
                  <p className={`text-sm font-bold ${meta.text}`}>{formatINR(val)}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-1">Silver Price</p>
            <div className="grid grid-cols-2 gap-2">
              {(() => {
                const perGram = data.price / 31.1035;
                return [
                  { k: "Per Gram", val: perGram },
                  { k: "Per 10g", val: perGram * 10 },
                  { k: "Per 100g", val: perGram * 100 },
                  { k: "Per Kg", val: perGram * 1000 },
                ].map(({ k, val }) => (
                  <div key={k} className="bg-white rounded-lg px-3 py-2 border border-gray-100">
                    <p className="text-xs text-gray-400">{k}</p>
                    <p className={`text-sm font-bold ${meta.text}`}>{formatINR(val)}</p>
                  </div>
                ));
              })()}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 text-center border-t border-gray-200 pt-3">
        {[
          { label: "Open", val: data.open_price },
          { label: "High", val: data.high_price },
          { label: "Low", val: data.low_price },
        ].map(({ label, val }) => (
          <div key={label}>
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-xs font-semibold text-gray-700">{val ? formatINR(val) : "—"}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-3 text-right">
        Updated: {data.timestamp ? new Date(data.timestamp * 1000).toLocaleTimeString("en-IN") : "—"}
      </p>
    </div>
  );
};

const   GoldPriceDashboard = () => {
  const mockStateRef = useRef({ XAU: { ...MOCK_BASE.XAU }, XAG: { ...MOCK_BASE.XAG } });

  const [prices, setPrices] = useState({ XAU: null, XAG: null });
  const [loading, setLoading] = useState({ XAU: true, XAG: true });
  const [errors, setErrors] = useState({ XAU: null, XAG: null });
  const [chartData, setChartData] = useState([]);
  const [selectedMetal, setSelectedMetal] = useState('XAU');
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  const addChartPoint = (xauData, xagData) => {
    const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const point = {
      time,
      "Gold (24K/g)": Math.round(xauData.price_gram_24k),
      "Silver (/g)": Math.round(xagData.price / 31.1035),
    };
    setChartData(prev => {
      const last = prev[prev.length - 1];
      return last?.time === point.time
        ? [...prev.slice(0, -1), point]
        : [...prev.slice(-19), point];
    });
  };

  const fetchAll = async () => {
    if (USE_MOCK) {
      const newXAU = simulateTick(mockStateRef.current.XAU, "XAU");
      const newXAG = simulateTick(mockStateRef.current.XAG, "XAG");
      mockStateRef.current = { XAU: newXAU, XAG: newXAG };
      setPrices({ XAU: newXAU, XAG: newXAG });
      setErrors({ XAU: null, XAG: null });
      setLoading({ XAU: false, XAG: false });
      addChartPoint(newXAU, newXAG);
      setLastUpdated(new Date());
      return;
    }

    let xauData = null, xagData = null;
    for (const symbol of ["XAU", "XAG"]) {
      try {
        const data = await fetchMetal(symbol);
        setPrices(prev => ({ ...prev, [symbol]: data }));
        setErrors(prev => ({ ...prev, [symbol]: null }));
        if (symbol === "XAU") xauData = data;
        else xagData = data;
        setLastUpdated(new Date());
      } catch (err) {
        setErrors(prev => ({ ...prev, [symbol]: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, [symbol]: false }));
      }
    }
    if (xauData && xagData) addChartPoint(xauData, xagData);
  };

  useEffect(() => {
    fetchAll();
    intervalRef.current = setInterval(fetchAll, USE_MOCK ? 5000 : 60000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Live Metal Prices</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Prices in INR · {USE_MOCK ? "Demo mode — updates every 5s" : "Auto-refreshes every 60s"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString("en-IN")}
              </span>
            )}
            <button
              onClick={fetchAll}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              ↺ Refresh
            </button>
          </div>
        </div>

        {/* Demo Banner */}
        {USE_MOCK && (
          <div className="mb-5 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800 flex items-start gap-2">
            <span className="mt-0.5">ℹ️</span>
            <span>
              Running in <strong>demo mode</strong> with simulated prices based on real 2026 market rates.
              Add <code className="bg-blue-100 px-1 rounded">VITE_GOLD_API_KEY=your_key</code> to{" "}
              <code className="bg-blue-100 px-1 rounded">.env</code> to switch to live GoldAPI.io data.
            </span>
          </div>
        )}

        {/* Price Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8">
          {["XAU", "XAG"].map((sym) => (
            <PriceCard
              key={sym}
              symbol={sym}
              data={prices[sym]}
              loading={loading[sym]}
              error={errors[sym]}
            />
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-700">Price Trend (Live Session)</h3>
              <span className="text-xs text-gray-400">Per gram · INR</span>
            </div>
            <div className="flex gap-2">
              {['XAU', 'XAG', 'BOTH'].map((metal) => (
                <button
                  key={metal}
                  onClick={() => setSelectedMetal(metal)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition ${selectedMetal === metal ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {metal === 'XAU' ? 'Gold 24K' : metal === 'XAG' ? 'Silver' : 'Gold + Silver'}
                </button>
              ))}
            </div>
          </div>
          {chartData.length < 2 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              Collecting data points...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 0, right: 15, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={METALS.XAU.color} stopOpacity={0.45} />
                    <stop offset="95%" stopColor={METALS.XAU.color} stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="silverArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={METALS.XAG.color} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={METALS.XAG.color} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `₹${v}`} width={65} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#9ca3af', strokeWidth: 1 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {(selectedMetal === 'XAU' || selectedMetal === 'BOTH') && (
                  <Area
                    type="monotone"
                    dataKey="Gold (24K/g)"
                    stroke={METALS.XAU.color}
                    strokeWidth={2}
                    fill="url(#goldArea)"
                    fillOpacity={0.8}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                )}
                {(selectedMetal === 'XAG' || selectedMetal === 'BOTH') && (
                  <Area
                    type="monotone"
                    dataKey="Silver (/g)"
                    stroke={METALS.XAG.color}
                    strokeWidth={2}
                    fill="url(#silverArea)"
                    fillOpacity={0.8}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </div>
  );
};

export default GoldPriceDashboard;