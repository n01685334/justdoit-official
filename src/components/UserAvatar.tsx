"use client";

import { useEffect, useState } from "react";
import { UserResponse } from "@/types/api";

interface UserAvatarProps {
    user: UserResponse;
    size?: number; // Size in pixels
    className?: string;
}

export const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export default function UserAvatar({ user, size = 40, className = "" }: UserAvatarProps) {
    const [avatar, setAvatar] = useState<string | null>(null);

    useEffect(() => {
        if (user?._id) {
            fetch(`/api/users/${user._id}/avatar`)
                .then((res) => {
                    if (res.ok) return res.blob();
                    throw new Error("No avatar");
                })
                .then((blob) => {
                    const url = URL.createObjectURL(blob);
                    setAvatar(url);
                })
                .catch(() => setAvatar(null));
        }
    }, [user]);

    if (avatar) {
        return (
            <img
                src={avatar}
                alt={`${user.name}'s avatar`}
                className={`rounded-full ${className}`}
                style={{ width: size, height: size }}
            />
        );
    }

    return (
        <div
            className={`bg-orange-500 border-2 border-orange-600 rounded-full flex items-center justify-center text-white font-semibold ${className}`}
            style={{ width: size, height: size }}
        >
            {getInitials(user.name)}
        </div>
    );
}