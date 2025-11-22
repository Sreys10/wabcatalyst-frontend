"use client";

import { usePathname, useRouter } from "next/navigation";
import Header from "@layouts/partials/Header";
import Footer from "@layouts/partials/Footer";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function DashboardWrapper({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();
    const isDashboard = pathname?.startsWith("/dashboard");
    const isOnboarding = pathname?.startsWith("/onboarding");

    useEffect(() => {
        const checkProfile = async () => {
            if (isDashboard && status === "authenticated") {
                try {
                    const res = await fetch('/api/profile');
                    if (res.status === 404) {
                        router.push('/onboarding');
                    }
                } catch (error) {
                    console.error("Error checking profile:", error);
                }
            }
        };

        checkProfile();
    }, [isDashboard, status, router]);

    if (isDashboard || isOnboarding) {
        return children;
    }

    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}
