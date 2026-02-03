"use client";

import React, { useEffect } from "react";

interface TallyEmbedProps {
    url: string;
    title?: string;
}

export function TallyEmbed({ url, title = "Contact Form" }: TallyEmbedProps) {
    useEffect(() => {
        // Tally script for auto-resizing if needed
        // <script async src="https://tally.so/widgets/embed.js"></script>
        const script = document.createElement("script");
        script.src = "https://tally.so/widgets/embed.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="w-full h-full min-h-[500px]">
            <iframe
                data-tally-src={url}
                width="100%"
                height="100%"
                className="w-full h-full border-none"
                title={title}
                loading="lazy"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
            ></iframe>
        </div>
    );
}
