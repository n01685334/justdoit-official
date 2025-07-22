"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import { Button, FormInputWithValues } from "@/app/ui/auth/form-elements";
import UserAvatar from "@/components/UserAvatar";
import DeleteProjectModal from "@/components/DeleteProjectModal";
import { useAuth } from "@/contexts/AuthContext";
import { ProjectProvider, useProject } from "@/contexts/ProjectContext";
import type { UserResponse } from "@/types/api";

type Member = {
  role: string;
  user: { _id: string; name: string; avatar?: string; email?: string };
};

type RawResponse = {
  data: {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    members: Member[];
  };
};

export default function ProjectSettingsPage() {
  const { projectSlug } = useParams();
  const { user } = useAuth();
  const [initialProject, setInitialProject] = useState<RawResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${projectSlug}`)
      .then((r) => r.json())
      .then((json: RawResponse) => setInitialProject(json.data))
      .catch(() => alert("Failed to load project"))
      .finally(() => setLoading(false));
  }, [projectSlug]);

  if (loading || !initialProject) return <p>Loading…</p>;

  return (
    <ProjectProvider initialProject={initialProject} user={user as UserResponse}>
      <SettingsContent />
    </ProjectProvider>
  );
}

function SettingsContent() {
  const { user: authUser } = useAuth();
  const { project, updateProject, inviteMember } = useProject();

  // alert banner
  const [message, setMessage] = useState<{ text: string; success: boolean; show: boolean }>({
    text: "",
    success: false,
    show: false,
  });

  // name / description edit
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(project.name);
  const [editingDescription, setEditingDescription] = useState(false);
  const [description, setDescription] = useState(project.description || "");

  // invite
  const [inviteEmail, setInviteEmail] = useState("");

  // role edit
  const [editingRoleFor, setEditingRoleFor] = useState<string | null>(null);
  const [newRole, setNewRole] = useState("");

  const isAdmin =
    project.members.find((m) => m.user._id === authUser?._id)?.role === "admin";

  // --- handlers

  const handleNameSave = (e: FormEvent) => {
    e.preventDefault();
    updateProject({ name })
      .then(() => {
        setEditingName(false);
        setMessage({ text: "Project name updated", success: true, show: true });
      })
      .catch(() => setMessage({ text: "Failed to update name", success: false, show: true }));
  };

  const handleDescriptionSave = (e: FormEvent) => {
    e.preventDefault();
    updateProject({ description })
      .then(() => {
        setEditingDescription(false);
        setMessage({ text: "Description updated", success: true, show: true });
      })
      .catch(() =>
        setMessage({ text: "Failed to update description", success: false, show: true })
      );
  };

  const handleInvite = (e: FormEvent) => {
    e.preventDefault();
    setMessage({ ...message, show: false });

    if (!inviteEmail.trim()) {
      setMessage({ text: "Email is required", success: false, show: true });
      return;
    }
    if (project.members.some((m) => m.user.email === inviteEmail)) {
      setMessage({ text: "User already in project", success: false, show: true });
      return;
    }

    inviteMember({ email: inviteEmail })
      .then(() => {
        setInviteEmail("");
        setMessage({ text: "Invitation sent", success: true, show: true });
      })
      .catch((err) =>
        setMessage({ text: err?.message || "Failed to send invite", success: false, show: true })
      );
  };

  const handleEditRole = (memberId: string, currentRole: string) => {
    setEditingRoleFor(memberId);
    setNewRole(currentRole);
  };

  const updateMemberRole = async (memberId: string, role: string) => {
    setMessage({ ...message, show: false });
    try {
      const res = await fetch(`/api/projects/${project.slug}/members/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Update failed");
      // replace members with server response
      project.members = json.data;
      setMessage({ text: "Role updated", success: true, show: true });
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to update role", success: false, show: true });
    }
    setEditingRoleFor(null);
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    setMessage({ ...message, show: false });
    try {
      const res = await fetch(`/api/projects/${project.slug}/members/${memberId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Remove failed");
      project.members = json.data;
      setMessage({ text: "Member removed", success: true, show: true });
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to remove member", success: false, show: true });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Project Settings
      </h1>

      {message.show && (
        <div
          className={`p-4 text-white ${message.success ? "bg-green-600" : "bg-red-600"
            } rounded`}
        >
          {message.text}
        </div>
      )}

      {/* Name */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-gray-700 dark:text-gray-200">Name</span>
          {isAdmin && (
            <button
              type="button"
              className="text-sm text-blue-500 hover:underline"
              onClick={() => setEditingName(true)}
            >
              Edit
            </button>
          )}
        </div>
        {!editingName ? (
          <p className="text-gray-900 dark:text-gray-100">{project.name}</p>
        ) : (
          <form onSubmit={handleNameSave} className="mt-4 flex items-center space-x-4">
            <div className="flex-1 max-w-sm">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" label="Save" />
              <Button type="button" label="Cancel" onClick={() => setEditingName(false)} />
            </div>
          </form>
        )}
      </div>

      {/* Description */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
            Description
          </span>
          {isAdmin && (
            <button
              type="button"
              className="text-sm text-blue-500 hover:underline"
              onClick={() => setEditingDescription(true)}
            >
              Edit
            </button>
          )}
        </div>
        {!editingDescription ? (
          <p className="text-gray-900 dark:text-gray-100">
            {project.description || "No description"}
          </p>
        ) : (
          <form onSubmit={handleDescriptionSave} className="mt-4 space-y-4">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="flex space-x-2">
              <Button type="submit" label="Save" />
              <Button type="button" label="Cancel" onClick={() => setEditingDescription(false)} />
            </div>
          </form>
        )}
      </div>

      {/* Members */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
            Members
          </span>
          {!isAdmin && <span className="text-sm text-gray-500">Read-only</span>}
        </div>

        {project.members.map(({ user: mUser, role }) => (
          <div
            key={mUser._id}
            className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              <UserAvatar user={mUser as UserResponse} size={32} />
              <span className="text-gray-900 dark:text-gray-100">{mUser.name}</span>
            </div>
            <div className="flex items-center space-x-4">
              {editingRoleFor === mUser._id ? (
                <>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="rounded border px-2 py-1 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="admin">admin</option>
                    <option value="member">member</option>
                  </select>
                  <Button
                    type="button"
                    label="Save"
                    onClick={() => updateMemberRole(mUser._id, newRole)}
                  />
                  <Button
                    type="button"
                    label="Cancel"
                    onClick={() => setEditingRoleFor(null)}
                  />
                </>
              ) : (
                <>
                  <span className="text-sm text-gray-500">{role}</span>
                  {isAdmin && (
                    <>
                      <button
                        type="button"
                        className="text-sm text-blue-500 hover:underline"
                        onClick={() => handleEditRole(mUser._id, role)}
                      >
                        Edit Role
                      </button>
                      <button
                        type="button"
                        className="text-sm text-red-500 hover:underline"
                        onClick={() => handleRemoveMember(mUser._id)}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        {isAdmin && (
          <form
            onSubmit={handleInvite}
            className="mt-4 flex flex-row items-center justify-center space-x-4"
          >
            <div className="flex-4">
              <FormInputWithValues
                id="invite-email"
                name="inviteEmail"
                type="email"
                label=""
                placeholder="user@example.com"
                value={inviteEmail}
                handleOnChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <Button className="cursor-pointer py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700" type="submit" label="Invite" />
          </form>
        )}
      </div>

      <div className="mt-6">
        <DeleteProjectModal projectSlug={project.slug} />
      </div>
    </div>
  );
}
