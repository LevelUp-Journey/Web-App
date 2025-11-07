"use client";
import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { CONSTS } from "@/lib/consts";

export default function UniversityAnnouncements() {
    return (
        <Carousel
            opts={{ loop: true }}
            plugins={[Autoplay({ delay: CONSTS.DASHBOARD_CAROUSEL_SPEED })]}
            className="w-full"
        >
            <CarouselContent>
                <CarouselItem>
                    <div className="flex items-center justify-center h-40 bg-gradient-to-r from-red-500 to-pink-900 rounded-lg">
                        <h2 className="text-3xl font-bold text-white">
                            UPC Announcement
                        </h2>
                    </div>
                </CarouselItem>
                <CarouselItem>
                    <div className="flex items-center justify-center h-40 bg-gradient-to-r from-red-500 to-pink-900 rounded-lg">
                        <h2 className="text-3xl font-bold text-white">
                            UPC Announcement
                        </h2>
                    </div>
                </CarouselItem>
                <CarouselItem>
                    <div className="flex items-center justify-center h-40 bg-gradient-to-r from-red-500 to-pink-900 rounded-lg">
                        <h2 className="text-3xl font-bold text-white">
                            UPC Announcement
                        </h2>
                    </div>
                </CarouselItem>
                <CarouselItem>
                    <div className="flex items-center justify-center h-40 bg-gradient-to-r from-red-500 to-pink-900 rounded-lg">
                        <h2 className="text-3xl font-bold text-white">
                            UPC Announcement
                        </h2>
                    </div>
                </CarouselItem>
                {/* Add more items if needed */}
            </CarouselContent>
        </Carousel>
    );
}
