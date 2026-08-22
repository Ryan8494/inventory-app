export default function StatsCard({ title, value, subtitle, icon, trend, trendLabel }) {
    const trendColors = {
        up: 'text-emerald-600',
        down: 'text-red-500',
        neutral: 'text-steel',
    };

    return (
        <div className="card p-5 flex flex-col justify-between min-h-[120px]">
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-steel uppercase tracking-wider">{title}</p>
                    <p className="mt-2 text-2xl font-heading font-bold text-deep tabular-nums leading-tight truncate">{value}</p>
                </div>
                {icon && (
                    <div className="w-10 h-10 rounded-sm bg-primary/10 text-primary flex items-center justify-center shrink-0 ml-3">
                        {icon}
                    </div>
                )}
            </div>
            <div className="mt-2 min-h-[16px]">
                {subtitle ? (
                    <p className="text-xs text-steel">{subtitle}</p>
                ) : trend !== undefined ? (
                    <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-medium ${trendColors[trend] || 'text-steel'}`}>
                            {trend === 'up' && '\u2191'}
                            {trend === 'down' && '\u2193'}
                            {typeof trend === 'number' ? `${trend > 0 ? '+' : ''}${trend}%` : ''}
                        </span>
                        {trendLabel && (
                            <span className="text-xs text-steel">{trendLabel}</span>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
