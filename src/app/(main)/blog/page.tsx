import { Suspense } from "react"
import { BlogsList } from "@/components/main/blog/blogs-list"
import { prisma } from "@/lib/prisma"

interface BlogPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

async function getCategories() {
  return prisma.blogCategory.findMany({
    orderBy: {
      name: "asc",
    },
  })
}

async function getBlogs(searchParams: BlogPageProps["searchParams"]) {
  try {
    // Await the entire searchParams object first
    const params = await searchParams;
    
    const page = Number(params.page) || 1;
    const perPage = 3;
    const skip = (page - 1) * perPage;

    const where = {
      isPublished: true,
      ...(params.category
        ? { categoryId: params.category.toString() }
        : {}),
    };

    const [blogs, categories, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: {
          category: true,
        },
        skip,
        take: perPage,
        orderBy: (() => {
          const sort = params.sort?.toString() || "latest";
          switch (sort) {
            case "title-asc":
              return { title: "asc" };
            case "title-desc":
              return { title: "desc" };
            case "oldest":
              return { createdAt: "asc" };
            default:
              return { createdAt: "desc" };
          }
        })(),
      }),
      prisma.blogCategory.findMany({
        where: {
          blogs: {
            some: {
              isPublished: true,
            },
          },
        },
      }),
      prisma.blog.count({ where }),
    ])

    const totalPages = Math.ceil(total / perPage)

    return {
      blogs,
      categories,
      totalPages,
    }
  } catch (error) {
    console.error("Error fetching blogs:", error)
    throw new Error("Failed to fetch blogs")
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // Await searchParams before passing it to getBlogs
  const params = await searchParams;
  
  const [blogs, categories] = await Promise.all([
    getBlogs(params),
    getCategories(),
  ])

  return (
    <section className="w-full inset-0 dark:bg-gradient-to-r from-transparent via-purple-950/60 to-purple-950/70">
      <div className="container-center space-y-8 py-8 mt-20">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground">
            Stay updated with our latest articles, news, and insights.
          </p>
        </div>
        <Suspense fallback={<div>Loading blog posts...</div>}>
          <BlogsList
            blogs={blogs.blogs}
            categories={categories}
            totalPages={blogs.totalPages}
            searchParams={params}
          />
        </Suspense>
      </div>
    </section>
  )
}