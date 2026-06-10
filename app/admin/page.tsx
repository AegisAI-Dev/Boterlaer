import Link from "next/link";
import { prisma } from "@/lib/db";
import walkData from "@/data/walk.json";
import blogData from "@/data/blog-posts.json";

export default async function AdminDashboard() {
  const plantsCount = await prisma.plant.count();
  const walkStopsCount = walkData.length;
  const blogCount = blogData.length;


  const stats = [
    {
      title: "Planten",
      count: plantsCount,
      href: "/admin/plants",
      icon: "🌿",
      color: "bg-green-500",
    },
    {
      title: "Wandelstops",
      count: walkStopsCount,
      href: "/admin/walk",
      icon: "🚶",
      color: "bg-blue-500",
    },
    {
      title: "Blog Posts",
      count: blogCount,
      href: "/admin/blog",
      icon: "📝",
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-2 text-accent mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Beheer alle content van de website
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="card p-6 hover:scale-105 transition-transform duration-300 bg-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-accent">{stat.count}</p>
              </div>
              <div className={`${stat.color} p-4 rounded-full text-3xl`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6 bg-white">
          <h2 className="text-xl font-bold text-accent mb-4">Snelle Acties</h2>
          <div className="space-y-3">
            <Link
              href="/admin/plants/new"
              className="block px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center"
            >
              + Nieuwe Plant Toevoegen
            </Link>
            <Link
              href="/admin/walk/new"
              className="block px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              + Nieuwe Wandelstop Toevoegen
            </Link>
            <Link
              href="/admin/blog/new"
              className="block px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
            >
              + Nieuw Blog Post Toevoegen
            </Link>
            <Link
              href="/admin/upload"
              className="block px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-center"
            >
              📤 Upload Center (Onbeperkt)
            </Link>
            <Link
              href="/admin/videos/management"
              className="block px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-center"
            >
              🎥 Video Management (Nieuw)
            </Link>
            <Link
              href="/admin/settings"
              className="block px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-center"
            >
              ⚙️ Site Instellingen
            </Link>
          </div>
        </div>

        <div className="card p-6 bg-white">
          <h2 className="text-xl font-bold text-accent mb-4">Informatie</h2>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Welkom bij het Admin Dashboard!</strong>
            </p>
            <p className="text-sm">
              Vanaf hier kun je alle content van de website beheren:
            </p>
            <ul className="text-sm list-disc list-inside space-y-1 ml-2">
              <li>Planten toevoegen, bewerken en verwijderen</li>
              <li>Wandelstops beheren</li>
              <li>Blog posts schrijven en bewerken</li>
              <li>Onbeperkt foto's en video's uploaden</li>
            </ul>
            <p className="text-sm mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <strong>Tip:</strong> Wijzig de standaard inloggegevens in de
              productieomgeving voor beveiliging.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

