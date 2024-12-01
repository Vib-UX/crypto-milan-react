import { Bell, Calendar, Compass, Search, Star } from 'lucide-react';

import logo from '../../assets/logo.webp';
import logoImage from '../../assets/logo-image.webp';
import { Button } from '../ui/button';
import { HoverBorderGradientDemo } from '../ui/wallet-button';
import useGlobalStorage from '../../store';

export default function Navbar() {
    const { address } = useGlobalStorage();
    return (
        <nav className="flex h-14 items-center justify-between px-4 bg-zinc-900 border-b border-zinc-800">
            {/* Left section */}
            <div
                onClick={() => (window.location.href = '/')}
                className="flex items-center space-x-4 cursor-pointer"
            >
                <img
                    src={logoImage}
                    alt="logoImage"
                    className="size-8 md:size-12"
                />
                <img
                    src={logo}
                    alt="logo"
                    className="size-5 md:size-32 object-contain w-full"
                />
            </div>

            {/* Center section */}
            <div className="hidden md:block">
                <div className="flex items-center space-x-8">
                    <Button variant="ghost" className=" text-white bg-zinc-800">
                        <Calendar className="mr-2 h-4 w-4" />
                        Events
                    </Button>
                    <Button
                        variant="ghost"
                        className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                        <Compass className="mr-2 h-4 w-4" />
                        Discover
                    </Button>
                </div>
            </div>
            <div>
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden md:block text-zinc-400 hover:text-white  hover:bg-zinc-800"
                    >
                        <Search className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden md:block text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                        <Bell className="h-5 w-5" />
                    </Button>

                    {window.location.pathname !== '/' && (
                        <HoverBorderGradientDemo title={address} />
                    )}
                </div>
            </div>
        </nav>
    );
}
