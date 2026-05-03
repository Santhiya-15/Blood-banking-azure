'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useData } from '@/lib/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function DonationsPage() {
  const { donations, donors, addDonation, updateInventory, inventory } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    donorId: '',
    quantity: 450,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const donor = donors.find(d => d.id === formData.donorId);
    if (!donor) return;

    const newDonation = {
      donorId: formData.donorId,
      donorName: donor.name,
      bloodType: donor.bloodType,
      quantity: formData.quantity,
      collectionDate: new Date().toISOString().split('T')[0],
      status: 'completed' as const,
    };

    addDonation(newDonation);

    // Update inventory
    const inventoryItem = inventory.find(item => item.bloodType === donor.bloodType);
    if (inventoryItem) {
      updateInventory(inventoryItem.id, {
        quantity: inventoryItem.quantity + Math.floor(formData.quantity / 100),
        lastUpdated: new Date().toISOString(),
      });
    }

    setFormData({ donorId: '', quantity: 450 });
    setShowForm(false);
  };

  const completedDonations = donations.filter(d => d.status === 'completed').length;
  const totalCollected = donations.reduce((sum, d) => sum + d.quantity, 0);

  return (
    <ProtectedRoute>
      <DashboardLayout currentPage="/donations">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Donation Records</h1>
              <p className="text-slate-400">Track and record blood donations</p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {showForm ? 'Cancel' : '+ Record Donation'}
            </Button>
          </div>

          {/* Record Donation Form */}
          {showForm && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Record New Donation</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Select Donor</label>
                      <select
                        value={formData.donorId}
                        onChange={(e) => setFormData({ ...formData, donorId: e.target.value })}
                        className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
                        required
                      >
                        <option value="">Choose a donor...</option>
                        {donors.map(donor => (
                          <option key={donor.id} value={donor.id}>
                            {donor.name} ({donor.bloodType}) - {donor.eligibleForDonation ? 'Eligible' : 'Not Eligible'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Quantity (ml)</label>
                      <Input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                        min="100"
                        max="500"
                        step="50"
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                      Record Donation
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Total Donations</p>
                  <p className="text-3xl font-bold text-white">{donations.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Completed</p>
                  <p className="text-3xl font-bold text-white">{completedDonations}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-900 border-red-700">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-red-100 text-sm">Total Collected</p>
                  <p className="text-3xl font-bold text-red-100">{totalCollected}</p>
                  <p className="text-xs text-red-200">ml</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Donations List */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">All Donation Records</CardTitle>
              <CardDescription className="text-slate-400">{donations.length} records in total</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Donor Name</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Blood Type</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Quantity</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Collection Date</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation) => (
                      <tr key={donation.id} className="border-b border-slate-700 hover:bg-slate-700">
                        <td className="py-4 px-4 text-white font-medium">{donation.donorName}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-900 text-red-100">
                            {donation.bloodType}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-white">{donation.quantity} ml</td>
                        <td className="py-4 px-4 text-slate-300">{donation.collectionDate}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-100">
                            {donation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
