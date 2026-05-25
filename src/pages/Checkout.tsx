import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, CreditCard, QrCode, FileText, CheckCircle2, Lock } from "lucide-react";
import { formatCPF, formatCEP } from "@/lib/utils";

type PaymentMethod = "cartao" | "pix" | "boleto";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"resumo" | "pagamento" | "confirmado">("resumo");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cartao");
  const [cardFlipped, setCardFlipped] = useState(false);

  const pixDiscount = 0.1; // 10%

  const [form, setForm] = useState({
    nome: "", email: "", cpf: "", telefone: "",
    cep: "", endereco: "", numero: "", cidade: "", estado: "",
    cardNumber: "", cardName: "", cardExpiry: "", cardCvv: "",
  });

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("confirmado");
    clearCart();
  };

  if (step === "confirmado") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-card border border-border p-14 text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 border border-primary/40 flex items-center justify-center mx-auto"
          >
            <CheckCircle2 size={36} className="text-primary" />
          </motion.div>
          <h2 className="text-3xl font-serif text-white">Pedido Confirmado</h2>
          <div className="w-12 h-px bg-primary mx-auto" />
          <p className="text-muted-foreground font-light leading-relaxed">
            Sua fragrância Al Majd está sendo preparada com todo o cuidado que ela merece. Você receberá um email de confirmação em breve.
          </p>
          <div className="border border-primary/20 p-4 text-left space-y-2">
            <p className="text-xs tracking-widest uppercase text-muted-foreground">Número do Pedido</p>
            <p className="font-serif text-primary text-lg tracking-widest">
              #ALM{Math.floor(Math.random() * 90000 + 10000)}
            </p>
          </div>
          <Button
            onClick={() => setLocation("/")}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-serif tracking-widest uppercase rounded-none"
          >
            Voltar ao Início
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ... (o resto do código permanece igual) ... */}

      {/* Apenas a parte do cupom foi alterada */}
      <div className="bg-card border border-border/50 p-4 space-y-2">
        <p className="text-xs tracking-widest uppercase text-muted-foreground">Tem um cupom?</p>
        <div className="flex gap-2">
          <Input 
            data-testid="coupon-input" 
            placeholder="ALMAJD10" 
            className="bg-background border-border focus-visible:ring-primary h-10 rounded-none text-sm" 
          />
          <Button 
            className="border border-primary text-primary hover:bg-primary/10 rounded-none h-10 text-xs tracking-widest uppercase px-4"
          >
            Aplicar
          </Button>
        </div>
      </div>

      {/* ... resto do arquivo igual ... */}
    </div>
  );
}