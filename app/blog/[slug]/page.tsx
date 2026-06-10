import { use } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import blogPosts from "@/data/blog-posts.json";

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

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.teaser,
  };
}

export default function BlogPostPage({ params: paramsPromise }: Props) {
  const params = use(paramsPromise);
  const post: BlogPost | undefined = blogPosts.find(
    (p) => p.slug === params.slug
  );

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/80 to-primary-900/70 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${post.image}')`,
          }}
        ></div>
        <div className="relative z-20 text-center px-4 max-w-4xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center text-lg text-gray-200">
            <span>{formatDate(post.date)}</span>
            <span className="mx-3">•</span>
            <span>By {post.author}</span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="section-container">
        <div className="max-w-3xl mx-auto">
          {/* Back to Blog Link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8 font-medium"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none">
            {post.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-accent mb-4">
              Share this post
            </h3>
            <div className="flex space-x-4">
              {/* TODO: Add actual social sharing functionality */}
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Facebook
              </button>
              <button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                Twitter
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts / Back to Blog CTA */}
      <section className="section-container bg-primary-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="heading-3">Read More</h2>
          <p className="prose-custom mb-8">
            Discover more stories and updates from our garden
          </p>
          <Link href="/blog" className="btn-primary inline-block">
            View All Posts
          </Link>
        </div>
      </section>
    </div>
  );
}

