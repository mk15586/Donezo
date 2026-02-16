import Link from "next/link";
import Image from "next/image";
import { Zap, Twitter, Github, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t py-12 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
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
                        <p className="text-sm text-muted-foreground">
                            Plan, prioritize, and accomplish your tasks with ease.
                            The modern standard for project management.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary">Features</Link></li>
                            <li><Link href="#" className="hover:text-primary">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-primary">Integrations</Link></li>
                            <li><Link href="#" className="hover:text-primary">Changelog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary">Documentation</Link></li>
                            <li><Link href="#" className="hover:text-primary">API Reference</Link></li>
                            <li><Link href="#" className="hover:text-primary">Community</Link></li>
                            <li><Link href="#" className="hover:text-primary">Help Center</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary">About</Link></li>
                            <li><Link href="#" className="hover:text-primary">Blog</Link></li>
                            <li><Link href="#" className="hover:text-primary">Careers</Link></li>
                            <li><Link href="#" className="hover:text-primary">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Donezo Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
