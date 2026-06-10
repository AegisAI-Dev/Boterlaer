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

export async function GET() {
  try {
    const posts = readBlog();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read blog posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireAuth(request);
  if (authCheck) return authCheck;

  try {
    const post = await request.json();
    const posts = readBlog();
    
    // Generate new ID
    const newId = posts.length > 0 ? Math.max(...posts.map((p: any) => p.id)) + 1 : 1;
    post.id = newId;
    
    posts.push(post);
    writeBlog(posts);
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}

