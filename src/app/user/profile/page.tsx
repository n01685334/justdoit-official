"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

import { useRouter } from "next/navigation";
import FormInput, { Button } from "@/app/ui/auth/form-elements";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/users/${user?._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Update failed");
      router.refresh();
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Unable to save changes");
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        My Profile
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        {!editing ? (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </label>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                {name}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                {user.email}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                {user.role}
              </p>
            </div>
            <div className="mt-6 flex space-x-4">
              <Button
                type="submit"
                label="Edit Name"
                onClick={() => setEditing(true)}
              />
              <Button type="button" label="Logout" onClick={logout} />
            </div>
          </>
        ) : (
          <>
            <FormInput
              id="name"
              name="name"
              type="text"
              label="Name"
              value={name}
            />
            <div className="mt-6 flex space-x-4">
              <Button type="submit" label="Save" onClick={handleSave} />
              <Button
                type="button"
                label="Cancel"
                onClick={() => setEditing(false)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
