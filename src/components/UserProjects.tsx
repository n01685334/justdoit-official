"use client";
import CreateProjectModal from "@/components/CreateProjectModal";
import { ProjectResponse } from "@/types/api";
import Link from "next/link";
import { useState } from "react";

interface ProjectsListProps {
    projects: ProjectResponse[];
    ownerId?: string;
    refreshProjects?: () => void;
}

const ProjectsList = ({ projects, ownerId = "", refreshProjects }: ProjectsListProps) => {
    const [isCreateProjectModalOpen, setCreateProjectModalOpen] = useState(false);

    const onCloseModal = () => {
        setCreateProjectModalOpen(false);
    }

    const onOpenModal = () => {
        setCreateProjectModalOpen(true);
    }

    return (
        <>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects?.map((p) => (
                    <li key={p._id} className="border rounded-md border-gray-200 dark:border-gray-700 py-2 px-4 mb-2 hover:border-gray-300 transition-colors">
                        <Link href={`/project/${p.slug}`} className="block py-2 w-full h-full">{p.name}</Link>
                    </li>
                ))}
                {ownerId &&
                    <li className="border-2 border-dashed rounded-md border-gray-300 dark:border-gray-600 py-2 px-4 mb-2 flex items-center justify-center hover:border-gray-300 transition-colors">
                        <button onClick={onOpenModal} className="block w-full h-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <span className="text-2xl">+</span>
                        </button>
                    </li>}

            </ul>
            {isCreateProjectModalOpen && refreshProjects && <CreateProjectModal onClose={onCloseModal} ownerId={ownerId} refreshProjects={refreshProjects} />}

        </>
    )
}

export default ProjectsList;

