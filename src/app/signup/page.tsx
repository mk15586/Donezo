import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

export default function SignupPage() {
    return (
        <div className="w-full h-screen lg:grid lg:grid-cols-2">
             {/* Left Side - Branding (Hidden on mobile) */}
             <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-10 text-white">
                <div className="flex items-center gap-2">
                    <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                        <Image
                            src="/DonezoLogo.png"
                            alt="Donezo Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Donezo</span>
                </div>
                
                <div className="space-y-4 max-w-lg">
                    <h1 className="text-4xl font-bold leading-tight">
                        Start your journey with us.
                    </h1>
                    <p className="text-zinc-400 text-lg">
                        Create an account to start managing your projects efficiently and effectively.
                    </p>
                </div>

                <div className="text-sm text-zinc-500">
                    &copy; 2026 Donezo Inc.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
                <div className="w-full max-w-md space-y-8">
                     {/* Mobile Logo (Visible only on small screens) */}
                     <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                         <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                            <Image
                                src="/DonezoLogo.png"
                                alt="Donezo Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Donezo</span>
                    </div>

                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                             Enter your information to get started
                        </p>
                    </div>

                    <form className="mt-8 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input id="first-name" placeholder="Max" className="h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input id="last-name" placeholder="Robinson" className="h-11" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="m@example.com" 
                                className="h-11"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                             <Input 
                                id="password" 
                                type="password" 
                                className="h-11"
                            />
                        </div>

                        <Button className="w-full h-11 text-base" asChild>
                            <Link href="/dashboard">Create Account</Link>
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>

                    <div className="pt-8 text-center">
                         <Button variant="ghost" size="sm" asChild>
                            <Link href="/" className="gap-2 text-muted-foreground">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
