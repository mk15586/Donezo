"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, BookOpen, CreditCard, Plug, Shield, ChevronDown, MessageCircle, ArrowRight } from "lucide-react";

const categories = [
    { title: "Getting Started", description: "Learn the basics of Donezo and set up your workspace.", icon: BookOpen },
    { title: "Billing & Plans", description: "Manage your subscription, invoices, and payment methods.", icon: CreditCard },
    { title: "Integrations", description: "Connect Donezo with your favorite tools like Slack and GitHub.", icon: Plug },
    { title: "Security", description: "Configure SSO, 2FA, and manage account permissions.", icon: Shield },
];

const faqs = [
    {
        question: "How do I invite team members?",
        answer: "You can invite team members by navigating to the Team directory in the sidebar and clicking the 'Invite Member' button in the top right corner. They will receive an email invitation to join your workspace."
    },
    {
        question: "Can I change my subscription plan later?",
        answer: "Absolutely! You can upgrade or downgrade your plan at any time from the Billing section in your Settings. Prorated charges will be applied automatically."
    },
    {
        question: "Is there a dark mode available?",
        answer: "Yes, Donezo fully supports structural dark mode. You can toggle this setting in your Appearance Settings or let it sync automatically with your system preferences."
    },
    {
        question: "How secure is my data?",
        answer: "We use enterprise-grade encryption at rest and in transit. Your data is backed up daily, and you can enable Two-Factor Authentication (2FA) for an extra layer of account security."
    }
];

export function HelpCenter() {
    return (
        <div className="space-y-12 pb-8 max-w-5xl mx-auto">
            {/* Hero Search Section */}
            <div className="text-center space-y-6 pt-4 pb-8">
                <h2 className="text-4xl font-bold tracking-tight text-foreground">How can we help you?</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Search our knowledge base or browse categories below to find exactly what you need.
                </p>
                <div className="relative max-w-2xl mx-auto group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search for articles, tutorials, or FAQs..." 
                        className="w-full h-14 pl-12 pr-4 rounded-full border border-border bg-card shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            {/* Quick Categories */}
            <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6 px-1">Browse by Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categories.map((cat, i) => (
                        <div key={i} className="rounded-[24px] bg-card border border-border p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 bg-muted text-foreground border border-border/50">
                                <cat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{cat.title}</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">{cat.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQs Accordion */}
            <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6 px-1">Frequently Asked Questions</h3>
                <div className="rounded-[24px] bg-card border border-border shadow-sm overflow-hidden divide-y divide-border">
                    {faqs.map((faq, i) => (
                        <FAQItem key={i} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </section>

            {/* Contact Support CTA */}
            <section className="rounded-[24px] bg-card border border-border p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <MessageCircle className="w-8 h-8 text-foreground" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Still need help?</h3>
                        <p className="text-muted-foreground text-sm max-w-md">
                            Can't find the answer you're looking for? Our support team is available 24/7 to assist you with any technical issues.
                        </p>
                    </div>
                </div>
                <button className="relative z-10 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 py-3 rounded-full shadow-sm transition-all flex items-center gap-2 hover:scale-105">
                    Contact Support <ArrowRight className="w-4 h-4" />
                </button>
            </section>
        </div>
    );
}

// ----------------------------------------------------------------------
// Custom FAQ Accordion Item
// ----------------------------------------------------------------------

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="group border-b border-border last:border-0">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-muted/30 transition-colors"
            >
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors pr-4">{question}</span>
                <div className={cn(
                    "w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 transition-transform duration-300",
                    isOpen ? "rotate-180 bg-primary/10 text-primary" : "text-muted-foreground"
                )}>
                    <ChevronDown className="w-4 h-4" />
                </div>
            </button>
            <div 
                className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className="p-6 pt-0 text-sm text-muted-foreground leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
}
