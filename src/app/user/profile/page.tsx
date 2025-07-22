"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/app/ui/auth/form-elements";
import UserAvatar from "@/components/UserAvatar";
import { useAuth } from "@/contexts/AuthContext";
/**
 * User profile page with inline editing capabilities and avatar upload.
 * Handles profile updates, JWT token refresh, avatar management, and authentication state.
 * Features toggle between view and edit modes with form validation and error handling.
 */

export default function ProfilePage() {
  const { user, logout, updateUser, checkAuth } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (user && !editing) {
      setName(user.name || "");
      setBio(user.bio || "");
      fetch(`/api/users/${user._id}/avatar`)
        .then((res) => (res.ok ? res.blob() : Promise.reject(new Error("No avatar"))))
        .then((blob) => setAvatar(URL.createObjectURL(blob)))
        .catch(() => setAvatar(null));
    }
  }, [user, editing]);

  useEffect(() => {
    checkAuth?.();
  }, [checkAuth]);

  const handleSave = async () => {
    if (!user?._id || !updateUser) return;
    try {
      console.log("Saving to API:", { name, bio });
      const response = await updateUser({ name, bio });
      // Fetch updated user data and new token from API
      const updateResponse = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio }),
      });
      if (updateResponse.ok) {
        const updatedData = await updateResponse.json();
        setName(updatedData.data.name || "");
        setBio(updatedData.data.bio || "");
        // Update the JWT token in the cookie client-side
        if (updatedData.token) {
          document.cookie = `token=${updatedData.token}; path=/; secure; samesite=strict`;
        }
      }
      router.refresh(); // Refresh to use the updated token
      setEditing(false);
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Unable to save changes");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?._id) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch(`/api/users/${user._id}/avatar`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const avatarRes = await fetch(`/api/users/${user._id}/avatar`);
      if (avatarRes.ok) {
        const blob = await avatarRes.blob();
        setAvatar(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
      alert("Unable to upload avatar");
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        My Profile
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6">
        <UserAvatar user={user} size={96} />
        {!editing ? (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">{user.name}</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">{user.email}</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">{user.role}</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bio
              </label>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                {user.bio || "No bio provided"}
              </p>
            </div>
            <div className="mt-6 flex space-x-4">
              <Button type="button" label="Edit Profile" onClick={() => setEditing(true)} />
              <Button type="button" label="Logout" onClick={logout} />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio || user.bio || ""}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="avatar-upload"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Upload Avatar
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="mt-1"
              />
            </div>
            <div className="mt-6 flex space-x-4">
              <Button type="button" label="Save" onClick={handleSave} />
              <Button type="button" label="Cancel" onClick={() => setEditing(false)} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}