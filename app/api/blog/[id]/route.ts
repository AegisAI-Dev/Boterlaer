import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { requireAuth } from "@/lib/middleware";

const BLOG_FILE = join(process.cwd(), "data", "blog-posts.json");

function readBlog() {
  const fileContent = readFileSync(BLOG_FILE, "utf-8");
  return JSON.parse(fileContent);
}

function writeBlog(posts: any[]) {
  writeFileSync(BLOG_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const posts = readBlog();
    const post = posts.find((p: any) => p.id === parseInt(id));

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read blog post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await requireAuth(request);
  if (authCheck) return authCheck;

  try {
    const { id } = await params;
    const updatedPost = await request.json();
    const posts = readBlog();
    const index = posts.findIndex((p: any) => p.id === parseInt(id));

    if (index === -1) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    updatedPost.id = parseInt(id);
    posts[index] = updatedPost;
    writeBlog(posts);

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authCheck = await requireAuth(request);
  if (authCheck) return authCheck;

  try {
    const { id } = await params;
    const posts = readBlog();
    const filteredPosts = posts.filter((p: any) => p.id !== parseInt(id));

    if (posts.length === filteredPosts.length) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    writeBlog(filteredPosts);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}

