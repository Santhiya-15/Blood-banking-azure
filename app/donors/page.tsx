'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useData } from '@/lib/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function DonorsPage() {
  const { donors, addDonor } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodType: 'O+',
  });

  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDonor({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      bloodType: formData.bloodType,
      lastDonationDate: new Date().toISOString().split('T')[0],
      totalDonations: 0,
      eligibleForDonation: true,
    });
    setFormData({ name: '', email: '', phone: '', bloodType: 'O+' });
    setShowForm(false);
  };

  const eligibleDonors = donors.filter(d => d.eligibleForDonation).length;

  return (
    <ProtectedRoute>
      <DashboardLayout currentPage="/donors">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Donor Management</h1>
              <p className="text-slate-400">Register and manage blood donors</p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {showForm ? 'Cancel' : '+ Register Donor'}
            </Button>
          </div>

          {/* Add Donor Form */}
          {showForm && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Register New Donor</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="bg-slate-700 border-slate-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="555-0000"
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
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                      Register
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
                  <p className="text-slate-400 text-sm">Total Donors</p>
                  <p className="text-3xl font-bold text-white">{donors.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-900 border-green-700">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-green-100 text-sm">Eligible for Donation</p>
                  <p className="text-3xl font-bold text-green-100">{eligibleDonors}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Average Donations</p>
                  <p className="text-3xl font-bold text-white">
                    {donors.length > 0 ? (donors.reduce((sum, d) => sum + d.totalDonations, 0) / donors.length).toFixed(1) : 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Donors List */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Registered Donors</CardTitle>
              <CardDescription className="text-slate-400">{donors.length} donors in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Blood Type</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Contact</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Total Donations</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Last Donation</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donors.map((donor) => (
                      <tr key={donor.id} className="border-b border-slate-700 hover:bg-slate-700">
                        <td className="py-4 px-4 text-white font-medium">{donor.name}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-900 text-red-100">
                            {donor.bloodType}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <p className="text-white">{donor.email}</p>
                            <p className="text-slate-400">{donor.phone}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-white">{donor.totalDonations}</td>
                        <td className="py-4 px-4 text-slate-300 text-sm">{donor.lastDonationDate}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${donor.eligibleForDonation ? 'bg-green-900 text-green-100' : 'bg-slate-700 text-slate-300'}`}>
                            {donor.eligibleForDonation ? 'Eligible' : 'Not Eligible'}
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
