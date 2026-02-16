"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function Pricing() {
    return (
        <section id="pricing" className="py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center text-center space-y-4 mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                    >
                        Simple, transparent pricing
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="max-w-[700px] text-muted-foreground md:text-xl/relaxed"
                    >
                        Choose the specific plan that fits your team's needs. No hidden fees.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Starter Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-col p-8 bg-background rounded-2xl border"
                    >
                        <h3 className="text-lg font-medium text-muted-foreground">Starter</h3>
                        <div className="mt-4 flex items-baseline text-5xl font-extrabold tracking-tight">
                            $0
                            <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                        </div>
                        <p className="mt-4 text-muted-foreground">Perfect for individuals and small side projects.</p>
                        <ul className="mt-8 space-y-4 flex-1">
                            {['Up to 3 projects', 'Basic analytics', 'Community support', '1 Team member'].map((feature) => (
                                <li key={feature} className="flex items-center">
                                    <Check className="h-4 w-4 text-green-500 mr-3" />
                                    <span className="text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <Button variant="outline" className="mt-8 w-full">Get Started</Button>
                    </motion.div>

                    {/* Pro Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col p-8 bg-slate-900 text-white rounded-2xl shadow-xl ring-1 ring-slate-900 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
                        <h3 className="text-lg font-medium text-primary-foreground/80">Pro</h3>
                        <div className="mt-4 flex items-baseline text-5xl font-extrabold tracking-tight">
                            $12
                            <span className="ml-1 text-xl font-medium text-slate-400">/mo</span>
                        </div>
                        <p className="mt-4 text-slate-300">For growing teams that need more power and speed.</p>
                        <ul className="mt-8 space-y-4 flex-1">
                            {['Unlimited projects', 'Advanced analytics', 'Priority support', 'Up to 10 Team members', 'Custom integrations'].map((feature) => (
                                <li key={feature} className="flex items-center">
                                    <Check className="h-4 w-4 text-primary mr-3" />
                                    <span className="text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <Button className="mt-8 w-full bg-primary hover:bg-primary/90 text-primary-foreground border-0">Get Started</Button>
                    </motion.div>

                    {/* Enterprise Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col p-8 bg-background rounded-2xl border"
                    >
                        <h3 className="text-lg font-medium text-muted-foreground">Business</h3>
                        <div className="mt-4 flex items-baseline text-5xl font-extrabold tracking-tight">
                            $49
                            <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                        </div>
                        <p className="mt-4 text-muted-foreground">Dedicated support and infrastructure for your company.</p>
                        <ul className="mt-8 space-y-4 flex-1">
                            {['Everything in Pro', 'SSO & Advanced Security', 'Dedicated Success Manager', 'Unlimited Team members', 'SLA'].map((feature) => (
                                <li key={feature} className="flex items-center">
                                    <Check className="h-4 w-4 text-green-500 mr-3" />
                                    <span className="text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <Button variant="outline" className="mt-8 w-full">Contact Sales</Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
