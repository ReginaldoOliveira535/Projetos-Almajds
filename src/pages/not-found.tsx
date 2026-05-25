import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground px-6">
      <div className="max-w-md w-full bg-card border border-border p-12 text-center space-y-6">
        <div className="w-16 h-16 border border-primary/40 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-serif text-white">Página Não Encontrada</h1>
        <div className="w-12 h-px bg-primary mx-auto" />
        <p className="text-muted-foreground font-light leading-relaxed">
          A essência que você procura parece ter se dissipado no vento do deserto.
        </p>
        <Button
          onClick={() => setLocation("/")}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-serif tracking-widest uppercase rounded-none"
        >
          Voltar ao Início
        </Button>
      </div>
    </div>
  );
}
