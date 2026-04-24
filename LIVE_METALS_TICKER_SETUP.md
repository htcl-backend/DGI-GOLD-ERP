# 📊 Live Metals Ticker Implementation Guide

## Overview

A real-time metals price ticker has been integrated into your DGI-GOLD-ERP Dashboard displaying live gold and silver rates with interactive TradingView Lightweight Charts.

---

## ✅ What Was Implemented

### 1. **LiveMetalsTicker Component** (`src/components/LiveMetalsTicker.jsx`)

- **Real-time price display** with current rate, change, and percentage change
- **Interactive tabs** to switch between Gold 24K and Silver 999
- **TradingView Lightweight Charts** for price visualization
- **WebSocket support** for live price streaming
- **Responsive design** with Tailwind CSS
- **Error handling** with user-friendly messages
- **Live status indicator** showing connection state

### 2. **Dashboard Integration**

The component is now embedded in your Main Dashboard (`src/screens/Dashboard.jsx`) positioned:
- After the Gold Price Dashboard section
- Before the "Other Charts Grid" section
- Visible to all dashboard users

### 3. **Dependencies Added**

```json
"lightweight-charts": "^5.1.0"
```

---

## 🔌 API Integration

### Endpoints Required

Your backend needs to provide two endpoints:

#### 1️⃣ **Initial Data Fetch** (REST)
```
GET {{baseUrl}}/api/v1/metals/subscribe-live
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "gold": {
      "current": 6520.50,
      "change": 50.25,
      "changePercent": 0.78,
      "history": [
        {
          "timestamp": 1713880800000,
          "price": 6470.25
        },
        {
          "timestamp": 1713884400000,
          "price": 6480.50
        }
        // ... more historical data points
      ]
    },
    "silver": {
      "current": 78.50,
      "change": -2.15,
      "changePercent": -2.66,
      "history": [
        {
          "timestamp": 1713880800000,
          "price": 80.65
        },
        {
          "timestamp": 1713884400000,
          "price": 78.50
        }
        // ... more historical data points
      ]
    }
  }
}
```

**Fields:**
- `current`: Current price in ₹ per gram
- `change`: Absolute price change
- `changePercent`: Percentage change
- `history`: Array of historical data points with timestamp (ms) and price

#### 2️⃣ **Live WebSocket Stream**
```
WS {{baseUrl}}/api/v1/metals/live-stream
```

**Message Format (Real-time updates):**
```json
{
  "gold": {
    "price": 6520.50,
    "change": 50.25,
    "changePercent": 0.78,
    "timestamp": 1713884400000
  },
  "silver": {
    "price": 78.50,
    "change": -2.15,
    "changePercent": -2.66,
    "timestamp": 1713884400000
  }
}
```

**Message Frequency:** 
- Recommended: Every 1-5 seconds for smooth updates
- Should contain at least one metal per message

---

## 🛠️ Features

### Display Features
- ✅ **Color-coded tabs**: Gold (yellow) and Silver (gray)
- ✅ **Price metrics**: Current, Change, Change %
- ✅ **Live chart**: Line chart showing price trends
- ✅ **Auto-resize**: Responsive to window size changes
- ✅ **Live indicator**: Green pulsing dot with timestamp

### Interactive Features
- ✅ **Tab switching**: Click to view different metals
- ✅ **Chart updates**: Real-time price points plotted
- ✅ **Loading state**: Spinner while fetching data
- ✅ **Error handling**: User-friendly error messages

### Technical Features
- ✅ **WebSocket auto-reconnect**: Retries every 3 seconds on disconnect
- ✅ **Memory efficient**: Proper cleanup on unmount
- ✅ **Responsive**: Mobile, tablet, and desktop support
- ✅ **Accessibility**: ARIA labels and semantic HTML

---

## 📋 Component Props

The component is self-contained and requires no props.

```jsx
<LiveMetalsTicker />
```

---

## 🔧 Configuration

### Environment Variable

Set the API base URL in your `.env` file:

```env
VITE_API_BASE_URL=https://api.yourdomain.com
# or for development
VITE_API_BASE_URL=http://localhost:3000
```

