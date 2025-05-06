// src/app/components/AdminPageComponents/AdminDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { House } from '@/app/types/house';
import HouseForm from '@/app/components/AdminPageComponents/HouseForm';

interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export default function AdminDashboard() {
  const [houses, setHouses] = useState<House[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingHouse, setEditingHouse] = useState<House | 'new' | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const housesRes = await fetch('/api/houses/getHouses', { method: 'GET', credentials: 'include' });
        if (!housesRes.ok) throw new Error(await housesRes.text());
        const housesData: House[] = await housesRes.json();
        setHouses(
          housesData.map(h => ({
            ...h,
            location: { latitude: Number(h.location.latitude), longitude: Number(h.location.longitude) }
          }))
        );

        const usersRes = await fetch('/api/users/getUsers', { method: 'GET', credentials: 'include' });
        if (!usersRes.ok) throw new Error(await usersRes.text());
        const usersJson: { users: User[] } = await usersRes.json();
        setUsers(usersJson.users);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const saveHouse = async (data: Record<string, any>) => {
    setLoading(true);
    try {
      if (data.id) {
        await fetch('/api/houses/updateHouse', {
          method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } else {
        const addRes = await fetch('/api/houses/addHouse', {
          method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!addRes.ok) throw new Error(await addRes.text());
        const { id } = await addRes.json();
        data.id = id;
      }

      const freshRes = await fetch('/api/houses/getHouses', { method: 'GET', credentials: 'include' });
      if (!freshRes.ok) throw new Error(await freshRes.text());
      const fresh: House[] = await freshRes.json();
      setHouses(fresh.map(h => ({ ...h, location: { latitude: Number(h.location.latitude), longitude: Number(h.location.longitude) }})));
      setEditingHouse(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save house.');
    } finally {
      setLoading(false);
    }
  };
  
  const deleteHouse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this house?')) return;
    setLoading(true);
    try {
      await fetch('/api/houses/deleteHouse', {
        method: 'DELETE', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id })
      });
      const freshRes = await fetch('/api/houses/getHouses', { method: 'GET', credentials: 'include' });
      if (!freshRes.ok) throw new Error(await freshRes.text());
      setHouses(await freshRes.json());
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to delete house.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="max-w-full mx-auto p-4 sm:p-6 text-center text-gray-500">Loading…</div>;
  if (error)   return <div className="max-w-full mx-auto p-4 sm:p-6 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-full sm:max-w-4xl mx-auto p-4 sm:p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <button
        className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        onClick={() => setEditingHouse('new')}
      >Add New House</button>
      <ul className="space-y-4">
        {houses.length > 0 ? houses.map(h => (
          <li key={h.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white rounded shadow">
            <span className="block mb-2 sm:mb-0">{h.title || 'Untitled'}</span>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
              <button onClick={() => setEditingHouse(h)} className="w-full sm:w-auto bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Edit</button>
              <button onClick={() => deleteHouse(h.id)} className="w-full sm:w-auto bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
            </div>
          </li>
        )) : <li className="w-full text-center text-gray-500">No houses available.</li>}
      </ul>

      {editingHouse !== null && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">{editingHouse === 'new' ? 'Add New House' : 'Edit House'}</h2>
          <HouseForm house={editingHouse === 'new' ? null : editingHouse} users={users} onSave={saveHouse} onCancel={() => setEditingHouse(null)} />
        </div>
      )}
    </div>
  );
}