import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./ReduxProvider";
import Navbar from "@/components/common/Navbar";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Warehouse Delivery Optimization",
	description: "Warehouse Delivery Optimization System for managing inventory, dispatching deliveries, and tracking items",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<ReduxProvider>
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
				>
					<Navbar />
					<main className="min-h-screen">
						{children}
					</main>
				</body>
			</ReduxProvider>
		</html>
	);
}
