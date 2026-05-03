'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useData } from '@/lib/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RequestsPage() {
  const { requests, addRequest, updateRequest, inventory } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    hospitalName: '',
    bloodType: 'O+',
    quantity: 5,
    urgency: 'medium' as const,
  });

  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const urgencies = ['low', 'medium', 'high', 'critical'] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRequest({
      hospitalName: formData.hospitalName,
      bloodType: formData.bloodType,
      quantity: formData.quantity,
      urgency: formData.urgency,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    });
    setFormData({ hospitalName: '', bloodType: 'O+', quantity: 5, urgency: 'medium' });
    setShowForm(false);
  };

  const handleApprove = (id: string) => {
    const request = requests.find(r => r.id === id);
    if (request) {
      const inventoryItem = inventory.find(item => item.bloodType === request.bloodType);
      if (inventoryItem && inventoryItem.quantity >= request.quantity) {
        updateRequest(id, { status: 'approved' });
      }
    }
  };

  const handleReject = (id: string) => {
    updateRequest(id, { status: 'rejected' });
  };

  const handleFulfill = (id: string) => {
    updateRequest(id, { status: 'fulfilled' });
  };

  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const criticalRequests = requests.filter(r => r.urgency === 'critical').length;
  const fulfilledRequests = requests.filter(r => r.status === 'fulfilled').length;

  return (
    <ProtectedRoute>
      <DashboardLayout currentPage="/requests">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Blood Requests</h1>
              <p className="text-slate-400">Manage hospital blood requisition requests</p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {showForm ? 'Cancel' : '+ New Request'}
            </Button>
          </div>

          {/* New Request Form */}
          {showForm && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Create Blood Request</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Hospital Name</label>
                      <Input
                        type="text"
                        value={formData.hospitalName}
                        onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                        placeholder="Hospital name"
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Blood Type</label>
                      <select
                        value={formData.bloodType}
                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                        className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                      >
                        {bloodTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Quantity (units)</label>
                      <Input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                        min="1"
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Urgency</label>
                      <select
                        value={formData.urgency}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                        className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                      >
                        {urgencies.map(u => (
                          <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                      Create Request
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className={pendingRequests > 0 ? 'bg-orange-900 border-orange-700' : 'bg-slate-800 border-slate-700'}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className={`text-sm ${pendingRequests > 0 ? 'text-orange-100' : 'text-slate-400'}`}>Pending Requests</p>
                  <p className={`text-3xl font-bold ${pendingRequests > 0 ? 'text-orange-100' : 'text-white'}`}>{pendingRequests}</p>
                </div>
              </CardContent>
            </Card>

            <Card className={criticalRequests > 0 ? 'bg-red-900 border-red-700' : 'bg-slate-800 border-slate-700'}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className={`text-sm ${criticalRequests > 0 ? 'text-red-100' : 'text-slate-400'}`}>Critical Requests</p>
                  <p className={`text-3xl font-bold ${criticalRequests > 0 ? 'text-red-100' : 'text-white'}`}>{criticalRequests}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-900 border-green-700">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-green-100 text-sm">Fulfilled</p>
                  <p className="text-3xl font-bold text-green-100">{fulfilledRequests}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Requests List */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">All Requests</CardTitle>
              <CardDescription className="text-slate-400">{requests.length} total requests</CardDescription>
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

                  const statusColors = {
                    pending: 'bg-yellow-900 text-yellow-100',
                    approved: 'bg-blue-900 text-blue-100',
                    rejected: 'bg-red-900 text-red-100',
                    fulfilled: 'bg-green-900 text-green-100',
                  };

                  const inventory_item = inventory.find(item => item.bloodType === request.bloodType);
                  const hasStock = inventory_item && inventory_item.quantity >= request.quantity;

                  return (
                    <div key={request.id} className="p-4 bg-slate-700 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-semibold text-white">{request.hospitalName}</p>
                          <p className="text-sm text-slate-300">{request.requestDate}</p>
                        </div>
                        <div className="flex gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${urgencyColors[request.urgency]}`}>
                            {request.urgency}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[request.status]}`}>
                            {request.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-300">
                            Blood Type: <span className="font-semibold text-white">{request.bloodType}</span> • Quantity: <span className="font-semibold text-white">{request.quantity} units</span>
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            Available: {inventory_item?.quantity || 0} units
                          </p>
                        </div>

                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleApprove(request.id)}
                              disabled={!hasStock}
                              className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 disabled:opacity-50"
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleReject(request.id)}
                              className="bg-red-600 hover:bg-red-700 text-white text-sm px-3"
                            >
                              Reject
                            </Button>
                          </div>
                        )}

                        {request.status === 'approved' && (
                          <Button
                            onClick={() => handleFulfill(request.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3"
                          >
                            Fulfill
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
