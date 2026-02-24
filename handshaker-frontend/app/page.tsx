import Image from "next/image";
import { CVBuilder } from "@/components/cv-builder";
import { LandingPage } from "@/components/landing-page";


export default function Home() {
  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <LandingPage />
      </div>
    </main>
  );
}
