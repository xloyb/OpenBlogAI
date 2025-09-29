
"use strict";
import { auth } from '@/auth/auth';
import UserProfile from '@/components/UserProfile';
import Markdown from 'react-markdown';

export default async function BlogsPage() {
  const session = await auth();

  if (!session?.user) {
    return <div>Please log in to view blogs.</div>;
  }

  return (
    <div>
      <h1>Blogs</h1>
      <Markdown> **test**</Markdown>
      <UserProfile />
    </div>
  );
}