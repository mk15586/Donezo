"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function About() {
    return (
        <section id="about" className="py-20 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex-1 relative"
                    >
                        <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl">
                            {/* Abstract/Modern Image Placeholder - Using a gradient or pattern if no image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                                <span className="text-slate-700 text-9xl font-bold opacity-20">Donezo</span>
                            </div>
                            {/* If we had an image: <Image src="..." alt="Our Team" fill className="object-cover" /> */}
                            <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl text-white">
                                <p className="font-semibold text-lg">"Donezo changed how we ship products entirely. It's simply the best tool we've used."</p>
                                <p className="mt-2 text-sm text-slate-300">- Alex Chen, CTO at TechFlow</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex-1 space-y-6"
                    >
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">About Us</h2>
                        <p className="text-lg text-muted-foreground">
                            We believe that project management shouldn't be a project in itself.
                            Our mission is to simplify the complex, allowing teams to focus on meaningful work rather than managing tickets.
                        </p>
                        <p className="text-lg text-muted-foreground">
                            Founded in 2024, Donezo is built by a team of designers and engineers who decided to fix their own broken workflows.
                            We're passionate about software quality, beautiful design, and human-centric tools.
                        </p>

                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div>
                                <h4 className="text-3xl font-bold text-primary">10k+</h4>
                                <p className="text-sm text-muted-foreground">Active Users</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-primary">99.9%</h4>
                                <p className="text-sm text-muted-foreground">Uptime</p>
                            </div>
                        </div>

                        <Button size="lg" className="mt-4">Read Our Story</Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
