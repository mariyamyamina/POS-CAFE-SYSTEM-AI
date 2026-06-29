import React from 'react';
import { icons } from '../../constants/icons';

const StatCard = ({ icon, iconBg, iconColor, label, value, change, trend }) => {
  const Icon = icons[icon];
  const isUp = trend === 'up';
  const TrendIcon = isUp ? icons.arrowUp : icons.arrowDown;
  const trendColor = isUp ? 'text-emerald-500' : 'text-red-500';

  return (
    <div className="flex items-center gap-3 rounded-xl border border-text-100 bg-white p-3">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
        style={{ background: iconBg }}
      >
        <Icon className="h-5 w-5" style={{ color: iconColor }} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[12px] font-medium text-text-500">{label}</p>
        <div className="mt-0.5 flex items-baseline gap-1">
          <span className="text-[18px] font-bold text-text-900">{value}</span>
        </div>
        <div className={`mt-0.5 flex items-center gap-1 text-[11px] font-medium ${trendColor}`}>
          <TrendIcon className="h-3 w-3" />
          <span>{change} vs last week</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;