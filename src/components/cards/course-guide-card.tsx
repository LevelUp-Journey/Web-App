"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useDictionary } from "@/hooks/use-dictionary";

export interface CourseGuideFullResponse {
    id: string;
    title: string;
    totalLikes: number;
    cover: string;
    createdAt: string;
    position: number;
}

export default function CourseGuideCard({
    guide,
}: {
    guide: CourseGuideFullResponse;
}) {
    const dict = useDictionary();
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    {/* Cover Image */}
                    <div className="shrink-0">
                        <Image
                            src={
                                guide.cover || "https://via.placeholder.com/150"
                            }
                            alt={guide.title}
                            className="w-32 h-32 object-cover rounded-md"
                            width={150}
                            height={150}
                            layout="responsive"
                        />
                    </div>

                    {/* Content */}
                    <div className="grow">
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {guide.title}
                            </h3>

                            {/* Position Badge */}
                            <Badge variant="secondary" className="shrink-0">
                                #{guide.position}
                            </Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                            {dict?.challenges?.cards?.createdOn || "Created on"}{" "}
                            {formatDate(guide.createdAt)}
                        </p>

                        {/* Likes */}
                        <div className="flex items-center gap-2 text-gray-700">
                            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                            <span className="text-sm font-medium">
                                {guide.totalLikes}{" "}
                                {guide.totalLikes === 1
                                    ? dict?.challenges?.cards?.like || "like"
                                    : dict?.challenges?.cards?.likes || "likes"}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
