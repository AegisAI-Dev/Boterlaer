"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  date: string;
  author: string;
  teaser: string;
  image: string;
  content: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/blog");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Weet je zeker dat je dit blog post wilt verwijderen?")) {
      return;
    }

    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchPosts();
      } else {
        alert("Fout bij verwijderen van blog post");
      }
    } catch (error) {
      console.error("Failed to delete blog post:", error);
      alert("Fout bij verwijderen van blog post");
    }
  };

  if (loading) {
    return <div>Laden...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="heading-2 text-accent mb-2">Blog Beheer</h1>
          <p className="text-gray-600">
            Beheer alle blog posts ({posts.length} posts)
          </p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary">
          + Nieuw Blog Post
        </Link>
      </div>

      <div className="card bg-white p-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Nog geen blog posts toegevoegd</p>
            <Link href="/admin/blog/new" className="btn-primary">
              Eerste Post Toevoegen
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Titel</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Auteur</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Datum</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Acties</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{post.id}</td>
                    <td className="py-3 px-4 font-medium">{post.title}</td>
                    <td className="py-3 px-4">{post.author}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(post.date).toLocaleDateString("nl-NL")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Bewerken
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Verwijderen
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

