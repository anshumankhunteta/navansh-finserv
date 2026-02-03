import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href?: string;
}

export function ServiceCard({ title, description, icon: Icon, href }: ServiceCardProps) {
    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow border-t-4 border-t-primary">
            <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
                <CardDescription className="text-muted-foreground mb-6 text-base">
                    {description}
                </CardDescription>
                {href && (
                    <Button asChild variant="outline" className="w-full mt-auto border-secondary text-secondary-foreground hover:bg-secondary hover:text-white">
                        <Link href={href}>Learn More</Link>
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
