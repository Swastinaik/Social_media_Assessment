'use client';

import { useState, useEffect } from 'react';
import { createClient  } from '@/app/lib/supabase/client'; // Client-side Supabase

interface Notification {
  id: string;
  message: string;
  is_read: boolean;
  // Other fields...
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const supabaseClient = createClient();

  // Fetch initial notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
      }
    };
    fetchNotifications();
  }, []);

  // Real-time subscription
  useEffect(() => {
    const channel = supabaseClient
      .channel('notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        const newNotification = payload.new as Notification;
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1); // Increment unread
      })
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  const markAsRead = async (id: string) => {
    const res = await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
    if (res.ok) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => prev - 1);
    }
  };

  const markAllRead = async () => {
    const res = await fetch('/api/notifications/mark-all-read', { method: 'POST' });
    if (res.ok) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    }
  };

  return (
    <div className="relative">
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Notifications ({unreadCount})</button>
      <div className="absolute bg-white shadow p-4 mt-2">
        <button onClick={markAllRead} className="text-blue-500 mb-2">Mark All Read</button>
        {notifications.map((n) => (
          <div key={n.id} className={`p-2 ${n.is_read ? 'text-gray-500' : 'font-bold'}`}>
            {n.message}
            {!n.is_read && <button onClick={() => markAsRead(n.id)} className="ml-2 text-green-500">Mark Read</button>}
          </div>
        ))}
      </div>
    </div>
  );
}
