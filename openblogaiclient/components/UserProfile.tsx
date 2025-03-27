"use client";

import { useSession } from "next-auth/react";

export default function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Please log in.</p>;

  if (status === "authenticated" && session?.user) {
    return (
      <div>
        <p>User ID: {session.user.id}</p>
        <p>Name: {session.user.name || "Not provided"}</p>
        <p>Email: {session.user.email}</p>
        <p>Is Admin: {session.user.isAdmin ? "Yes" : "No"}</p>
        <p>Is Blocked: {session.user.isBlocked ? "Yes" : "No"}</p>
        <p>Is Moderator: {session.user.isModerator ? "Yes" : "No"}</p>
        <p>Is Verified Poster: {session.user.isVerifiedPoster ? "Yes" : "No"}</p>
      </div>
    );
  }

  return null;
}