If not set, it defaults to `http://localhost:3000`

---

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

---

## 🎨 Styling

The component uses **Tailwind CSS** classes for styling. If you need to customize:

1. **Chart colors**: Modify line colors in the component
2. **Container styling**: Update the main wrapper classes
3. **Button styling**: Change the "Gold 24K" and "Silver 999" button classes

---

## 📊 Chart Details

### TradingView Lightweight Charts

- **Type**: Line chart
- **Resolution**: Automatically fits to viewport
- **Time scale**: Shows date and time (with seconds)
- **Responsive**: Auto-resizes on window change
- **Performance**: Optimized for high-frequency updates

---

## 🚀 Usage Example

### In Dashboard

The component is already integrated. Just ensure your API endpoints are ready:

```jsx
<LiveMetalsTicker />
```

### Standalone Usage

To use in another page:

```jsx
import LiveMetalsTicker from "../components/LiveMetalsTicker";

export default function YourPage() {
  return (
    <div>
      {/* Your other content */}
      <LiveMetalsTicker />
    </div>
  );
}
```

---

## 🔐 Authentication

Currently, the component assumes **public endpoints** for metal prices. If you need auth:

1. Add token to request headers:
```javascript
const response = await fetch(`${baseUrl}/api/v1/metals/subscribe-live`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

2. For WebSocket with auth:
```javascript
const ws = new WebSocket(`${wsUrl}?token=${token}`);
```

---

## ⚠️ Error Handling

The component handles:

- ✅ Network failures (WebSocket auto-reconnect)
- ✅ Invalid API responses
- ✅ Missing data fields
- ✅ Chart initialization errors
- ✅ Window resize errors

**Error Messages:**
- "Failed to fetch live rates. Please try again later."
- "Connection error. Retrying..."

---

## 📈 Performance Optimization

### What We've Optimized

1. **Lazy WebSocket reconnect**: 3-second retry delay prevents hammering
2. **Selective updates**: Only updates chart when tab is active
3. **Memory cleanup**: Proper ref cleanup on unmount
4. **Efficient rendering**: useState for price changes only
5. **Chart reuse**: Single chart instance with data updates

### Data Updates Per Second

- REST API: Every 60 seconds (configurable)
- WebSocket: Per server push (recommended 1-5 sec)

---

## 🐛 Troubleshooting

### Chart not displaying?
- Check if container has width/height
- Verify `lightweight-charts` is installed: `npm list lightweight-charts`
- Check browser console for errors

### No price updates?
- Verify API endpoint is accessible
- Check network tab in DevTools
- Ensure WebSocket URL is correct

### Prices not changing?
- Check if backend is sending new data
- Verify timestamp is included in response
- Check WebSocket connection in DevTools

---

## 📝 File Structure

```
src/
├── components/
│   └── LiveMetalsTicker.jsx        ← New component
├── screens/
│   └── Dashboard.jsx               ← Updated with integration
└── (other files)
```

---

## 🔄 Future Enhancements

Consider adding:

1. **Historical data selector**: Date range picker
2. **Multiple timeframes**: 1H, 4H, 1D, 1W views
3. **Alerts**: Notify when price crosses threshold
4. **Comparison**: Compare gold vs silver trends
5. **Export**: Download price data as CSV
6. **Indicators**: Add technical analysis indicators
7. **News feed**: Display metal market news
8. **Volume data**: Show trading volume

---

## 📚 References

- [TradingView Lightweight Charts Docs](https://tradingview.github.io/lightweight-charts/)
- [WebSocket API Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Tailwind CSS Docs](https://tailwindcss.com/)

---

## ✨ Summary

| Item | Status |
|------|--------|
| Component Created | ✅ |
| Dashboard Integrated | ✅ |
| Library Installed | ✅ (v5.1.0) |
| Error Handling | ✅ |
| Responsive Design | ✅ |
| WebSocket Support | ✅ |
| Documentation | ✅ |

---

**Created**: April 23, 2026  
**Component**: LiveMetalsTicker.jsx  
**Library**: lightweight-charts v5.1.0  
**Status**: Ready for Backend API Integration
