"use client";

import { useSession } from "next-auth/react";
import LogoutButton from "./LogoutButton";

export default function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Please log in.</p>;

  if (status === "authenticated" && session?.user) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-start">
            <h2 className="card-title">User Profile</h2>
            <LogoutButton variant="icon" showText={false} />
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">Name:</span>
                <p className="text-sm">{session.user.name || "Not provided"}</p>
              </div>
              <div>
                <span className="font-semibold">Email:</span>
                <p className="text-sm">{session.user.email}</p>
              </div>
            </div>

            <div className="divider"></div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Admin:</span>
                <div className={`badge ${session.user.isAdmin ? 'badge-success' : 'badge-ghost'}`}>
                  {session.user.isAdmin ? "Yes" : "No"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Moderator:</span>
                <div className={`badge ${session.user.isModerator ? 'badge-info' : 'badge-ghost'}`}>
                  {session.user.isModerator ? "Yes" : "No"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Verified:</span>
                <div className={`badge ${session.user.isVerifiedPoster ? 'badge-primary' : 'badge-ghost'}`}>
                  {session.user.isVerifiedPoster ? "Yes" : "No"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Status:</span>
                <div className={`badge ${session.user.isBlocked ? 'badge-error' : 'badge-success'}`}>
                  {session.user.isBlocked ? "Blocked" : "Active"}
                </div>
              </div>
            </div>
          </div>

          <div className="card-actions justify-end mt-4">
            <LogoutButton variant="button" className="btn-sm" />
          </div>
        </div>
      </div>
    );
  }

  return null;
}