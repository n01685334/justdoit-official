import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";
import { getUserById } from "@/lib/api/api-helpers";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const TEMP_DEFAULT_USER_ID = "68483de03d61dec429759557";
	const userData = await getUserById(TEMP_DEFAULT_USER_ID);

	return (
		<html lang="en">
			<body className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen ">
				<AuthProvider userData={userData}>{children}</AuthProvider>
			</body>
		</html>
	);
}
