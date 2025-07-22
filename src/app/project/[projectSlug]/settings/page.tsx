"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import FormInput, { Button, FormInputWithValues } from "@/app/ui/auth/form-elements";
import UserAvatar from "@/components/UserAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { ProjectProvider, useProject } from "@/contexts/ProjectContext";
import DeleteProjectModal from "@/components/DeleteProjectModal";

type Member = {
    role: string;
    user: { _id: string; name: string; avatar?: string };
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

/**
 * Project settings page with role-based editing capabilities for project details and member management.
 * Handles inline editing of project name/description, member role updates, invitations, and removals.
 * Features admin-only controls with read-only view for regular members.
 */

export default function ProjectSettingsPage() {
    const { projectSlug } = useParams();
    const { user } = useAuth();
    const [initialProject, setInitialProject] = useState<RawResponse["data"] | null>(null);
    const [loading, setLoading] = useState(true);
    console.log("USER: ", user);
    useEffect(() => {
        fetch(`/api/projects/${projectSlug}`)
            .then((r) => r.json())
            .then((json: RawResponse) => setInitialProject(json.data))
            .catch(() => alert("Failed to load project"))
            .finally(() => setLoading(false));
    }, [projectSlug]);

    if (loading || !initialProject) return <p>Loading…</p>;

    return (
        <ProjectProvider initialProject={initialProject} user={user}>
            <SettingsContent />
        </ProjectProvider>
    );
}

function SettingsContent() {
    const { user } = useAuth();
    const { project, updateProject, inviteMember } = useProject();

    const [editingName, setEditingName] = useState(false);
    const [name, setName] = useState(project.name);
    const [editingDescription, setEditingDescription] = useState(false);
    const [description, setDescription] = useState(project.description || "");
    const [inviteEmail, setInviteEmail] = useState("");
    const [editingRoleFor, setEditingRoleFor] = useState<string | null>(null);
    const [newRole, setNewRole] = useState<string>("");
    console.log("project: ", project);
    console.log("project: ", project);
    const membership = project?.members.find((m) => m.user._id === user?._id);
    const isAdmin = membership?.role === "admin";
    if (!project) return null;
    const handleNameSave = () => {
        updateProject({ name }).then(() => setEditingName(false));
    };

    const handleDescriptionSave = () => {
        updateProject({ description }).then(() => setEditingDescription(false));
    };

    const handleInvite = () => {
        // console.log("email: ", inviteEmail);
        inviteMember({ email: inviteEmail }).then(() => setInviteEmail(""));
    };

    const handleEditRole = (memberId: string, currentRole: string) => {
        setEditingRoleFor(memberId);
        setNewRole(currentRole);
    };

    const updateMemberRole = async (memberId: string, role: string) => {
        try {
            const res = await fetch(`/api/projects/${project.slug}/members/${memberId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
            });
            if (!res.ok) throw new Error("Update failed");
            const data = await res.json();
            project.members = data.data;
        } catch (err) {
            console.error(err);
            alert("Unable to update role");
        }
        setEditingRoleFor(null);
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!confirm("Are you sure you want to remove this member?")) return;
        try {
            const res = await fetch(`/api/projects/${project.slug}/members/${memberId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Remove failed");
            const data = await res.json();
            project.members = data.data;
        } catch (err) {
            console.error(err);
            alert("Unable to remove member");
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 space-y-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Project Settings
            </h1>

            {/* Name Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
                        Name
                    </span>
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
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleNameSave();
                        }}
                        className="mt-4 flex items-center space-x-4"
                    >
                        <div className="flex-1 max-w-sm">
                            <input
                                id="project-name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex space-x-2">
                            <Button type="submit" label="Save" />
                            <Button
                                type="button"
                                label="Cancel"
                                onClick={() => setEditingName(false)}
                            />
                        </div>
                    </form>
                )}
            </div>

            {/* Description Section */}
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
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleDescriptionSave();
                        }}
                        className="mt-4 space-y-4"
                    >
                        <div>
                            <label
                                htmlFor="project-description"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Description
                            </label>
                            <textarea
                                id="project-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                rows={3}
                            />
                        </div>
                        <div className="flex space-x-2">
                            <Button type="submit" label="Save" />
                            <Button
                                type="button"
                                label="Cancel"
                                onClick={() => setEditingDescription(false)}
                            />
                        </div>
                    </form>
                )}
            </div>

            {/* Members Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
                        Members
                    </span>
                    {!isAdmin && <span className="text-sm text-gray-500">Read-only</span>}
                </div>
                <div className="space-y-2">
                    {project.members.map(({ user: mUser, role }) => (
                        <div
                            key={mUser._id}
                            className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex items-center space-x-3">
                                <UserAvatar user={mUser} size={32} />
                                <span className="text-gray-900 dark:text-gray-100">{mUser.name}</span>
                            </div>
                            {editingRoleFor === mUser._id ? (
                                <div className="flex items-center space-x-2">
                                    <select
                                        value={newRole}
                                        onChange={(e) => setNewRole(e.target.value)}
                                        className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="member">Member</option>
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
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
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
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {isAdmin && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleInvite();
                        }}
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
                        <Button
                            type="submit"
                            label="Invite"
                            className="cursor-pointer w-full flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        />
                    </form>
                )}
            </div>

            <div className="mt-6 flex items-center space-x-4">
                <DeleteProjectModal projectSlug={project.slug} />
            </div>
        </div>
    );
}