import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		<html lang="en">
			<body className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen ">
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}
