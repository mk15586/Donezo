"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Zap } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "About", href: "#about" },
    ];

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
        >
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                        <Image
                            src="/DonezoLogo.png"
                            alt="Donezo Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Donezo</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden gap-6 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <div className="hidden flex-col gap-2 md:flex md:flex-row md:items-center">
                    <Button variant="ghost" asChild>
                        <Link href="/login">Log in</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/signup">Sign up</Link>
                    </Button>
                </div>

                {/* Mobile Navigation Toggle */}
                <button
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute top-16 left-0 w-full overflow-hidden bg-background border-b md:hidden shadow-xl z-50"
            >
                <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-lg font-medium py-2 border-b border-border/50 last:border-0"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex flex-col gap-3 mt-2">
                        <Button variant="outline" className="w-full justify-center" asChild onClick={() => setIsOpen(false)}>
                            <Link href="/login">Log in</Link>
                        </Button>
                        <Button className="w-full justify-center" asChild onClick={() => setIsOpen(false)}>
                            <Link href="/signup">Sign up</Link>
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.header>
    );
}
