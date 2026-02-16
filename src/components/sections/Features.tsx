"use client";

import { motion } from "framer-motion";
import { Zap, BarChart3, Users, Layout, Shield, Smartphone } from "lucide-react";

const features = [
    {
        icon: Layout,
        title: "Intuitive Dashboard",
        description: "Get a bird's eye view of all your projects with our customizable and interactive dashboard.",
    },
    {
        icon: Users,
        title: "Real-time Collaboration",
        description: "Work together with your team in real-time. Comments, mentions, and updates happen instantly.",
    },
    {
        icon: BarChart3,
        title: "Advanced Analytics",
        description: "Gain insights into your team's performance with detailed reports and progress tracking.",
    },
    {
        icon: Zap,
        title: "Smart Automation",
        description: "Automate repetitive tasks and workflows so you can focus on what truly matters.",
    },
    {
        icon: Shield,
        title: "Enterprise Security",
        description: "Keep your data safe with bank-level encryption and advanced permission controls.",
    },
    {
        icon: Smartphone,
        title: "Mobile Friendly",
        description: "Manage your projects on the go with our fully responsive mobile application.",
    },
];

export function Features() {
    return (
        <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center text-center space-y-4 mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                    >
                        Everything you need to ship faster
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                    >
                        Powerful features designed to help your team build, ship, and scale the software of the future.
                    </motion.p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-start p-6 bg-background rounded-2xl border shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="p-3 rounded-lg bg-primary/10 text-primary mb-4">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
