"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-16 md:pt-20 lg:pt-32 pb-16 md:pb-20 lg:pb-32">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -z-10 h-[50rem] w-[90rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:[mask-image:none]">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-primary/10 dark:to-purple-500/10"></div>
                <svg
                    aria-hidden="true"
                    className="absolute inset-x-0 inset-y-[-50%] h-[200%] w-full skew-y-[-18deg] fill-black/5 stroke-black/10 mix-blend-overlay dark:fill-white/5 dark:stroke-white/10"
                >
                    <defs>
                        <pattern
                            id="grid-pattern"
                            width="72"
                            height="72"
                            patternUnits="userSpaceOnUse"
                            x="50%"
                            y="-1"
                        >
                            <path d="M.5 200V.5H200" fill="none" />
                        </pattern>
                    </defs>
                    <rect
                        width="100%"
                        height="100%"
                        strokeWidth="0"
                        fill="url(#grid-pattern)"
                    />
                </svg>
            </div>

            <div className="container mx-auto relative z-10 px-4 md:px-6">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 inline-flex items-center rounded-full border bg-background/50 px-3 py-1 text-sm font-medium backdrop-blur-sm"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                        v1.0 is now live
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl"
                    >
                        Manage projects <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">smarter</span>,
                        <br className="hidden sm:inline" /> not harder.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
                    >
                        Donezo brings clarity to chaos. Plan, track, and collaborate on
                        projects with a tool designed for modern teams who move fast.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6"
                    >
                        <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20" asChild>
                            <Link href="/signup">
                                Get Started Free
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base backdrop-blur-sm bg-background/50" asChild>
                            <Link href="#features">See How It Works</Link>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="mt-20 w-full max-w-5xl rounded-xl border bg-background/50 p-2 shadow-2xl backdrop-blur-sm lg:rounded-2xl lg:p-4"
                    >
                        <div className="relative aspect-video rounded-lg border bg-muted/50 overflow-hidden shadow-sm">
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                {/* Placeholder for Dashboard Screenshot */}
                                <div className="text-center">
                                    <CheckCircle2 className="mx-auto h-12 w-12 text-primary opacity-50 mb-4" />
                                    <p className="text-lg font-medium">Dashboard Preview</p>
                                    <p className="text-sm">Interactive dashboard coming soon</p>
                                </div>
                            </div>
                            {/* We can replace this with an actual image later if user provides one or we generate one */}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
