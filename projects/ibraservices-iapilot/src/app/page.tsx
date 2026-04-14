import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="text-center mb-12">
        <div className="flex justify-center items-center gap-4 mb-4">
          <Logo className="h-12 w-12 text-primary" />
          <h1 className="text-5xl font-bold font-headline text-foreground">
            IBRA Service OS
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          The next-generation, AI-powered service operating system.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Button asChild>
          <Link href="/login">Se connecter</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/signup">S'inscrire</Link>
        </Button>
      </div>
    </main>
  );
}
