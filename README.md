# Crypto Exchange Latency Visualizer

A comprehensive Next.js application that provides real-time 3D visualization of cryptocurrency exchange server locations and latency monitoring across AWS, GCP, and Azure cloud regions.

## 🚀 Features

### Core Functionality
- **Interactive 3D World Map**: Smooth rotating globe with zoom and pan controls
- **Real-time Latency Monitoring**: Live updates every 5-10 seconds via Server-Sent Events (SSE)
- **Exchange Server Visualization**: Major exchanges (Binance, Bybit, OKX, Deribit) plotted with provider-specific colors
- **Historical Data Analysis**: Time-series charts with 1h, 24h, 7d, 30d ranges
- **Cloud Provider Regions**: Visual distinction between AWS, GCP, Azure, and other providers

### Interactive Controls
- **Advanced Filtering**: Filter by cloud provider, exchange, and latency range
- **Search Functionality**: Quick search for specific exchanges or regions
- **Real-time Performance Metrics**: System status dashboard with live statistics
- **Export Capabilities**: CSV and JSON export for latency data and reports

### UI/UX Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme Toggle**: User preference support
- **Touch Controls**: Mobile-friendly 3D globe interaction
- **Loading States**: Proper error handling and loading indicators
- **Performance Optimized**: Efficient 3D rendering with adaptive sizing

## 🛠️ Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **3D Visualization**: react-globe.gl, Three.js
- **Charting**: Recharts
- **Styling**: Tailwind CSS v4
- **Icons**: Heroicons
- **Real-time Data**: Server-Sent Events (SSE)
- **State Management**: React hooks and context

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📊 Features Implementation

### ✅ 3D World Map Display
- Interactive globe with smooth controls
- Exchange server markers with hover information
- Responsive globe sizing based on container

### ✅ Exchange Server Locations
- Major cryptocurrency exchanges plotted accurately
- Provider-specific color coding (AWS: Orange, GCP: Blue, Azure: Cyan)
- Comprehensive server information display

### ✅ Real-time Latency Visualization
- Animated connection arcs between servers
- Color-coded latency ranges (Green: <50ms, Yellow: 50-150ms, Red: >150ms)
- Live updates via SSE with 5-10 second intervals

### ✅ Historical Latency Trends
- Interactive time-series charts
- Multiple time range options (1h, 24h, 7d, 30d)
- Statistical analysis (min, max, average)

### ✅ Interactive Controls
- Comprehensive filtering system
- Search functionality for exchanges/regions
- Toggle switches for visualization layers
- Export functionality for data and reports

### ✅ Responsive Design
- Mobile-optimized layout and controls
- Touch-friendly 3D globe interaction
- Adaptive component sizing

### ✅ Bonus Features
- Dark/light theme toggle
- Performance metrics dashboard
- Advanced export capabilities (CSV/JSON)
- Real-time connection status indicator

## 🧪 API Endpoints

### REST Endpoints
- `GET /api/servers` - Retrieve server configuration
- `GET /api/latency/history` - Historical latency data

### Real-time Endpoints
- `GET /api/latency/stream` - Server-Sent Events stream for live updates

## 📖 Usage Guide

### Basic Navigation
1. **Globe Interaction**: Click and drag to rotate, scroll to zoom
2. **Server Selection**: Click on markers to view detailed information
3. **Filtering**: Use the control panel to filter by provider, exchange, or latency
4. **Theme Toggle**: Switch between dark and light modes
5. **Data Export**: Export historical data in CSV or JSON format

## 🚀 Performance Optimizations

- **3D Rendering**: Adaptive globe sizing and efficient rendering
- **Data Management**: Optimized state updates and caching
- **Mobile Performance**: Reduced complexity for mobile devices
- **Loading States**: Progressive loading with proper error handling

## 📝 Assumptions Made

1. **Latency Measurement**: Uses TCP connection timing as a proxy for network latency
2. **Data Source**: Demo uses simulated/synthetic data for reliable demonstration
3. **Update Frequency**: 5-10 second intervals balance real-time feel with performance
4. **Geographic Accuracy**: Server locations are approximated based on known exchange infrastructure

## 🔧 Libraries Used

- **react-globe.gl**: 3D globe visualization
- **three.js**: WebGL 3D graphics library
- **recharts**: React charting library
- **@heroicons/react**: Icon library
- **tailwindcss**: Utility-first CSS framework
- **typescript**: Type safety and better development experience

---

**Note**: This application demonstrates latency monitoring capabilities using TCP connection measurements. For production use, consider implementing dedicated network monitoring infrastructure.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
