'use client';

import { useState } from 'react';
import {
  LayoutDashboard, QrCode, MessageSquare, BarChart3, Settings,
  Users, Star, TrendingUp, Bell, LogOut, Plus, Eye, Phone,
  MapPin, Calendar, ChevronRight, ExternalLink, Download
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const stats = [
    { label: 'Total Reviews', value: '247', change: '+12%', icon: Star, color: 'warning' },
    { label: 'Average Rating', value: '4.8', change: '+0.2', icon: TrendingUp, color: 'success' },
    { label: 'Profile Views', value: '1.2K', change: '+28%', icon: Eye, color: 'primary' },
    { label: 'QR Scans', value: '89', change: '+15%', icon: QrCode, color: 'primary' },
  ];

  const recentReviews = [
    { id: 1, name: 'Ahmed Khan', rating: 5, text: 'Amazing food and great service!', date: '2 hours ago', status: 'published' },
    { id: 2, name: 'Sara Ali', rating: 4, text: 'Good experience, will visit again.', date: '5 hours ago', status: 'published' },
    { id: 3, name: 'Anonymous', rating: 2, text: 'Service was slow...', date: '1 day ago', status: 'private' },
    { id: 4, name: 'Usman Malik', rating: 5, text: 'Best restaurant in town!', date: '2 days ago', status: 'published' },
  ];

  const businesses = [
    { id: 1, name: 'Karachi Biryani House', location: 'Karachi, Pakistan', reviews: 156, rating: 4.8 },
    { id: 2, name: 'Lahori Grill', location: 'Lahore, Pakistan', reviews: 91, rating: 4.6 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && <span className="text-xl font-bold text-gray-900">BizBoost</span>}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
            { icon: QrCode, label: 'QR Codes', id: 'qr' },
            { icon: MessageSquare, label: 'Reviews', id: 'reviews' },
            { icon: BarChart3, label: 'Analytics', id: 'analytics' },
            { icon: Users, label: 'Customers', id: 'customers' },
            { icon: Settings, label: 'Settings', id: 'settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Upgrade Card */}
        {sidebarOpen && (
          <div className="absolute bottom-24 left-4 right-4">
            <div className="p-4 rounded-xl gradient-primary text-white">
              <h4 className="font-bold mb-2">Upgrade to Pro</h4>
              <p className="text-sm opacity-90 mb-3">Get unlimited reviews and more features</p>
              <button className="w-full py-2 bg-white text-primary-600 rounded-lg font-medium text-sm">
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {/* User */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-primary-600">AK</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">Ahmed Khan</div>
                <div className="text-sm text-gray-500 truncate">ahmed@example.com</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="sticky top-0 bg-white border-b border-gray-100 z-40">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, Ahmed!</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
              </button>
              <button className="btn btn-primary">
                <Plus className="w-5 h-5 mr-2" />
                Add Business
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                  </div>
                  <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-success-500' : 'text-danger-500'}`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Businesses */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Your Businesses</h3>
                  <button className="text-sm text-primary-600 font-medium hover:underline">
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {businesses.map((business) => (
                    <div key={business.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                      <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{business.name}</div>
                        <div className="text-sm text-gray-500">{business.location}</div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-warning-500">
                          <Star className="w-4 h-4 fill-warning-500" />
                          <span className="font-bold">{business.rating}</span>
                        </div>
                        <div className="text-sm text-gray-500">{business.reviews} reviews</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Reviews */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Recent Reviews</h3>
                  <button className="text-sm text-primary-600 font-medium hover:underline">
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-xl border border-gray-100">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="font-bold text-gray-600">
                              {review.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{review.name}</div>
                            <div className="text-sm text-gray-500">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`badge ${review.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                            {review.status}
                          </span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${star <= review.rating ? 'text-warning-500 fill-warning-500' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* QR Code Card */}
              <div className="card text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Your Review QR</h3>
                <div className="qr-container inline-block mb-4">
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-3">
                  <button className="btn btn-primary w-full">
                    <Download className="w-5 h-5 mr-2" />
                    Download QR
                  </button>
                  <button className="btn btn-secondary w-full">
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Test QR
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 mb-4">This Month</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">New Reviews</span>
                    <span className="font-bold text-gray-900">+23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">QR Scans</span>
                    <span className="font-bold text-gray-900">+45</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Private Feedback</span>
                    <span className="font-bold text-gray-900">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">AI Reviews Used</span>
                    <span className="font-bold text-gray-900">18 / 100</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500 mb-2">AI Reviews Usage</div>
                    <div className="progress">
                      <div className="progress-bar" style={{ width: '18%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition text-left">
                    <QrCode className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium">Generate New QR</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition text-left">
                    <MessageSquare className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium">Respond to Reviews</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition text-left">
                    <BarChart3 className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium">View Full Analytics</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition text-left">
                    <Phone className="w-5 h-5 text-primary-600" />
                    <span className="text-sm font-medium">Contact Support</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
