'use client'; // Client component for interactivity

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  // Add other fields as needed
}

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true)
    const fetchUsers = async () => {
      const res = await fetch('/api/admin/users', { method: 'GET' });
      console.log(res);
      if (!res.ok) {
        setError('Failed to fetch users');
        return;
      }
      const data = await res.json();
      setUsers(data|| []);
      // Adjust based on API response structure
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const deactivateUser = async (userId: string) => {
    const res = await fetch(`/api/admin/users/${userId}/deactivate`, { method: 'POST' });
    if (!res.ok) {
      alert('Failed to deactivate user');
      return;
    }
    alert('User deactivated');
    // Refresh users list
    window.location.reload();
  };

  const getUserDetails = async (userId: string) => {
    const res = await fetch(`/api/admin/users/${userId}`);
    if (!res.ok) {
      alert('Failed to fetch details');
      return;
    }
    const details = await res.json();
    alert(`User Details: ${JSON.stringify(details)}`); // Replace with modal or page
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Email</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="p-2">{user.id}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">
                <button onClick={() => getUserDetails(user.id)} className="text-blue-500 mr-2">Details</button>
                <button onClick={() => deactivateUser(user.id)} className="text-red-500">Deactivate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
