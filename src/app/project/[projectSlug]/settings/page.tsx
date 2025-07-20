"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import FormInput, {
  Button,
  FormInputWithValues,
} from "@/app/ui/auth/form-elements";
import { ProjectProvider, useProject } from "@/contexts/ProjectContext";

type Member = {
  role: string;
  user: { _id: string; name: string };
};

type RawResponse = {
  data: {
    _id: string;
    name: string;
    slug: string;
    members: Member[];
  };
};

export default function ProjectSettingsPage() {
  const { projectSlug } = useParams();
  const { user } = useAuth();
  const [initialProject, setInitialProject] = useState<
    RawResponse["data"] | null
  >(null);
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
  const [inviteEmail, setInviteEmail] = useState("");

  // look up your membership role in this project
  const membership = project.members.find((m) => m.user._id === user?._id);
  const isAdmin = membership?.role === "admin";

  const handleNameSave = () => {
    updateProject({ name }).then(() => setEditingName(false));
  };

  const handleInvite = () => {
    inviteMember({ email: inviteEmail }).then(() => setInviteEmail(""));
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Project Settings
      </h1>

      {/* — Name Section — */}
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
              <FormInputWithValues
                id="project-name"
                name="projectName"
                type="text"
                label=""
                value={name}
                handleOnChange={(e) => setName(e.target.value)}
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

      {/* — Members Section — */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
            Members
          </span>
          {!isAdmin && <span className="text-sm text-gray-500">Read-only</span>}
        </div>

        {/* list */}
        <div className="space-y-2">
          {project.members.map(({ user: mUser, role }) => (
            <div
              key={mUser._id}
              className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-700"
            >
              <span className="text-gray-900 dark:text-gray-100">
                {mUser.name}
              </span>
              <span className="text-sm text-gray-500">{role}</span>
            </div>
          ))}
        </div>

        {/* invite form */}
        {isAdmin && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleInvite();
              console.log(inviteEmail);
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
    </div>
  );
}
