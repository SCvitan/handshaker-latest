import Image from "next/image";
import { CVBuilder } from "@/components/cv-builder";
import { LandingPage } from "@/components/landing-page";


export default function Home() {
  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">CV Builder</h1>
          <p className="text-muted-foreground">Build your professional CV in just a few steps</p>
        </div>
        <LandingPage />
      </div>
    </main>
  );
}
