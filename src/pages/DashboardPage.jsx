import React from 'react';
import AppLayout from '../layout/AppLayout';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import StatCard from '../components/Dashboard/StatCard';
import SalesOverviewChart from '../components/Dashboard/SalesOverviewChart';
import TopSellingItems from '../components/Dashboard/TopSellingItems';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import { icons } from '../constants/icons';

const STAT_CARDS = [
    { icon: 'sales', iconBg: '#F5F3FF', iconColor: '#7C3AED', label: 'Total Sales', value: '6050.93', change: '+0%', trend: 'up' },
    { icon: 'orders', iconBg: '#FFF1E8', iconColor: '#FF8A3C', label: 'Total Orders', value: '122', change: '-0%', trend: 'down' },
    { icon: 'users', iconBg: '#EAF1FF', iconColor: '#3B82F6', label: 'Total Users', value: '70', change: '+0%', trend: 'up' },
    { icon: 'barChart', iconBg: '#F5F3FF', iconColor: '#7C3AED', label: 'Average Order Value', value: '732.13', change: '+0%', trend: 'up' },
    { icon: 'box', iconBg: '#E9FBF3', iconColor: '#10B981', label: 'Total Products', value: '102', change: '+0%', trend: 'up' },
];

const LOW_STOCK_ITEMS = [
    { name: 'Paneer bun', unit: 'Piece', stock: 0, image: 'images/paneer-bun.png', level: 'critical' },
    { name: 'Smoothie', unit: 'Cup', stock: 10, image: 'images/smoothie.png', level: 'ok' },
    { name: 'Egg Puff', unit: 'Pcs', stock: 2, image: 'images/egg-puff.png', level: 'critical' },
    { name: 'Hot Chocolate', unit: 'Cup', stock: 6, image: 'images/hot-chocolate.png', level: 'warning' },
    { name: 'Chocolate Milkshake', unit: 'Glass', stock: 4, image: 'images/chocolate-milkshake.png', level: 'warning' },
];

const QUICK_ACTIONS = [
    { icon: 'fileText', label: 'New Bill', bg: '#F5F3FF', color: '#7C3AED' },
    { icon: 'box', label: 'Add Product', bg: '#E9FBF3', color: '#10B981' },
    { icon: 'orders', label: 'New Order', bg: '#FFF1E8', color: '#FF8A3C' },
    { icon: 'users', label: 'Add Customer', bg: '#EAF1FF', color: '#3B82F6' },
    { icon: 'barChart', label: 'Reports', bg: '#F5F3FF', color: '#7C3AED' },
];

const stockColor = (level) => {
    if (level === 'critical') return 'text-red-500';
    if (level === 'warning') return 'text-amber-500';
    return 'text-emerald-500';
};

const DashboardPage = ({ onToggleSidebar, onLogout, onNavigate }) => {
    return (
        <AppLayout activePage="dashboard" onLogout={onLogout} onNavigate={onNavigate}>
            <DashboardHeader onToggleSidebar={onToggleSidebar} />

            <div className="flex-1 overflow-y-auto bg-[#F8F8FB] px-4 py-4 lg:px-6 scrollbar-thin">

                {/* Stat cards row */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {STAT_CARDS.map((card) => (
                        <StatCard key={card.label} {...card} />
                    ))}
                </div>

                {/* Main grid: Sales Overview | Top Selling | Recent Transactions */}
                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1.1fr_1.1fr]">
                    <SalesOverviewChart />
                    <TopSellingItems onViewAll={() => onNavigate && onNavigate('inventory')} />
                    <RecentTransactions onViewAll={() => onNavigate && onNavigate('salesReport')} />
                </div>

                {/* Bottom row: Low Stock Alerts | Quick Actions */}
                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.7fr_1fr]">

                    {/* Low Stock Alerts */}
                    <div className="rounded-xl border border-text-100 bg-white p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <icons.alertTriangle className="h-4 w-4 text-amber-500" />
                                <h3 className="text-[15px] font-bold text-text-900">Low Stock Alerts</h3>
                            </div>
                            <button
                                type="button"
                                className="flex items-center gap-1 text-[12px] font-semibold text-primary hover:text-primary-700"
                                onClick={() => onNavigate && onNavigate('inventory')}
                            >
                                View All Alerts
                                <icons.chevronRight className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                            {LOW_STOCK_ITEMS.map((item) => (
                                <div key={item.name} className="flex flex-col items-center rounded-lg border border-text-100 p-3 text-center">
                                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-[#F4F5F9]">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-10 w-10 object-contain"
                                            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                                        />
                                    </div>
                                    <p className="mt-2 truncate text-[11px] font-semibold text-text-800">{item.name}</p>
                                    <p className="text-[10px] text-text-400">{item.unit}</p>
                                    <p className={`mt-1 text-[11px] font-bold ${stockColor(item.level)}`}>Stock: {item.stock}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="rounded-xl border border-text-100 bg-white p-4">
                        <h3 className="text-[15px] font-bold text-text-900">Quick Actions</h3>

                        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
                            {QUICK_ACTIONS.map((action) => {
                                const Icon = icons[action.icon];
                                return (
                                    <button
                                        key={action.label}
                                        type="button"
                                        className="flex flex-col items-center gap-2 rounded-lg border border-text-100 p-3 text-center hover:bg-text-50"
                                    >
                                        <div
                                            className="flex h-9 w-9 items-center justify-center rounded-lg"
                                            style={{ background: action.bg }}
                                        >
                                            <Icon className="h-4 w-4" style={{ color: action.color }} />
                                        </div>
                                        <span className="text-[11px] font-semibold leading-tight text-text-800">{action.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex flex-col items-center justify-between gap-1 text-[11px] text-text-400 sm:flex-row">
                    <span>©2026 POS Cafe. All rights reserved.</span>
                    <span>
                        Made with <span className="text-red-400">♥</span> for your business
                    </span>
                </div>
            </div>
        </AppLayout>
    );
};

export default DashboardPage;