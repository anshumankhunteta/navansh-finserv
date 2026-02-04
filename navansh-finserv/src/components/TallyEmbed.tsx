interface TallyEmbedProps {
    tallyUrl?: string;
}

export function TallyEmbed({
    tallyUrl = "https://tally.so/embed/w7Xk1q?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
}: TallyEmbedProps) {
    return (
        <div className="w-full min-h-[500px]">
            <iframe
                src={tallyUrl}
                width="100%"
                height="500"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="Contact Form"
                loading="lazy"
                style={{
                    border: "none",
                    overflow: "hidden",
                }}
                className="w-full"
            />
        </div>
    );
}
