
import { Metadata } from "next";
import ChartAndAlerts from "./chart-and-alerts"
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Welcome to the dashboard page",
};

export default function Home() {
  return (
    <main className="px-4 md:px-6 my-4">
      <ChartAndAlerts />
    </main>
  );
}
