"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    // Form state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const supabase = createClient();

    const handleStandardLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error("Please enter both email and password.");
            return;
        }

        setIsLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        setIsLoading(false);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Welcome back!");
            router.push('/dashboard');
        }
    };

    const handleForgotPasswordRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your registered email address.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/forgot-password/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || "Failed to send reset code.");
            }

            setStep(3);
            toast.success("A reset code has been sent to your email.");
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
            const res = await fetch('/api/auth/forgot-password/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp }),
            });
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || "Invalid verification code.");
            }

            const { error: sessionError } = await supabase.auth.verifyOtp({
                email: data.email,
                token_hash: data.magicLinkToken,
                type: 'magiclink'
            });

            if (sessionError) {
                throw new Error("Code verified, but failed to establish a secure session.");
            }

            setStep(4);
            toast.success("Secure session established!");

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }
        if (!/[A-Z]/.test(newPassword)) {
            toast.error("Password must contain at least one uppercase letter.");
            return;
        }
        if (!/[0-9]/.test(newPassword)) {
            toast.error("Password must contain at least one number.");
            return;
        }

        setIsLoading(true);
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });
        setIsLoading(false);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Password updated successfully!");
            router.push('/dashboard');
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
                        Welcome back to your workspace.
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                        Sign in to continue managing your projects efficiently, tracking timelines seamlessly, and building alongside your team.
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
                            {/* STEP 1: Standard Login */}
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
                                        <h2 className="text-3xl font-bold tracking-tight">Sign in</h2>
                                        <p className="text-sm text-muted-foreground font-medium">
                                             Enter your credentials to access your account
                                        </p>
                                    </div>

                                    <form onSubmit={handleStandardLogin} className="space-y-5">
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
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</Label>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setStep(2)}
                                                    className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    Forgot password?
                                                </button>
                                            </div>
                                             <Input 
                                                id="password" 
                                                type="password" 
                                                className="h-12 bg-background border-border/50 focus-visible:ring-1 transition-all"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>

                                        <Button type="submit" className="w-full h-12 text-sm font-bold shadow-sm" disabled={isLoading}>
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
                                        </Button>
                                    </form>

                                    <div className="space-y-6">
                                        <p className="text-center text-sm font-medium text-muted-foreground">
                                            Don't have an account?{" "}
                                            <Link href="/signup" className="font-bold text-foreground hover:underline underline-offset-4 transition-all">
                                                Sign up
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

                            {/* STEP 2: Forgot Password Request */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="absolute inset-0 flex flex-col justify-start space-y-8 pt-8"
                                >
                                    <div className="text-center space-y-2">
                                        <h2 className="text-3xl font-bold tracking-tight">Forgot Password</h2>
                                        <p className="text-sm text-muted-foreground font-medium">
                                            Enter your registered email to receive a secure login code
                                        </p>
                                    </div>

                                    <form onSubmit={handleForgotPasswordRequest} className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="forgot-email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center block">Registered Email</Label>
                                            <Input 
                                                id="forgot-email" 
                                                type="email" 
                                                placeholder="m@example.com" 
                                                className="h-12 text-center bg-background border-border/50 focus-visible:ring-1 transition-all"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                autoFocus
                                            />
                                        </div>

                                        <Button type="submit" className="w-full h-12 text-sm font-bold shadow-sm" disabled={isLoading}>
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Login Code"}
                                        </Button>
                                    </form>

                                    <div className="text-center pt-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => setStep(1)} 
                                            className="hover:bg-muted/50 rounded-full h-8 px-4 text-xs font-medium text-muted-foreground"
                                        >
                                            <ArrowLeft className="h-3.5 w-3.5 mr-2" />
                                            Back to log in
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: Verify OTP */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="absolute inset-0 flex flex-col justify-start space-y-8 pt-8"
                                >
                                    <div className="text-center space-y-2">
                                        <h2 className="text-3xl font-bold tracking-tight">Verify Identity</h2>
                                        <p className="text-sm text-muted-foreground font-medium">
                                            We sent a 6-digit code to <span className="text-foreground font-bold">{email}</span>
                                        </p>
                                    </div>

                                    <form onSubmit={handleVerifyOtp} className="space-y-8 flex flex-col items-center w-full">
                                        <div className="flex justify-center w-full">
                                            <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)} disabled={isLoading}>
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

                                        <Button 
                                            type="submit" 
                                            className="w-full h-12 text-sm font-bold shadow-sm" 
                                            disabled={isLoading || otp.length !== 6}
                                        >
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Code"}
                                        </Button>
                                    </form>

                                    <div className="text-center pt-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => setStep(2)} 
                                            className="hover:bg-muted/50 rounded-full h-8 px-4 text-xs font-medium text-muted-foreground"
                                            disabled={isLoading}
                                        >
                                            <ArrowLeft className="h-3.5 w-3.5 mr-2" />
                                            Try another email
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 4: Choice Screen */}
                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="absolute inset-0 flex flex-col justify-start space-y-8 pt-8"
                                >
                                    <div className="text-center space-y-4">
                                        <div className="mx-auto w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
                                            <CheckCircle2 className="w-8 h-8 text-black" />
                                        </div>
                                        <h2 className="text-3xl font-bold tracking-tight">Session Secured</h2>
                                        <p className="text-sm text-muted-foreground font-medium max-w-[280px] mx-auto">
                                            Your identity is verified and you are securely logged in. How would you like to proceed?
                                        </p>
                                    </div>

                                    <div className="space-y-3 pt-4">
                                        <Button 
                                            onClick={() => router.push('/dashboard')} 
                                            className="w-full h-12 text-sm font-bold shadow-sm bg-black hover:bg-zinc-800 text-white"
                                        >
                                            Proceed to Dashboard (Keep password)
                                        </Button>
                                        
                                        <Button 
                                            variant="outline"
                                            onClick={() => setStep(5)} 
                                            className="w-full h-12 text-sm font-bold shadow-sm"
                                        >
                                            Create a New Password
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 5: Create New Password */}
                            {step === 5 && (
                                <motion.div
                                    key="step5"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="absolute inset-0 flex flex-col justify-start space-y-8 pt-8"
                                >
                                    <div className="text-center space-y-2">
                                        <h2 className="text-3xl font-bold tracking-tight">New Password</h2>
                                        <p className="text-sm text-muted-foreground font-medium">
                                            Set a strong, new password for your account
                                        </p>
                                    </div>

                                    <form onSubmit={handleUpdatePassword} className="space-y-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">New Password</Label>
                                            <Input 
                                                id="new-password" 
                                                type="password" 
                                                placeholder="••••••••" 
                                                className="h-12 bg-background border-border/50 focus-visible:ring-1 transition-all"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                             <ul className="mt-3 text-xs text-muted-foreground space-y-1.5 list-none px-1">
                                                <li className={"flex items-center gap-2 " + (newPassword.length >= 8 ? "text-black" : "")}>
                                                    <div className={"w-1 h-1 rounded-full " + (newPassword.length >= 8 ? "bg-black" : "bg-muted-foreground/30")} />
                                                    At least 8 characters
                                                </li>
                                                <li className={"flex items-center gap-2 " + (/[A-Z]/.test(newPassword) ? "text-black" : "")}>
                                                    <div className={"w-1 h-1 rounded-full " + (/[A-Z]/.test(newPassword) ? "bg-black" : "bg-muted-foreground/30")} />
                                                    One uppercase letter
                                                </li>
                                                <li className={"flex items-center gap-2 " + (/[0-9]/.test(newPassword) ? "text-black" : "")}>
                                                    <div className={"w-1 h-1 rounded-full " + (/[0-9]/.test(newPassword) ? "bg-black" : "bg-muted-foreground/30")} />
                                                    One number
                                                </li>
                                            </ul>
                                        </div>

                                        <Button type="submit" className="w-full h-12 text-sm font-bold shadow-sm" disabled={isLoading}>
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save new password"}
                                        </Button>
                                    </form>
                                    
                                    <div className="text-center pt-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => router.push('/dashboard')} 
                                            className="hover:bg-muted/50 rounded-full h-8 px-4 text-xs font-medium text-muted-foreground"
                                            disabled={isLoading}
                                        >
                                            Skip and go to dashboard
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
