"use client";

import { useState, useEffect } from "react";
import { Rider } from "@/types/rider/type";
import RiderLogin from "../../components/feature/rider/RiderLogin";
import { redirect } from "next/navigation";

interface LoggedInRider {
	rider: Rider;
	userName: string;
}

export default function RiderPage() {
	const [loggedInRider, setLoggedInRider] = useState<LoggedInRider | null>(
		null
	);

	// Load logged in rider from localStorage on component mount
	useEffect(() => {
		const savedRider = localStorage.getItem("loggedInRider");
		if (savedRider) {
			try {
				setLoggedInRider(JSON.parse(savedRider));
			} catch (error) {
				console.error("Failed to parse saved rider data:", error);
				localStorage.removeItem("loggedInRider");
			}
		}
	}, []);

	const handleLogin = (rider: Rider, userName: string) => {
		const riderData = { rider, userName };
		setLoggedInRider(riderData);
		localStorage.setItem("loggedInRider", JSON.stringify(riderData));
	};

	// Show login page if no rider is logged in
	if (!loggedInRider) {
		return <RiderLogin onLogin={handleLogin} />;
	} else {
		redirect(`/rider/${loggedInRider.rider.id}`);
	}
}
