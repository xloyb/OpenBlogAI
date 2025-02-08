/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { API_BASE_URL } from "@/config/api"

export default function BlogDetails() {
  const [blog, setBlog] = useState<any>(null)
  const params = useParams()
  const { id } = params

  useEffect(() => {
    fetchBlog()
  }, [])

  const fetchBlog = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/blogs/${id}`)
      if (response.ok) {
        const data = await response.json()
        setBlog(data)
      } else {
        console.error("Failed to fetch blog")
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  if (!blog) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold mb-4">{blog.subject}</h1>
            <p className="text-sm text-gray-500 mb-4">Published on {new Date(blog.createdAt).toLocaleDateString()}</p>
            <div className="prose max-w-none">{blog.content}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

