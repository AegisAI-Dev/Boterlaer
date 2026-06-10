import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import blogPosts from "@/data/blog-posts.json";

export const metadata: Metadata = {
  title: "Blog & News",
  description:
    "Read the latest news, updates, and gardening tips from Botanische Tuin Den Boterlaer. Learn about seasonal highlights, plant care, and upcoming events.",
};

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
  const posts: BlogPost[] = blogPosts;

  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("nl-BE", options);
  };

  return (
    <div className="garden-shell overflow-hidden">
      <section className="section-container pb-10 pt-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            <p className="eyebrow">Tuinjournalen</p>
            <h1 className="font-display text-5xl leading-[0.96] text-botanical-forest md:text-7xl">
              Notities, seizoensmomenten en verhalen uit Den Boterlaer.
            </h1>
            <p className="prose-custom max-w-2xl">
              Geen standaard nieuwsfeed, maar een verzameling botanische
              observaties, updates en teksten die de tuin in woorden verder
              openleggen.
            </p>
          </div>

          <div className="paper-panel rounded-[2.5rem] p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-moss">
              Leeskamer
            </p>
            <h2 className="mt-4 font-display text-4xl text-botanical-forest">
              Artikels liggen als labels en fiches verspreid over een grote tafel.
            </h2>
            <p className="mt-4 text-base leading-8 text-botanical-ink">
              De inhoud blijft dezelfde, maar de presentatie sluit nu aan bij de
              rest van de botanische route.
            </p>
          </div>
        </div>
      </section>

      <section className="section-container py-8">
        <div className="grid gap-5 lg:grid-cols-2">
          {sortedPosts.map((post, index) => (
            <article
              key={post.id}
              className={`group overflow-hidden rounded-[2.25rem] border border-botanical-forest/10 bg-white/72 shadow-paper backdrop-blur-sm ${
                index % 3 === 0 ? "lg:translate-y-4" : index % 3 === 1 ? "lg:-translate-y-4" : ""
              }`}
            >
              <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
                <div className="relative min-h-[260px] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-col justify-between p-6 md:p-7">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-botanical-moss">
                      <span>{formatDate(post.date)}</span>
                      <span className="text-botanical-gold">•</span>
                      <span>{post.author}</span>
                    </div>

                    <h2 className="mt-5 font-display text-4xl leading-tight text-botanical-forest">
                      {post.title}
                    </h2>
                    <p className="mt-4 text-base leading-8 text-botanical-ink/85">
                      {post.teaser}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between gap-4">
                    <span className="rounded-full border border-botanical-gold/40 bg-botanical-cream px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-botanical-forest">
                      Botanische notitie
                    </span>
                    <Link href={`/blog/${post.slug}`} className="garden-link">
                      Lees verder
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-container pt-6">
        <div className="rounded-[2.5rem] bg-botanical-forest px-6 py-10 text-botanical-cream shadow-botanical md:px-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-botanical-gold">
                Blijf verbonden
              </p>
              <h2 className="mt-5 font-display text-4xl md:text-5xl">
                Wil je reageren op een artikel of meer weten over een observatie?
              </h2>
              <p className="mt-5 text-lg leading-8 text-botanical-cream/90">
                Gebruik de contactpagina om vragen te stellen over blogartikels,
                plantzorg of nieuwe ontwikkelingen in de tuin.
              </p>
            </div>
            <div>
              <Link href="/contact" className="btn-secondary inline-flex">
                Neem contact op
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
