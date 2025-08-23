"use client"; // This is a client component for any future interactivity

import Link from "next/link";
import { Home, Bell, User, Plus } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-gray-100 border-r border-gray-200 flex flex-col p-4 space-y-4">
      {/* Sidebar Header (optional, like Notion's workspace name) */}
      <div className="text-lg font-semibold mb-4">My App</div>
      
      {/* Navigation Links */}
      <nav className="flex flex-col space-y-2">
        <Link
          href="/main"
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 transition-colors"
        >
          <Home size={20} />
          <span>Home</span>
        </Link>
        <Link
          href="/main/notifications"
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 transition-colors"
        >
          <Bell size={20} />
          <span>Notifications</span>
        </Link>
        <Link
          href="/main/me"
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 transition-colors"
        >
          <User size={20} />
          <span>Profile</span>
        </Link>
        <Link
          href="/main/create-post"
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 transition-colors"
        >
          <Plus size={20} />
          <span>Create Post</span>
        </Link>
      </nav>
    </div>
  );
}
