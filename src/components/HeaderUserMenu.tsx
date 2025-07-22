"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { UserResponse } from "@/types/api";
import { JwtUser } from "@/types/types";

interface HeaderUserMenuProps {
  user: UserResponse | JwtUser;
}

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
/**
 * User avatar dropdown menu component with navigation and logout functionality.
 * Features click-outside detection, user initials display, and authenticated user actions.
 * Handles logout API calls and navigation to user-related pages.
 */

const HeaderUserMenu = ({ user }: HeaderUserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (evt: MouseEvent) => {
      const avatarEl = avatarRef?.current;
      if (!avatarEl || !evt.target) return;

      const isInsideClick = avatarEl.contains(evt.target as Node);

      if (!isInsideClick) setIsOpen(false);
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`
    );
    if (res.ok) {
      console.log("Logged out...");
      router.push("/auth/login");
    } else {
      console.log("Failed to log out...");
    }
  };

  return (
    <div ref={avatarRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-orange-500 border-2 border-orange-600 rounded-full flex items-center justify-center text-white font-semibold hover:bg-orange-600 transition-colors"
      >
        {getInitials(user.name)}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-1">
            <Link
              href="/projects"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Projects
            </Link>
            <Link
              href="/user/profile"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderUserMenu;
