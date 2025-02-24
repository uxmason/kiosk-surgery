"use client";
import "./globals.css";
import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [fingerprint, setFingerprint] = useState("");

    useEffect(() => {
        const getFingerprint = async () => {
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            setFingerprint(result.visitorId);
        };

        getFingerprint();
    }, []);

    console.log(fingerprint);

    return (
        <html lang="kr" className="isHidedScrollBar">
            <body>{children}</body>
        </html>
    );
}
