import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";
import { getUserById } from "@/lib/api/api-helpers";
import { getCurrentUser } from "@/lib/api/auth-helpers";
import { UserResponse } from "@/types/api";

/**
 * Root application layout providing global authentication context and styling.
 * Fetches user data on server-side, initializes auth provider with user state,
 * and applies consistent dark/light theme classes across the entire application.
 */

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userJwt = await getCurrentUser();
  console.log("userJWT: ", userJwt);
  let userData: UserResponse | undefined

  if (userJwt) {
    userData = await getUserById(userJwt?._id);
  }

  return (
    <html lang="en">
      <body className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen ">
        <AuthProvider userData={userData}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
