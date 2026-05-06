"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [isLoading, setIsLoading] = useState(false);
    
    // Form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");

    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!firstName || !lastName || !email || !password) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        if (!/[A-Z]/.test(password)) {
            toast.error("Password must contain at least one uppercase letter.");
            return;
        }

        if (!/[0-9]/.test(password)) {
            toast.error("Password must contain at least one number.");
            return;
        }

        setIsLoading(true);
        
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || 'Failed to send verification code');
            }
            
            setStep(2);
            toast.success("Verification code sent to your email!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit code.");
            return;
        }

        setIsLoading(true);
        
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp }),
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || 'Invalid verification code');
            }
            
            // Now that the user is force-created in the backend, log them in on the client side
            const supabase = createClient();
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (signInError) {
                throw new Error("Account created, but couldn't auto-login. Please sign in manually.");
            }

            toast.success("Account verified successfully! Welcome to Donezo.");
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, password }),
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || 'Failed to resend code');
            }
            
            toast.success("A new code has been sent!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-screen lg:grid lg:grid-cols-2 overflow-hidden bg-background">
             {/* Left Side - Branding (Hidden on mobile) */}
             <div className="hidden lg:flex flex-col justify-between bg-zinc-950 p-10 text-white relative z-10 border-r border-border/50 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-zinc-950/80 -z-10" />
                
                <div className="flex items-center gap-2">
                    <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-white/10 p-1 ring-1 ring-white/20 shadow-sm">
                        <Image
                            src="/DonezoLogo.png"
                            alt="Donezo Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-zinc-100">Donezo</span>
                </div>
                
                <div className="space-y-6 max-w-lg relative">
                    <div className="inline-block px-3 py-1 bg-white/10 text-xs font-semibold tracking-wider text-zinc-300 rounded-full border border-white/10 mb-2">
                        VERSION 2.0
                    </div>
                    <h1 className="text-5xl font-bold leading-[1.1] tracking-tight">
                        Start your journey with us.
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                        Create an account to start managing your projects efficiently, tracking timelines seamlessly, and building alongside your team.
                    </p>
                </div>

                <div className="text-sm font-medium text-zinc-500 flex items-center justify-between">
                    <span>&copy; 2026 Donezo Inc.</span>
                    <span className="flex gap-4">
                        <Link href="#" className="hover:text-zinc-300 transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-zinc-300 transition-colors">Terms</Link>
                    </span>
                </div>
            </div>

            {/* Right Side - Interactive Form Area */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

                <div className="w-full max-w-[400px] relative z-10">
                     {/* Mobile Logo */}
                     <div className="lg:hidden flex flex-col items-center justify-center gap-3 mb-10">
                         <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-muted p-2 border border-border shadow-sm">
                            <Image
                                src="/DonezoLogo.png"
                                alt="Donezo Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Donezo</span>
                    </div>

                    <div className="relative h-[550px] w-full">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="absolute inset-0 flex flex-col justify-start space-y-8"
                                >
                                    <div className="text-center space-y-2">
                                        <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
                                        <p className="text-sm text-muted-foreground font-medium">
                                             Enter your information to get started
                                        </p>
                                    </div>

                                    <form onSubmit={handleSignupSubmit} className="space-y-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="first-name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">First name</Label>
                                                <Input 
                                                    id="first-name" 
                                                    placeholder="Max" 
                                                    className="h-12 bg-background border-border/50 focus-visible:ring-1 transition-all" 
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="last-name" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last name</Label>
                                                <Input 
                                                    id="last-name" 
                                                    placeholder="Robinson" 
                                                    className="h-12 bg-background border-border/50 focus-visible:ring-1 transition-all" 
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</Label>
                                            <Input 
                                                id="email" 
                                                type="email" 
                                                placeholder="m@example.com" 
                                                className="h-12 bg-background border-border/50 focus-visible:ring-1 transition-all"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</Label>
                                             <Input 
                                                id="password" 
                                                type="password" 
                                                className="h-12 bg-background border-border/50 focus-visible:ring-1 transition-all"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>

                                        <Button type="submit" className="w-full h-12 text-sm font-bold shadow-sm" disabled={isLoading}>
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue with Email"}
                                        </Button>
                                    </form>

                                    <div className="space-y-6">
                                        <p className="text-center text-sm font-medium text-muted-foreground">
                                            Already have an account?{" "}
                                            <Link href="/login" className="font-bold text-foreground hover:underline underline-offset-4 transition-all">
                                                Sign in
                                            </Link>
                                        </p>
                                        
                                        <div className="text-center pt-2">
                                            <Button variant="ghost" size="sm" asChild className="hover:bg-muted/50 rounded-full h-8 px-4 text-xs font-medium text-muted-foreground">
                                                <Link href="/" className="gap-2">
                                                    <ArrowLeft className="h-3.5 w-3.5" />
                                                    Back to Home
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="absolute inset-0 flex flex-col justify-start space-y-8 pt-8"
                                >
                                    <div className="text-center space-y-3">
                                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted border border-border shadow-sm mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                        </div>
                                        <h2 className="text-3xl font-bold tracking-tight">Check your email</h2>
                                        <p className="text-sm text-muted-foreground font-medium max-w-[280px] mx-auto leading-relaxed">
                                            We've sent a secure 6-digit verification code to <span className="text-foreground font-semibold">{email || "your email"}</span>.
                                        </p>
                                    </div>

                                    <form onSubmit={handleVerifyOtp} className="space-y-8 flex flex-col items-center">
                                        <div className="flex justify-center w-full">
                                            <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                                                <InputOTPGroup className="gap-2 sm:gap-3">
                                                    <InputOTPSlot index={0} className="w-10 h-12 sm:w-12 sm:h-14 text-lg font-bold border-border shadow-sm rounded-md bg-background focus-visible:ring-1 focus-visible:ring-foreground transition-all" />
                                                    <InputOTPSlot index={1} className="w-10 h-12 sm:w-12 sm:h-14 text-lg font-bold border-border shadow-sm rounded-md bg-background focus-visible:ring-1 focus-visible:ring-foreground transition-all" />
                                                    <InputOTPSlot index={2} className="w-10 h-12 sm:w-12 sm:h-14 text-lg font-bold border-border shadow-sm rounded-md bg-background focus-visible:ring-1 focus-visible:ring-foreground transition-all" />
                                                    <InputOTPSlot index={3} className="w-10 h-12 sm:w-12 sm:h-14 text-lg font-bold border-border shadow-sm rounded-md bg-background focus-visible:ring-1 focus-visible:ring-foreground transition-all" />
                                                    <InputOTPSlot index={4} className="w-10 h-12 sm:w-12 sm:h-14 text-lg font-bold border-border shadow-sm rounded-md bg-background focus-visible:ring-1 focus-visible:ring-foreground transition-all" />
                                                    <InputOTPSlot index={5} className="w-10 h-12 sm:w-12 sm:h-14 text-lg font-bold border-border shadow-sm rounded-md bg-background focus-visible:ring-1 focus-visible:ring-foreground transition-all" />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>

                                        <Button type="submit" className="w-full h-12 text-sm font-bold shadow-sm" disabled={isLoading || otp.length !== 6}>
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Account"}
                                        </Button>
                                    </form>

                                    <div className="space-y-4 pt-4 text-center">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Didn't receive the code?{" "}
                                            <button 
                                                onClick={handleResendOtp} 
                                                className="font-bold text-foreground hover:underline underline-offset-4 transition-all"
                                                type="button"
                                                disabled={isLoading}
                                            >
                                                Resend
                                            </button>
                                        </p>
                                        
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => setStep(1)} 
                                            className="hover:bg-muted/50 rounded-full h-8 px-4 text-xs font-medium text-muted-foreground"
                                        >
                                            <ArrowLeft className="h-3.5 w-3.5 mr-2" />
                                            Change email
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
