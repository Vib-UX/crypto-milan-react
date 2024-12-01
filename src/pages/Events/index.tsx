import { MapPin, Video } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/cards';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useNavigate } from 'react-router-dom';

interface Host {
    name: string;
    avatar: string;
}

interface Event {
    slug: string;
    date: string;
    dayOfWeek: string;
    time: string;
    title: string;
    isLive?: boolean;
    hosts: Host[];
    location?: string;
    platform?: string;
    status?: string;
    thumbnail: string;
}

export const events: Event[] = [
    {
        slug: 'unflod-web3-2024',
        date: 'Dec 1',
        dayOfWeek: 'Sunday',
        time: '20:00 PM',
        title: 'Unfold web3',
        isLive: true,
        hosts: [{ name: 'Coindcx', avatar: '/placeholder.svg' }],
        platform: 'Zoom',
        thumbnail:
            'https://unfoldweb3.com/_next/image?url=%2Fimages%2Fbanner-hero-2024-2.png&w=1920&q=75',
    },
    {
        slug: 'builders-house-at-ibw',
        date: 'Dec 3',
        dayOfWeek: 'Tuesday',
        time: '10:00 AM',
        title: 'Builders House at IBW',
        hosts: [
            { name: 'Sanket', avatar: '/placeholder.svg' },
            { name: 'QuillAI Network', avatar: '/placeholder.svg' },
            { name: 'Parth', avatar: '/placeholder.svg' },
        ],
        location: '87, 11th Cross Rd, near Vintage Haven',
        status: 'Pending',
        thumbnail:
            'https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,background=white,quality=75,width=400,height=400/event-covers/7p/54abbeb5-85a9-4e1a-ba51-21b1fd576a2d',
    },
];

export default function EventsListing() {
    const navigate = useNavigate();

    const handleCheckoutEvent = (eventId: string) => {
        navigate(`/events/${eventId}`);
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-0">
                        Events
                    </h1>
                    <div className="bg-zinc-800 rounded-lg p-1 w-full sm:w-auto">
                        <Button
                            variant="ghost"
                            className="bg-zinc-700 text-white rounded-md w-1/2 sm:w-auto"
                        >
                            Upcoming
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-zinc-400 w-1/2 sm:w-auto"
                        >
                            Past
                        </Button>
                    </div>
                </div>
                <div className="space-y-6 sm:space-y-8">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className="flex flex-col sm:flex-row gap-4 sm:gap-8"
                        >
                            {/* Date Column */}
                            <div className="flex sm:flex-col items-center sm:items-start sm:w-24">
                                <div className="text-lg font-medium mr-2 sm:mr-0">
                                    {event.date}
                                </div>
                                <div className="text-sm text-zinc-400">
                                    {event.dayOfWeek}
                                </div>
                            </div>
                            <div className="relative hidden sm:block">
                                <div className="absolute top-3 w-3 h-3 rounded-full bg-zinc-700" />
                                <div
                                    className="absolute top-3 left-1.5 bottom-0 w-px bg-zinc-800"
                                    style={{ height: 'calc(100% + 2rem)' }}
                                />
                            </div>
                            <Card className="flex-1 bg-zinc-900/50 border-zinc-800">
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                        <div className="flex-1">
                                            {/* Time and Status */}
                                            <div className="flex items-center gap-2 mb-2">
                                                {event.isLive && (
                                                    <span className="text-orange-500 text-sm font-medium">
                                                        LIVE
                                                    </span>
                                                )}
                                                <span className="text-zinc-400">
                                                    {event.time}
                                                </span>
                                            </div>
                                            <h3 className="text-lg sm:text-xl font-medium mb-3 sm:mb-4 text-white">
                                                {event.title}
                                            </h3>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-zinc-400 text-sm">
                                                    By
                                                </span>
                                                <div className="flex -space-x-2">
                                                    {event.hosts.map(
                                                        (host, i) => (
                                                            <Avatar
                                                                key={i}
                                                                className="border-2 border-zinc-900 w-6 h-6"
                                                            >
                                                                <AvatarImage
                                                                    src={
                                                                        host.avatar
                                                                    }
                                                                />
                                                                <AvatarFallback>
                                                                    {
                                                                        host
                                                                            .name[0]
                                                                    }
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        )
                                                    )}
                                                </div>
                                                <span className="text-zinc-400 text-sm">
                                                    {event.hosts
                                                        .map((h) => h.name)
                                                        .join(', ')}
                                                </span>
                                            </div>
                                            {event.location && (
                                                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                                    <MapPin className="w-4 h-4" />
                                                    {event.location}
                                                </div>
                                            )}
                                            {event.platform && (
                                                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                                    <Video className="w-4 h-4" />
                                                    {event.platform}
                                                </div>
                                            )}
                                            <div className="mt-4">
                                                {event.status ? (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-500/10 text-orange-500">
                                                        {event.status}
                                                    </span>
                                                ) : (
                                                    <Button
                                                        className="w-full sm:w-auto text-white border-zinc-700 hover:bg-zinc-800"
                                                        onClick={() =>
                                                            handleCheckoutEvent(
                                                                event.slug
                                                            )
                                                        }
                                                    >
                                                        Checkout event
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-full sm:w-32 h-32 sm:h-32">
                                            <img
                                                src={event.thumbnail}
                                                alt={event.title}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
