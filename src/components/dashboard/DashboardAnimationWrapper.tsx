"use client";

import { motion, type Variants } from "framer-motion";
import React from "react";

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            ease: "easeOut",
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function DashboardAnimationWrapper({ children }: { children: React.ReactNode }) {
    return (
        <motion.div 
            className="flex min-h-full flex-col gap-5 overflow-visible"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {children}
        </motion.div>
    );
}

export function DashboardAnimationItem({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <motion.div variants={item} className={className}>
            {children}
        </motion.div>
    );
}
