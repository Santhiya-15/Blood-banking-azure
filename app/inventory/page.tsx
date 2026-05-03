'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useData, BloodInventory } from '@/lib/data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function InventoryPage() {
  const { inventory, updateInventory } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<BloodInventory>>({});

  const handleEdit = (item: BloodInventory) => {
    setEditingId(item.id);
    setEditValues(item);
  };

  const handleSave = () => {
    if (editingId && editValues.quantity !== undefined) {
      updateInventory(editingId, {
        quantity: editValues.quantity,
        lastUpdated: new Date().toISOString(),
      });
      setEditingId(null);
      setEditValues({});
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  return (
    <ProtectedRoute>
      <DashboardLayout currentPage="/inventory">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Blood Inventory Management</h1>
            <p className="text-slate-400">Manage and track blood type inventory levels</p>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Current Stock</CardTitle>
              <CardDescription className="text-slate-400">Updated {new Date().toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Blood Type</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Quantity (units)</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Expiry Date</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-slate-300 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => {
                      const isEditing = editingId === item.id;
                      let status = 'adequate';
                      if (item.quantity <= 10) status = 'critical';
                      else if (item.quantity <= 20) status = 'low';
                      else if (item.quantity <= 30) status = 'medium';

                      const statusColors = {
                        adequate: 'bg-green-900 text-green-100',
                        medium: 'bg-yellow-900 text-yellow-100',
                        low: 'bg-orange-900 text-orange-100',
                        critical: 'bg-red-900 text-red-100',
                      };

                      return (
                        <tr key={item.id} className="border-b border-slate-700 hover:bg-slate-700">
                          <td className="py-4 px-4 text-white font-medium">{item.bloodType}</td>
                          <td className="py-4 px-4">
                            {isEditing ? (
                              <Input
                                type="number"
                                value={editValues.quantity || 0}
                                onChange={(e) => setEditValues({ ...editValues, quantity: parseInt(e.target.value) })}
                                className="bg-slate-600 border-slate-500 text-white w-24"
                              />
                            ) : (
                              <span className="text-white">{item.quantity}</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-slate-300 text-sm">{item.expiryDate}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[status as keyof typeof statusColors]}`}>
                              {status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {isEditing ? (
                              <div className="flex gap-2">
                                <Button
                                  onClick={handleSave}
                                  className="bg-green-600 hover:bg-green-700 text-white text-xs px-3"
                                >
                                  Save
                                </Button>
                                <Button
                                  onClick={handleCancel}
                                  className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3"
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <Button
                                onClick={() => handleEdit(item)}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3"
                              >
                                Edit
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Total Units in Stock</p>
                  <p className="text-3xl font-bold text-white">{inventory.reduce((sum, item) => sum + item.quantity, 0)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm">Blood Types Available</p>
                  <p className="text-3xl font-bold text-white">{inventory.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-900 border-red-700">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <p className="text-red-100 text-sm">Critical Stock Levels</p>
                  <p className="text-3xl font-bold text-red-100">{inventory.filter(item => item.quantity <= 10).length}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
