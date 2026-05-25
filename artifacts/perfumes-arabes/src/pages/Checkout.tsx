import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, CreditCard, QrCode, FileText, CheckCircle2, Lock } from "lucide-react";

type PaymentMethod = "cartao" | "pix" | "boleto";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"resumo" | "pagamento" | "confirmado">("resumo");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cartao");
  const [cardFlipped, setCardFlipped] = useState(false);

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
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
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
      {/* Nav */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-md px-6 h-20 flex items-center justify-between sticky top-0 z-40">
        <button
          data-testid="checkout-back"
          onClick={() => step === "pagamento" ? setStep("resumo") : setLocation("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors text-sm tracking-wider"
        >
          <ChevronLeft size={16} />
          {step === "pagamento" ? "Voltar ao Resumo" : "Continuar Comprando"}
        </button>
        <div className="font-serif text-xl tracking-widest text-primary">AL MAJD</div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock size={12} className="text-primary" />
          Checkout Seguro
        </div>
      </nav>

      {/* Steps indicator */}
      <div className="border-b border-border/30 bg-card/50">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4 text-xs tracking-widest uppercase">
          <span className={step === "resumo" ? "text-primary" : "text-muted-foreground"}>1. Resumo</span>
          <div className="flex-1 h-px bg-border/50" />
          <span className={step === "pagamento" ? "text-primary" : "text-muted-foreground"}>2. Pagamento</span>
          <div className="flex-1 h-px bg-border/50" />
          <span className="text-muted-foreground">3. Confirmação</span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10">

          {/* Left Column */}
          <div>
            <AnimatePresence mode="wait">
              {step === "resumo" && (
                <motion.div
                  key="resumo"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Resumo do Pedido</h1>
                    <div className="w-12 h-px bg-primary" />
                  </div>

                  {items.length === 0 ? (
                    <div className="bg-card border border-border p-12 text-center">
                      <p className="text-muted-foreground font-light mb-6">Seu carrinho está vazio.</p>
                      <Button onClick={() => setLocation("/")} className="bg-primary text-primary-foreground rounded-none font-serif tracking-widest uppercase">
                        Explorar Coleção
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map(item => (
                        <div key={item.id} className="flex gap-5 bg-card border border-border p-5">
                          <div className="w-20 h-28 flex-shrink-0 overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <p className="text-[10px] tracking-widest uppercase text-muted-foreground/60">{item.notes}</p>
                              <h3 className="font-serif text-white text-lg mt-1">{item.name}</h3>
                              <p className="text-muted-foreground text-sm font-light mt-1">
                                {item.quantity}x R$ {item.priceNum.toLocaleString("pt-BR")}
                              </p>
                            </div>
                            <p className="text-primary font-serif text-base">
                              R$ {(item.priceNum * item.quantity).toLocaleString("pt-BR")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Delivery Address */}
                  <div className="space-y-5">
                    <h2 className="text-xl font-serif text-white">Endereço de Entrega</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <label className="text-xs tracking-widest uppercase text-muted-foreground">Nome Completo</label>
                        <Input value={form.nome} onChange={e => set("nome", e.target.value)} required className="bg-card border-border focus-visible:ring-primary h-11 rounded-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs tracking-widest uppercase text-muted-foreground">Email</label>
                        <Input type="email" value={form.email} onChange={e => set("email", e.target.value)} required className="bg-card border-border focus-visible:ring-primary h-11 rounded-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs tracking-widest uppercase text-muted-foreground">CPF</label>
                        <Input placeholder="000.000.000-00" value={form.cpf} onChange={e => set("cpf", e.target.value)} className="bg-card border-border focus-visible:ring-primary h-11 rounded-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs tracking-widest uppercase text-muted-foreground">CEP</label>
                        <Input placeholder="00000-000" value={form.cep} onChange={e => set("cep", e.target.value)} className="bg-card border-border focus-visible:ring-primary h-11 rounded-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs tracking-widest uppercase text-muted-foreground">Número</label>
                        <Input value={form.numero} onChange={e => set("numero", e.target.value)} className="bg-card border-border focus-visible:ring-primary h-11 rounded-none" />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <label className="text-xs tracking-widest uppercase text-muted-foreground">Endereço</label>
                        <Input placeholder="Rua, bairro" value={form.endereco} onChange={e => set("endereco", e.target.value)} className="bg-card border-border focus-visible:ring-primary h-11 rounded-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs tracking-widest uppercase text-muted-foreground">Cidade</label>
                        <Input value={form.cidade} onChange={e => set("cidade", e.target.value)} className="bg-card border-border focus-visible:ring-primary h-11 rounded-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs tracking-widest uppercase text-muted-foreground">Estado</label>
                        <select value={form.estado} onChange={e => set("estado", e.target.value)} className="flex h-11 w-full border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary rounded-none text-foreground">
                          <option value="">UF</option>
                          {["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"].map(uf => (
                            <option key={uf} value={uf}>{uf}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <Button
                    data-testid="go-to-payment"
                    disabled={items.length === 0}
                    onClick={() => setStep("pagamento")}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 font-serif tracking-widest uppercase rounded-none"
                  >
                    Continuar para Pagamento
                  </Button>
                </motion.div>
              )}

              {step === "pagamento" && (
                <motion.div
                  key="pagamento"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="mb-8">
                    <h1 className="text-3xl font-serif text-white mb-2">Forma de Pagamento</h1>
                    <div className="w-12 h-px bg-primary" />
                  </div>

                  {/* Payment Method Tabs */}
                  <div className="grid grid-cols-3 gap-2 mb-8">
                    {([
                      { key: "cartao", icon: <CreditCard size={16} />, label: "Cartão" },
                      { key: "pix", icon: <QrCode size={16} />, label: "PIX" },
                      { key: "boleto", icon: <FileText size={16} />, label: "Boleto" },
                    ] as const).map(({ key, icon, label }) => (
                      <button
                        key={key}
                        data-testid={`payment-${key}`}
                        onClick={() => setPaymentMethod(key)}
                        className={`flex flex-col items-center gap-2 p-4 border transition-all duration-200 ${
                          paymentMethod === key
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {icon}
                        <span className="text-xs tracking-widest uppercase">{label}</span>
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleFinish} className="space-y-6">
                    <AnimatePresence mode="wait">
                      {paymentMethod === "cartao" && (
                        <motion.div
                          key="cartao"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-5"
                        >
                          {/* Card visual */}
                          <div
                            className="relative h-44 cursor-pointer select-none"
                            style={{ perspective: "1000px" }}
                            onClick={() => setCardFlipped(f => !f)}
                          >
                            <motion.div
                              animate={{ rotateY: cardFlipped ? 180 : 0 }}
                              transition={{ duration: 0.5 }}
                              style={{ transformStyle: "preserve-3d" }}
                              className="relative w-full h-full"
                            >
                              {/* Front */}
                              <div
                                className="absolute inset-0 bg-gradient-to-br from-[#1a1400] via-[#2d2200] to-[#0d0900] border border-primary/30 rounded p-6 flex flex-col justify-between"
                                style={{ backfaceVisibility: "hidden" }}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="font-serif text-primary text-sm tracking-widest">AL MAJD</div>
                                  <div className="w-10 h-7 bg-primary/20 border border-primary/30 rounded-sm" />
                                </div>
                                <div>
                                  <p className="text-white font-mono text-lg tracking-[0.25em]">
                                    {form.cardNumber ? form.cardNumber.replace(/(.{4})/g, "$1 ").trim() : "•••• •••• •••• ••••"}
                                  </p>
                                  <div className="flex justify-between mt-3">
                                    <div>
                                      <p className="text-muted-foreground text-[9px] tracking-widest uppercase">Titular</p>
                                      <p className="text-white text-xs tracking-widest uppercase">{form.cardName || "NOME DO TITULAR"}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground text-[9px] tracking-widest uppercase">Validade</p>
                                      <p className="text-white text-xs tracking-widest">{form.cardExpiry || "MM/AA"}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Back */}
                              <div
                                className="absolute inset-0 bg-gradient-to-br from-[#1a1400] via-[#2d2200] to-[#0d0900] border border-primary/30 rounded p-6 flex flex-col justify-center"
                                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                              >
                                <div className="w-full h-10 bg-black/60 mb-4" />
                                <div className="flex items-center justify-end gap-3">
                                  <div className="flex-1 h-8 bg-white/10" />
                                  <div className="bg-primary/20 border border-primary/30 px-4 py-2 font-mono text-white text-sm tracking-widest">
                                    {form.cardCvv || "•••"}
                                  </div>
                                </div>
                                <p className="text-muted-foreground text-[9px] tracking-widest uppercase text-right mt-2">CVV</p>
                              </div>
                            </motion.div>
                          </div>
                          <p className="text-xs text-muted-foreground/50 text-center">Clique no cartão para ver o verso</p>

                          <div className="space-y-2">
                            <label className="text-xs tracking-widest uppercase text-muted-foreground">Número do Cartão</label>
                            <Input
                              data-testid="card-number"
                              placeholder="0000 0000 0000 0000"
                              value={form.cardNumber}
                              onChange={e => set("cardNumber", e.target.value.replace(/\D/g, "").slice(0, 16))}
                              required
                              className="bg-card border-border focus-visible:ring-primary h-11 rounded-none font-mono"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs tracking-widest uppercase text-muted-foreground">Nome do Titular</label>
                            <Input
                              data-testid="card-name"
                              placeholder="Como aparece no cartão"
                              value={form.cardName}
                              onChange={e => set("cardName", e.target.value.toUpperCase())}
                              required
                              className="bg-card border-border focus-visible:ring-primary h-11 rounded-none uppercase"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-xs tracking-widest uppercase text-muted-foreground">Validade</label>
                              <Input
                                data-testid="card-expiry"
                                placeholder="MM/AA"
                                value={form.cardExpiry}
                                onChange={e => set("cardExpiry", e.target.value.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2"))}
                                required
                                className="bg-card border-border focus-visible:ring-primary h-11 rounded-none font-mono"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs tracking-widest uppercase text-muted-foreground">CVV</label>
                              <Input
                                data-testid="card-cvv"
                                placeholder="•••"
                                type="password"
                                maxLength={4}
                                value={form.cardCvv}
                                onChange={e => set("cardCvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                                onFocus={() => setCardFlipped(true)}
                                onBlur={() => setCardFlipped(false)}
                                required
                                className="bg-card border-border focus-visible:ring-primary h-11 rounded-none font-mono"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs tracking-widest uppercase text-muted-foreground">Parcelas</label>
                            <select className="flex h-11 w-full border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary rounded-none text-foreground">
                              {[1,2,3,4,5,6].map(n => (
                                <option key={n} value={n}>
                                  {n}x de R$ {(total / n).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  {n === 1 ? " (sem juros)" : n <= 3 ? " (sem juros)" : " (com juros)"}
                                </option>
                              ))}
                            </select>
                          </div>
                        </motion.div>
                      )}

                      {paymentMethod === "pix" && (
                        <motion.div
                          key="pix"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-card border border-border p-8 text-center space-y-6"
                        >
                          <QrCode size={80} className="text-primary mx-auto" />
                          <div>
                            <p className="text-white font-serif text-lg mb-2">Pague com PIX</p>
                            <p className="text-muted-foreground text-sm font-light">
                              Ao confirmar, um QR Code será gerado. O pagamento é aprovado em instantes.
                            </p>
                          </div>
                          <div className="border border-primary/20 p-4">
                            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">Valor a pagar</p>
                            <p className="font-serif text-2xl text-primary">R$ {total.toLocaleString("pt-BR")}</p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-green-400/70 justify-center">
                            <Lock size={12} />
                            10% de desconto no PIX aplicado automaticamente
                          </div>
                        </motion.div>
                      )}

                      {paymentMethod === "boleto" && (
                        <motion.div
                          key="boleto"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-card border border-border p-8 text-center space-y-6"
                        >
                          <FileText size={80} className="text-primary mx-auto" />
                          <div>
                            <p className="text-white font-serif text-lg mb-2">Pague com Boleto</p>
                            <p className="text-muted-foreground text-sm font-light">
                              O boleto será gerado após a confirmação e terá vencimento em 3 dias úteis.
                            </p>
                          </div>
                          <div className="border border-primary/20 p-4">
                            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">Valor do boleto</p>
                            <p className="font-serif text-2xl text-primary">R$ {total.toLocaleString("pt-BR")}</p>
                          </div>
                          <p className="text-xs text-muted-foreground/60 font-light">
                            O pedido será processado após a confirmação do pagamento (1-2 dias úteis).
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button
                      data-testid="confirm-payment"
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 font-serif tracking-widest uppercase rounded-none"
                    >
                      <Lock size={14} className="mr-2" />
                      Confirmar Pagamento
                    </Button>
                    <p className="text-xs text-muted-foreground/50 text-center flex items-center justify-center gap-1">
                      <Lock size={10} />
                      Pagamento 100% seguro e criptografado
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="bg-card border border-border p-6 space-y-4">
              <h3 className="text-sm tracking-widest uppercase text-muted-foreground">Resumo</h3>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-16 flex-shrink-0 overflow-hidden border border-border">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-serif truncate">{item.name}</p>
                      <p className="text-muted-foreground text-xs">x{item.quantity}</p>
                    </div>
                    <p className="text-primary text-sm font-serif flex-shrink-0">
                      R$ {(item.priceNum * item.quantity).toLocaleString("pt-BR")}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-white">R$ {total.toLocaleString("pt-BR")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-green-400 text-xs">Calculado no próximo passo</span>
                </div>
                <div className="flex justify-between border-t border-border pt-3">
                  <span className="text-sm tracking-wider uppercase text-muted-foreground">Total</span>
                  <span className="font-serif text-xl text-white">R$ {total.toLocaleString("pt-BR")}</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border/50 p-4 space-y-2">
              <p className="text-xs tracking-widest uppercase text-muted-foreground">Tem um cupom?</p>
              <div className="flex gap-2">
                <Input data-testid="coupon-input" placeholder="ALMAJD10" className="bg-background border-border focus-visible:ring-primary h-10 rounded-none text-sm" />
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 rounded-none h-10 text-xs tracking-widest uppercase px-4">
                  Aplicar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
