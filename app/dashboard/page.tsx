'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useData } from '@/lib/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';

function BloodTypeCard({ bloodType, quantity, status }: { bloodType: string; quantity: number; status: 'critical' | 'low' | 'medium' | 'adequate' }) {
  const statusColors = {
    critical: 'bg-red-900 border-red-700',
    low: 'bg-orange-900 border-orange-700',
    medium: 'bg-yellow-900 border-yellow-700',
    adequate: 'bg-green-900 border-green-700',
  };

  const statusTextColors = {
    critical: 'text-red-100',
    low: 'text-orange-100',
    medium: 'text-yellow-100',
    adequate: 'text-green-100',
  };

  return (
    <Card className={`${statusColors[status]} border`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-white">{bloodType}</p>
            <p className={`text-sm font-medium ${statusTextColors[status]}`}>{status.toUpperCase()}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{quantity}</p>
            <p className="text-xs text-slate-300">units</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getStatus(quantity: number): 'critical' | 'low' | 'medium' | 'adequate' {
  if (quantity <= 10) return 'critical';
  if (quantity <= 20) return 'low';
  if (quantity <= 30) return 'medium';
  return 'adequate';
}

export default function DashboardPage() {
  const { inventory, donors, donations, requests } = useData();
  const { user } = useAuth();

  const totalInventory = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalDonors = donors.length;
  const totalDonations = donations.length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;

  return (
    <ProtectedRoute>
      <DashboardLayout currentPage="/dashboard">
        <div className="p-6 space-y-6">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user?.name}!</h1>
            <p className="text-slate-400">Here's your blood bank overview for today</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Total Inventory</p>
                  <p className="text-3xl font-bold text-white">{totalInventory}</p>
                  <p className="text-xs text-slate-500">units in stock</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Total Donors</p>
                  <p className="text-3xl font-bold text-white">{totalDonors}</p>
                  <p className="text-xs text-slate-500">registered</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Total Donations</p>
                  <p className="text-3xl font-bold text-white">{totalDonations}</p>
                  <p className="text-xs text-slate-500">completed</p>
                </div>
              </CardContent>
            </Card>

            <Card className={`${pendingRequests > 0 ? 'bg-red-900 border-red-700' : 'bg-slate-800 border-slate-700'}`}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className={`text-sm ${pendingRequests > 0 ? 'text-red-100' : 'text-slate-400'}`}>Pending Requests</p>
                  <p className={`text-3xl font-bold ${pendingRequests > 0 ? 'text-red-100' : 'text-white'}`}>{pendingRequests}</p>
                  <p className={`text-xs ${pendingRequests > 0 ? 'text-red-200' : 'text-slate-500'}`}>need attention</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Blood Inventory Grid */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Blood Type Inventory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {inventory.map((item) => (
                <BloodTypeCard
                  key={item.id}
                  bloodType={item.bloodType}
                  quantity={item.quantity}
                  status={getStatus(item.quantity)}
                />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Donations</CardTitle>
                <CardDescription className="text-slate-400">Latest donation records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {donations.slice(0, 5).map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-white">{donation.donorName}</p>
                        <p className="text-xs text-slate-400">{donation.bloodType} • {donation.quantity} ml</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-100">
                        {donation.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Blood Requests</CardTitle>
                <CardDescription className="text-slate-400">Hospital requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requests.map((request) => {
                    const urgencyColors = {
                      low: 'bg-blue-900 text-blue-100',
                      medium: 'bg-yellow-900 text-yellow-100',
                      high: 'bg-orange-900 text-orange-100',
                      critical: 'bg-red-900 text-red-100',
                    };
                    return (
                      <div key={request.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-white">{request.hospitalName}</p>
                          <p className="text-xs text-slate-400">{request.bloodType} • {request.quantity} units</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${urgencyColors[request.urgency]}`}>
                          {request.urgency}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
