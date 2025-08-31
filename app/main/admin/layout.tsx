import { createClient } from '@/app/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user || user.app_metadata?.role !== 'admin') {
    redirect('/login'); // Or '/unauthorized'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/main/admin" className="hover:underline">Overview</Link></li>
            <li><Link href="/main/admin/users" className="hover:underline">Users</Link></li>
            <li><Link href="/main/admin/posts" className="hover:underline">Posts</Link></li>
          </ul>
        </nav>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
