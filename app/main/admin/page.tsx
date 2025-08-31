import { createClient } from '@/app/lib/supabase/server';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch stats from API (server-side)
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/stats`, {
    method: 'GET',

  });
console.log(res)
  if (!res.ok) {
    return <p className="text-red-500">Error fetching stats</p>;
  }

  const stats = await res.json();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg">Total Users</h3>
          <p className="text-2xl">{stats.total_users}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg">Total Posts</h3>
          <p className="text-2xl">{stats.total_posts}</p>
        </div>
       
      </div>
    </div>
  );
}
