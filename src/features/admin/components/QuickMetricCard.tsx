import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

export interface QuickMetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  accentColor?: 'emerald' | 'amber' | 'sky' | 'rose' | 'stone';
}

const colorMap = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  sky: 'bg-sky-50 text-sky-700 border-sky-100',
  rose: 'bg-rose-50 text-rose-700 border-rose-100',
  stone: 'bg-stone-50 text-stone-700 border-stone-200',
};

export const QuickMetricCard: React.FC<QuickMetricCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  accentColor = 'stone',
}) => {
  return (
    <Card className="p-4 sm:p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-xl border ${colorMap[accentColor]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">{value}</div>
        {subtext && <div className="text-xs text-stone-500 mt-1 font-medium">{subtext}</div>}
      </div>
    </Card>
  );
};
