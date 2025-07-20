"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function InitializeAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, checkAuth } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);

    if (user === undefined) {
      if (checkAuth) {
        checkAuth().then((res) => {
          if (!res) {
            router.push("/auth/login");
          }
        });
      }
    }

    setLoading(false);
  }, [user, checkAuth, router]);

  return <>{!loading && children}</>;
}
