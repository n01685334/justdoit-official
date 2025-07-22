"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, FormCard, FormInputWithValues } from "@/app/ui/auth/form-elements";
import UserAvatar from "@/components/UserAvatar";
import type { UserResponse } from "@/types/api";

/**
 * User profile page with inline editing capabilities and avatar upload.
 * Handles profile updates, JWT token refresh, avatar management, and authentication state.
 * Features toggle between view and edit modes with form validation and error handling.
 */

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState<{ text: string; success: boolean; show: boolean }>({
    text: "",
    success: false,
    show: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const meRes = await fetch("/api/auth/me", { cache: "no-store" });
        if (!meRes.ok) throw new Error();
        const { _id } = (await meRes.json()) as { _id: string };

        const uRes = await fetch(`/api/users/${_id}`);
        if (!uRes.ok) throw new Error();
        const { data } = (await uRes.json()) as { data: UserResponse };

        setUser(data);
        setName(data.name);
        setBio(data.bio || "");

        try {
          const av = await fetch(`/api/users/${_id}/avatar`);
          if (av.ok) {
            const blob = await av.blob();
            setAvatarUrl(URL.createObjectURL(blob));
          }
        } catch { }
      } catch {
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const handleAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage({ ...message, show: false });

    const form = new FormData();
    form.append("avatar", file);

    try {
      const res = await fetch(`/api/users/${user._id}/avatar`, { method: "POST", body: form });
      if (!res.ok) throw new Error();

      const av2 = await fetch(`/api/users/${user._id}/avatar`);
      if (av2.ok) {
        const blob = await av2.blob();
        setAvatarUrl(URL.createObjectURL(blob));
      }

      setMessage({ text: "Avatar updated.", success: true, show: true });
    } catch {
      setMessage({ text: "Avatar upload failed.", success: false, show: true });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage({ ...message, show: false });

    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio }),
      });
      if (!res.ok) throw new Error();

      const { data, token } = (await res.json()) as { data: UserResponse; token?: string };
      setUser(data);
      setName(data.name);
      setBio(data.bio || "");
      setEditing(false);

      if (token) {
        document.cookie = `access_token=${token};path=/;secure;samesite=strict`;
      }

      setMessage({ text: "Profile saved.", success: true, show: true });
    } catch {
      setMessage({ text: "Save failed.", success: false, show: true });
    } finally {
      setSaving(false);
    }
  };

  // logout
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "GET" });
    router.push("/auth/login");
  };

  if (loading) {
    return <div className="py-20 text-center text-gray-500">Loading…</div>;
  }
  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-6">My Profile</h1>

      {!editing ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-4">
            <UserAvatar user={user} size={96} src={avatarUrl ?? undefined} />
            <div>
              <h2 className="text-lg font-medium">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Bio:</strong> {user.bio || "No bio"}</p>
          <div className="flex space-x-4">
            <Button label="Edit" onClick={() => setEditing(true)} />
            <Button label="Logout" onClick={handleLogout} />
          </div>
        </div>
      ) : (
        <FormCard onSubmit={handleSave}>
          {message.show && (
            <div
              className={`p-4 mb-4 text-white ${message.success ? "bg-green-600" : "bg-red-600"
                } rounded`}
            >
              {message.text}
            </div>
          )}

          <div className="flex items-center space-x-4 mb-4">
            <UserAvatar user={user} size={96} src={avatarUrl ?? undefined} />
            <div>
              <label className="block text-sm font-medium">Avatar</label>
              <input type="file" accept="image/*" onChange={handleAvatar} disabled={uploading} />
              {uploading && <p className="text-xs text-gray-500">Uploading…</p>}
            </div>
          </div>

          <FormInputWithValues
            id="name"
            name="name"
            type="text"
            label="Name"
            value={name}
            handleOnChange={(e) => setName(e.target.value)}
          />

          <div className="space-y-2 mb-4">
            <label htmlFor="bio" className="block text-sm font-medium">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="flex space-x-4">
            <Button
              label={saving ? "Saving…" : "Save"}
              onClick={() => !saving && handleSave()}
              className={saving ? "opacity-50 cursor-not-allowed" : ""}
            />
            <Button
              label="Cancel"
              onClick={() => !saving && setEditing(false)}
              className={saving ? "opacity-50 cursor-not-allowed" : ""}
            />
          </div>
        </FormCard>
      )}
    </div>
  );
}
