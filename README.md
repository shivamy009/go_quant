# Crypto Exchange Latency Visualizer

**Developer:** Shivam Yadav  
**Email:** shivamy0345@gmail.com  
**Phone:** 6394741529  
**GitHub:** https://github.com/shivamy009/go_quant  

A sophisticated real-time 3D web application that monitors cryptocurrency exchange server latency across major cloud providers (AWS, GCP, Azure). The application provides live network performance visualization, historical trend analysis, and comprehensive monitoring capabilities for cryptocurrency trading infrastructure.

### 🔗 Live Demo
Open [http://localhost:3000](http://localhost:3000) after setup to explore the application.

## ✨ Key Features

### 🌐 **Interactive 3D World Map**
- WebGL-powered globe visualization using react-globe.gl
- Real-time server location markers with provider-specific colors
- Smooth rotation, zoom, and pan controls
- Responsive design for desktop, tablet, and mobile

### ⚡ **Real-time Latency Monitoring**
- Live updates every 5 seconds via Server-Sent Events (SSE)
- TCP connection-based latency measurements
- Color-coded performance indicators:
  - 🟢 Green: <50ms (excellent)
  - 🟡 Yellow: 50-150ms (good)
  - 🔴 Red: >150ms (slow)
- Animated connection arcs between servers

### 📊 **Historical Data Analysis**
- Time-series charts with multiple ranges (1h, 24h, 7d, 30d)
- Statistical analysis (min, max, average, sample count)
- Interactive data visualization with Recharts
- Data export in multiple formats (CSV, JSON, Excel)

### 🎛️ **Advanced Controls & Filtering**
- Filter by cloud provider (AWS, GCP, Azure, Other)
- Filter by specific cryptocurrency exchanges
- Latency range filtering with slider controls
- Search functionality across exchanges and regions

### 🔍 **Multiple Visualization Modes**
- **Latency Mode:** Real-time performance visualization
- **Topology Mode:** Network relationship mapping
- **Heatmap Mode:** Geographic latency intensity
- **Regions Mode:** Cloud provider coverage areas

## 🏗️ Technology Stack

### Frontend
- **Framework:** Next.js 16 with App Router
- **UI Library:** React 19 with modern hooks
- **Language:** TypeScript for type safety
- **Styling:** Tailwind CSS v4 with responsive design
- **3D Graphics:** react-globe.gl + Three.js for WebGL rendering
- **Charts:** Recharts for data visualization
- **Icons:** Heroicons for UI elements

### Backend
- **Runtime:** Node.js with Next.js API routes
- **Real-time:** Server-Sent Events (SSE) for live streaming
- **Data Processing:** In-memory worker with automatic cleanup
- **Network Monitoring:** TCP connection latency measurements
- **APIs:** RESTful endpoints + streaming endpoints

## � Quick Start

### Prerequisites
- **Node.js:** 18+ (recommended: 20+)
- **npm or yarn:** Package manager
- **Modern Browser:** Chrome, Firefox, Safari, or Edge with WebGL support

### Installation

```bash
# Clone the repository
git clone https://github.com/shivamy009/go_quant.git
cd go_quant

# Install dependencies
npm install

# Start development server
npm run dev

# Open your browser and navigate to
# http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔌 API Endpoints

### REST Endpoints
- `GET /api/servers` - Server configuration data
- `GET /api/latency` - Current latency snapshot
- `GET /api/latency/history` - Historical data with filtering
- `GET /api/latency/snapshot` - Data export endpoint

### Streaming Endpoints
- `GET /api/latency/stream` - Server-Sent Events for real-time updates

### Example Response
```json
{
  "servers": [...],
  "latest": {
    "binance-ny": {
      "id": "binance-ny",
      "host": "api.binance.com",
      "port": 443,
      "timestamp": "2025-11-11T10:30:00.000Z",
      "rttMs": 45,
      "status": "ok"
    }
  }
}
```

## 📖 Usage Guide

### Basic Navigation
1. **Globe Interaction:** Click and drag to rotate, scroll to zoom
2. **Server Selection:** Click markers for detailed information
3. **Filtering:** Use control panel to filter by provider or exchange
4. **Time Analysis:** Select servers for historical trend analysis

### Advanced Features
1. **Visualization Modes:** Toggle between latency, topology, and heatmap views
2. **Data Export:** Export current data or historical analysis
3. **Performance Monitoring:** View real-time system metrics
4. **Search:** Find specific exchanges or geographic regions

### Mobile Usage
1. **Touch Controls:** Pinch to zoom, swipe to rotate
2. **Responsive Layout:** Automatic adaptation to screen size
3. **Collapsible Panels:** Efficient use of mobile screen space

## 🎯 Monitored Exchanges

### Major Cryptocurrency Exchanges
- **Binance** (AWS: US East, Singapore, EU West)
- **Bybit** (GCP: Singapore, US Central)
- **OKX** (Azure: Singapore, US East)
- **Coinbase** (AWS: US West, EU Central)
- **Kraken** (GCP: US West, EU West)
- **And 15+ more exchanges**

### Cloud Provider Coverage
- **🟠 AWS** - Amazon Web Services (6 regions)
- **🔵 GCP** - Google Cloud Platform (4 regions)
- **🟦 Azure** - Microsoft Azure (4 regions)

## 🧪 Testing & Browser Support

### Browser Compatibility
- ✅ **Chrome** - Full support (recommended)
- ✅ **Firefox** - Full support
- ✅ **Safari** - WebGL and ES6 support required
- ✅ **Edge** - Full support

### Performance Requirements
- **WebGL Support** - Required for 3D visualization
- **Modern JavaScript** - ES6+ features used throughout
- **Memory** - 4GB+ RAM recommended for smooth rendering

## 📊 Performance Metrics

### Real-time Monitoring
- **Update Frequency:** 5-second intervals
- **Concurrent Users:** Designed for multiple simultaneous connections
- **Data Retention:** In-memory with automatic cleanup (2000 samples max)
- **Frame Rate:** 60 FPS WebGL rendering


### Documentation
- **Technical Docs:** See `PROJECT_DOCUMENTATION.md`
- **API Reference:** Available at `/api` endpoints
- **Demo Video:** 5-minute feature demonstration available

---

**Built with ❤️ using Next.js, React, and TypeScript**  
*Real-time 3D cryptocurrency exchange latency monitoring made simple.*
