'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBarLink } from "@/contexts/progress-bar-provider";
import { motion } from "framer-motion";

export default function LandingComponent() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-background text-foreground space-y-20">

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-2xl"
            >
                <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                    Smart Inventory Management
                </h1>
                <p className="text-base sm:text-lg mb-6">
                    Simplify stock control with real-time alerts, low threshold warnings,
                    and powerful analytics—all in one place.
                </p>
                <ProgressBarLink href={'/dashboard'}>
                    <Button>Get Started</Button>
                </ProgressBarLink>
            </motion.div>

            {/* About Section */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="max-w-6xl w-full text-center"
            >
                <h2 className="text-2xl font-semibold mb-8">Why Smart Inventory?</h2>
                <div className="grid sm:grid-cols-3 gap-6 text-left">
                    <Card className="rounded-2xl shadow">
                        <CardContent className="p-4">
                            <p className="text-sm">
                                Track inventory levels in real-time and avoid costly stockouts.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-2xl shadow">
                        <CardContent className="p-4">
                            <p className="text-sm">
                                Get alerts before stock runs out and manage restocking efficiently.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-2xl shadow">
                        <CardContent className="p-4">
                            <p className="text-sm">
                                Analyze trends and make data-driven inventory decisions.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </motion.section>

            {/* Testimonial Section */}
            <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="w-full max-w-6xl"
            >
                <h2 className="text-2xl font-semibold text-center mb-6">What Our Users Say</h2>
                <div className="grid sm:grid-cols-3 gap-6">
                    <Card className="rounded-2xl shadow">
                        <CardContent className="p-4">
                            <p className="text-sm mb-2">
                                &apos;Since using Smart Inventory, we&apos;ve reduced stockouts by 40%. The
                                alerts are a game changer.&apos;
                            </p>
                            <span className="text-sm font-medium">— Ayesha, Store Owner</span>
                        </CardContent>
                    </Card>
                    <Card className="rounded-2xl shadow">
                        <CardContent className="p-4">
                            <p className="text-sm mb-2">
                                &apos;Managing inventory across multiple branches has never been easier.
                                I highly recommend it.&apos;
                            </p>
                            <span className="text-sm font-medium">— Ramesh, Warehouse Manager</span>
                        </CardContent>
                    </Card>
                    <Card className="rounded-2xl shadow">
                        <CardContent className="p-4">
                            <p className="text-sm mb-2">
                                &apos;The analytics dashboard gives me full visibility and control over stock.
                                Excellent platform!&apos;
                            </p>
                            <span className="text-sm font-medium">— Priya, Inventory Analyst</span>
                        </CardContent>
                    </Card>
                </div>
            </motion.section>
        </main>
    );
}
