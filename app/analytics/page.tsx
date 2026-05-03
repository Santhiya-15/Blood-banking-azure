'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useData } from '@/lib/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const { inventory, donors, donations, requests } = useData();

  // Blood inventory data
  const inventoryData = inventory.map(item => ({
    name: item.bloodType,
    quantity: item.quantity,
  }));

  // Blood type distribution among donors
  const donorDistribution = inventory.map(item => ({
    name: item.bloodType,
    donors: donors.filter(d => d.bloodType === item.bloodType).length,
  }));

  // Request status distribution
  const requestStatusData = [
    { name: 'Pending', value: requests.filter(r => r.status === 'pending').length },
    { name: 'Approved', value: requests.filter(r => r.status === 'approved').length },
    { name: 'Rejected', value: requests.filter(r => r.status === 'rejected').length },
    { name: 'Fulfilled', value: requests.filter(r => r.status === 'fulfilled').length },
  ];

  // Donation trends (last 30 days simulation)
  const donationTrendData = [
    { day: 'Week 1', donations: Math.floor(donations.length * 0.2) },
    { day: 'Week 2', donations: Math.floor(donations.length * 0.25) },
    { day: 'Week 3', donations: Math.floor(donations.length * 0.35) },
    { day: 'Week 4', donations: Math.floor(donations.length * 0.2) },
  ];

  const colors = ['#dc2626', '#2563eb', '#16a34a', '#ea580c', '#d946ef', '#ca8a04', '#0891b2', '#7c3aed'];

  // Analytics metrics
  const totalBloodUnits = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const averageDonorDonations = donors.length > 0 ? (donors.reduce((sum, d) => sum + d.totalDonations, 0) / donors.length).toFixed(1) : 0;
  const requestFulfillmentRate = requests.length > 0 ? ((requests.filter(r => r.status === 'fulfilled').length / requests.length) * 100).toFixed(1) : 0;
  const eligibleDonors = donors.filter(d => d.eligibleForDonation).length;

  return (
    <ProtectedRoute>
      <DashboardLayout currentPage="/analytics">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Analytics & Reports</h1>
            <p className="text-slate-400">Blood bank performance metrics and insights</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Total Blood Units</p>
                  <p className="text-3xl font-bold text-white">{totalBloodUnits}</p>
                  <p className="text-xs text-slate-500">in inventory</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Eligible Donors</p>
                  <p className="text-3xl font-bold text-white">{eligibleDonors}</p>
                  <p className="text-xs text-slate-500">out of {donors.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Avg Donations/Donor</p>
                  <p className="text-3xl font-bold text-white">{averageDonorDonations}</p>
                  <p className="text-xs text-slate-500">donations</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Fulfillment Rate</p>
                  <p className="text-3xl font-bold text-white">{requestFulfillmentRate}%</p>
                  <p className="text-xs text-slate-500">of requests</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Blood Inventory Chart */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Blood Type Inventory</CardTitle>
                <CardDescription className="text-slate-400">Current stock levels by blood type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={inventoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} />
                    <Bar dataKey="quantity" fill="#dc2626" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Donor Distribution Chart */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Donor Distribution</CardTitle>
                <CardDescription className="text-slate-400">Donors by blood type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={donorDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} />
                    <Bar dataKey="donors" fill="#2563eb" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Request Status Distribution */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Request Status</CardTitle>
                <CardDescription className="text-slate-400">Blood request breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={requestStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {requestStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Donation Trends */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Donation Trends</CardTitle>
                <CardDescription className="text-slate-400">Donations over the past month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={donationTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="donations" stroke="#16a34a" dot={{ fill: '#16a34a' }} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Summary Report */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Summary Report</CardTitle>
              <CardDescription className="text-slate-400">Overall system statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Total Blood Units Collected</p>
                  <p className="text-2xl font-bold text-white">{donations.reduce((sum, d) => sum + d.quantity, 0)} ml</p>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Critical Stock Items</p>
                  <p className="text-2xl font-bold text-red-400">{inventory.filter(item => item.quantity <= 10).length}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Pending Blood Requests</p>
                  <p className="text-2xl font-bold text-orange-400">{requests.filter(r => r.status === 'pending').length}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Total Registered Donors</p>
                  <p className="text-2xl font-bold text-blue-400">{donors.length}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Total Donations Recorded</p>
                  <p className="text-2xl font-bold text-green-400">{donations.length}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Request Fulfillment Rate</p>
                  <p className="text-2xl font-bold text-purple-400">{requestFulfillmentRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
