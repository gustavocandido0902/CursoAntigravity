/**
 * Header component displaying corporate brand and operational context.
 * Accessible semantic header with high-contrast text and ARIA landmark.
 */

import React from 'react';

export const Header: React.FC = () => {
  return (
    <header
      role="banner"
      className="bg-slate-900 border-b border-slate-800 text-white shadow-md sticky top-0 z-30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-lg text-white shadow-inner"
            aria-hidden="true"
          >
            AP
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              AlmoxarifadoPro
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                v1.0
              </span>
            </h1>
            <p className="text-xs text-slate-400">Metalúrgica Vale do Aço S/A • Almoxarifado Central</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div
            className="flex items-center space-x-2 text-xs font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-full"
            role="status"
            aria-label="System operational status"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            <span>Terminal Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};
