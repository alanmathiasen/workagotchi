import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Cpu, ListTodo } from "lucide-react";
import { useGameLogic } from "@/hooks/useGameState";

export default function App() {
  const { feed, play, rest } = useGameLogic();



  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Workagotchi</h1>
          <p className="text-muted-foreground">
            Placeholder — wire in real data here.
          </p>
        </header>

        <main className="grid grid-cols-4 gap-4">
          <section className="col-span-1 flex flex-col gap-2">
            <Button variant="default" onClick={feed}>
              ALIMENTAR
            </Button>

            <Button variant="default" onClick={play}>
              JUGAR
            </Button>

            <Button variant="default" onClick={rest}>
              DORMIR LA SIESTA
            </Button>

            <Button variant="default" onClick={rest}>
              MEDITAR
            </Button>

            <Button
              variant="secondary"
              onClick={() => window.api.openMinigame()}
            >
              ABRIR JUEGO
            </Button>
          </section>

          <section className="col-span-2"></section>

        </main>
      </div>
    </div>
  );
}
