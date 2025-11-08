// components/ControlPanel.tsx
'use client';
import React, { useState } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

type Filters = {
  providers: string[];
  exchanges: string[];
  latencyRange: { min: number; max: number };
};

interface ControlPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const providers = [
  { id: 'AWS', name: 'Amazon Web Services', color: 'bg-orange-500' },
  { id: 'GCP', name: 'Google Cloud Platform', color: 'bg-blue-500' },
  { id: 'Azure', name: 'Microsoft Azure', color: 'bg-cyan-500' },
  { id: 'Other', name: 'Other Providers', color: 'bg-purple-500' }
];

const exchanges = ['Binance', 'Bybit', 'OKX', 'Deribit', 'Coinbase', 'FTX'];

export default function ControlPanel({ filters, onFiltersChange }: ControlPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showProviders, setShowProviders] = useState(true);
  const [showExchanges, setShowExchanges] = useState(false);
  const [showLatency, setShowLatency] = useState(false);

  const handleProviderToggle = (providerId: string) => {
    const newProviders = filters.providers.includes(providerId)
      ? filters.providers.filter(p => p !== providerId)
      : [...filters.providers, providerId];
    
    onFiltersChange({ ...filters, providers: newProviders });
  };

  const handleExchangeToggle = (exchange: string) => {
    const newExchanges = filters.exchanges.includes(exchange)
      ? filters.exchanges.filter(e => e !== exchange)
      : [...filters.exchanges, exchange];
    
    onFiltersChange({ ...filters, exchanges: newExchanges });
  };

  const handleLatencyRangeChange = (field: 'min' | 'max', value: number) => {
    onFiltersChange({
      ...filters,
      latencyRange: { ...filters.latencyRange, [field]: value }
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      providers: ['AWS', 'GCP', 'Azure', 'Other'],
      exchanges: [],
      latencyRange: { min: 0, max: 1000 }
    });
    setSearchTerm('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <span className="mr-2">🎛️</span>
            Controls
          </h2>
          <button
            onClick={resetFilters}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            Reset All
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search exchanges or regions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Cloud Providers Filter */}
        <div className="mb-6">
          <button
            onClick={() => setShowProviders(!showProviders)}
            className="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="font-medium">Cloud Providers</span>
            <ChevronDownIcon className={`h-4 w-4 transform transition-transform ${showProviders ? 'rotate-180' : ''}`} />
          </button>
          
          {showProviders && (
            <div className="mt-3 space-y-2">
              {providers.map((provider) => (
                <label key={provider.id} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.providers.includes(provider.id)}
                    onChange={() => handleProviderToggle(provider.id)}
                    className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div className={`w-3 h-3 rounded ${provider.color} mr-2`}></div>
                  <span className="text-sm">{provider.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Exchanges Filter */}
        <div className="mb-6">
          <button
            onClick={() => setShowExchanges(!showExchanges)}
            className="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="font-medium">Exchanges</span>
            <ChevronDownIcon className={`h-4 w-4 transform transition-transform ${showExchanges ? 'rotate-180' : ''}`} />
          </button>
          
          {showExchanges && (
            <div className="mt-3 space-y-2">
              {exchanges.map((exchange) => (
                <label key={exchange} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.exchanges.includes(exchange)}
                    onChange={() => handleExchangeToggle(exchange)}
                    className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm">{exchange}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Latency Range Filter */}
        <div className="mb-6">
          <button
            onClick={() => setShowLatency(!showLatency)}
            className="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="font-medium">Latency Range</span>
            <ChevronDownIcon className={`h-4 w-4 transform transition-transform ${showLatency ? 'rotate-180' : ''}`} />
          </button>
          
          {showLatency && (
            <div className="mt-3 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Min Latency (ms)</label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={filters.latencyRange.min}
                  onChange={(e) => handleLatencyRangeChange('min', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {filters.latencyRange.min}ms
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Max Latency (ms)</label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  value={filters.latencyRange.max}
                  onChange={(e) => handleLatencyRangeChange('max', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {filters.latencyRange.max}ms
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
            📊 Export Current Data
          </button>
          <button className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium">
            🔄 Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}