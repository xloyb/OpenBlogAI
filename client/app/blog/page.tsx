"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { API_BASE_URL } from "@/config/api"

export default function BlogListing() {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/blogs`)
      if (response.ok) {
        const data = await response.json()
        setBlogs(data)
      } else {
        console.error("Failed to fetch blogs")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog: never) => (
            <Link href={`/blog/${blog.id}`} key={blog.id}>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{blog.subject}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">{blog.content.substring(0, 100)}...</p>
                  <div className="mt-3 text-sm">
                    <span className="text-indigo-600 hover:text-indigo-500">Read more</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

