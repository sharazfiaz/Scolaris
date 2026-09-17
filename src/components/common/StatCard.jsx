import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'brand' }) => {
  const colorStyles = {
    brand: 'bg-teal-50 text-teal-700 border-teal-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border ${colorStyles[color] || colorStyles.brand}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      
      {(subtitle || trendValue) && (
        <div className="mt-3 flex items-center gap-2 pt-3 border-t border-slate-100 text-xs">
          {trendValue && (
            <span className={`inline-flex items-center gap-0.5 font-semibold ${trend === 'down' ? 'text-rose-600' : 'text-emerald-600'}`}>
              {trend === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
              {trendValue}
            </span>
          )}
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
