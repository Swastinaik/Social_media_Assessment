'use client'; // Client component for interactivity

import { useState, useEffect } from 'react';

interface Post {
  id: string;
  content: string; // Assume fields; adjust to your schema
  created_at: string;
}

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/admin/posts', { method: 'GET' });
      if (!res.ok) {
        setError('Failed to fetch posts');
        return;
      }
      const data = await res.json();
      setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const deletePost = async (postId: string) => {
    const res = await fetch(`/api/admin/posts/${postId}`, { method: 'DELETE' });
    if (!res.ok) {
      alert('Failed to delete post');
      return;
    }
    alert('Post deleted');
    // Refresh posts list
    window.location.reload();
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Content Management</h2>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Title</th>
            <th className="p-2">Created At</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="p-2">{post.id}</td>
              <td className="p-2">{post.content}</td>
              <td className="p-2">{new Date(post.created_at).toLocaleDateString()}</td>
              <td className="p-2">
                <button onClick={() => deletePost(post.id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
