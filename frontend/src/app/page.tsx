import { Metadata } from "next";
import LandingComponent from "./landing";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to the home page",
};


export default function Home() {
  return (
    <div>
      <LandingComponent />
    </div>
  );
}
