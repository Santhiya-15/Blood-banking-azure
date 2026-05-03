'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface BloodInventory {
  id: string;
  bloodType: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  lastUpdated: string;
}

export interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodType: string;
  lastDonationDate: string;
  totalDonations: number;
  eligibleForDonation: boolean;
}

export interface DonationRecord {
  id: string;
  donorId: string;
  donorName: string;
  bloodType: string;
  quantity: number;
  collectionDate: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface BloodRequest {
  id: string;
  hospitalName: string;
  bloodType: string;
  quantity: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
}

interface DataContextType {
  inventory: BloodInventory[];
  donors: Donor[];
  donations: DonationRecord[];
  requests: BloodRequest[];
  
  addInventory: (item: Omit<BloodInventory, 'id'>) => void;
  updateInventory: (id: string, item: Partial<BloodInventory>) => void;
  addDonor: (donor: Omit<Donor, 'id'>) => void;
  updateDonor: (id: string, donor: Partial<Donor>) => void;
  addDonation: (donation: Omit<DonationRecord, 'id'>) => void;
  addRequest: (request: Omit<BloodRequest, 'id'>) => void;
  updateRequest: (id: string, request: Partial<BloodRequest>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const INITIAL_INVENTORY: BloodInventory[] = [
  { id: '1', bloodType: 'O+', quantity: 45, unit: 'units', expiryDate: '2026-05-20', lastUpdated: new Date().toISOString() },
  { id: '2', bloodType: 'O-', quantity: 22, unit: 'units', expiryDate: '2026-04-15', lastUpdated: new Date().toISOString() },
  { id: '3', bloodType: 'A+', quantity: 38, unit: 'units', expiryDate: '2026-06-10', lastUpdated: new Date().toISOString() },
  { id: '4', bloodType: 'A-', quantity: 15, unit: 'units', expiryDate: '2026-05-05', lastUpdated: new Date().toISOString() },
  { id: '5', bloodType: 'B+', quantity: 28, unit: 'units', expiryDate: '2026-05-25', lastUpdated: new Date().toISOString() },
  { id: '6', bloodType: 'B-', quantity: 12, unit: 'units', expiryDate: '2026-04-30', lastUpdated: new Date().toISOString() },
  { id: '7', bloodType: 'AB+', quantity: 18, unit: 'units', expiryDate: '2026-06-01', lastUpdated: new Date().toISOString() },
  { id: '8', bloodType: 'AB-', quantity: 8, unit: 'units', expiryDate: '2026-05-15', lastUpdated: new Date().toISOString() },
];

const INITIAL_DONORS: Donor[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', phone: '555-0101', bloodType: 'O+', lastDonationDate: '2026-03-10', totalDonations: 12, eligibleForDonation: true },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', phone: '555-0102', bloodType: 'A+', lastDonationDate: '2026-02-15', totalDonations: 8, eligibleForDonation: true },
  { id: '3', name: 'Carol White', email: 'carol@example.com', phone: '555-0103', bloodType: 'B+', lastDonationDate: '2026-03-18', totalDonations: 15, eligibleForDonation: false },
  { id: '4', name: 'David Brown', email: 'david@example.com', phone: '555-0104', bloodType: 'AB+', lastDonationDate: '2026-01-20', totalDonations: 5, eligibleForDonation: true },
];

const INITIAL_DONATIONS: DonationRecord[] = [
  { id: '1', donorId: '1', donorName: 'Alice Johnson', bloodType: 'O+', quantity: 450, collectionDate: '2026-03-10', status: 'completed' },
  { id: '2', donorId: '2', donorName: 'Bob Smith', bloodType: 'A+', quantity: 450, collectionDate: '2026-02-15', status: 'completed' },
  { id: '3', donorId: '4', donorName: 'David Brown', bloodType: 'AB+', quantity: 450, collectionDate: '2026-01-20', status: 'completed' },
];

const INITIAL_REQUESTS: BloodRequest[] = [
  { id: '1', hospitalName: 'Central Hospital', bloodType: 'O+', quantity: 10, urgency: 'high', requestDate: '2026-03-20', status: 'approved' },
  { id: '2', hospitalName: 'City Medical Center', bloodType: 'A+', quantity: 5, urgency: 'medium', requestDate: '2026-03-19', status: 'pending' },
  { id: '3', hospitalName: 'Emergency Care Clinic', bloodType: 'B+', quantity: 15, urgency: 'critical', requestDate: '2026-03-21', status: 'pending' },
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [inventory, setInventory] = useState<BloodInventory[]>(INITIAL_INVENTORY);
  const [donors, setDonors] = useState<Donor[]>(INITIAL_DONORS);
  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATIONS);
  const [requests, setRequests] = useState<BloodRequest[]>(INITIAL_REQUESTS);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('bloodbank_data');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setInventory(data.inventory || INITIAL_INVENTORY);
        setDonors(data.donors || INITIAL_DONORS);
        setDonations(data.donations || INITIAL_DONATIONS);
        setRequests(data.requests || INITIAL_REQUESTS);
      } catch (error) {
        console.error('[v0] Failed to parse stored data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('bloodbank_data', JSON.stringify({ inventory, donors, donations, requests }));
  }, [inventory, donors, donations, requests]);

  const addInventory = (item: Omit<BloodInventory, 'id'>) => {
    const newItem: BloodInventory = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
    };
    setInventory([...inventory, newItem]);
  };

  const updateInventory = (id: string, item: Partial<BloodInventory>) => {
    setInventory(inventory.map(inv => inv.id === id ? { ...inv, ...item } : inv));
  };

  const addDonor = (donor: Omit<Donor, 'id'>) => {
    const newDonor: Donor = {
      ...donor,
      id: Math.random().toString(36).substr(2, 9),
    };
    setDonors([...donors, newDonor]);
  };

  const updateDonor = (id: string, donor: Partial<Donor>) => {
    setDonors(donors.map(d => d.id === id ? { ...d, ...donor } : d));
  };

  const addDonation = (donation: Omit<DonationRecord, 'id'>) => {
    const newDonation: DonationRecord = {
      ...donation,
      id: Math.random().toString(36).substr(2, 9),
    };
    setDonations([...donations, newDonation]);
  };

  const addRequest = (request: Omit<BloodRequest, 'id'>) => {
    const newRequest: BloodRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
    };
    setRequests([...requests, newRequest]);
  };

  const updateRequest = (id: string, request: Partial<BloodRequest>) => {
    setRequests(requests.map(r => r.id === id ? { ...r, ...request } : r));
  };

  return (
    <DataContext.Provider
      value={{
        inventory,
        donors,
        donations,
        requests,
        addInventory,
        updateInventory,
        addDonor,
        updateDonor,
        addDonation,
        addRequest,
        updateRequest,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
