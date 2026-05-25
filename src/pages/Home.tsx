import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, ShoppingBag, ShoppingCart, Heart, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useLocation } from "wouter";
import { collections, FilterGender } from "@/data/products";

const filterLabels: { key: FilterGender; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "masculino", label: "Masculino" },
  { key: "feminino", label: "Feminino" }
];

function PromoPopup({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      localStorage.setItem("almajd_promo_dismissed", "true");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.4 }}
        className="relative bg-card border border-primary/40 max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

        <button
          data-testid="popup-close"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-10 md:p-14 text-center">
          {!submitted ? (
            <>
              <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4">Oferta Exclusiva</p>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-3 leading-tight">
                10% OFF na<br />Sua Primeira Compra
              </h2>
              <div className="w-12 h-px bg-primary mx-auto my-6" />
              <p className="text-muted-foreground font-light mb-8 leading-relaxed">
                Cadastre seu email e receba um cupom exclusivo para a sua primeira fragrância Al Majd. Uma oferta digna de realeza.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  data-testid="popup-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background border-border focus-visible:ring-primary h-12 rounded-none text-center placeholder:text-muted-foreground/50"
                />
                <Button
                  data-testid="popup-submit"
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-serif tracking-widest uppercase rounded-none"
                >
                  Quero Meu Desconto
                </Button>
              </form>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors tracking-wider uppercase"
              >
                Não, obrigado
              </button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-4 space-y-4"
            >
              <div className="w-16 h-16 border border-primary/40 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-primary" />
              </div>
              <h3 className="text-2xl font-serif text-white">Bem-vindo ao Círculo Al Majd</h3>
              <div className="w-12 h-px bg-primary mx-auto my-4" />
              <p className="text-muted-foreground font-light">Seu cupom foi enviado para <span className="text-primary">{email}</span>. Verifique sua caixa de entrada.</p>
              <div className="mt-6 border border-primary/30 p-4">
                <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">Seu cupom</p>
                <p className="text-2xl font-serif text-primary tracking-widest">ALMAJD10</p>
              </div>
              <Button
                onClick={onClose}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-serif tracking-widest uppercase rounded-none mt-4"
              >
                Explorar a Coleção
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<FilterGender>("todos");
  const [showPromo, setShowPromo] = useState(false);
  const [cadastroSubmitted, setCadastroSubmitted] = useState(false);
  const [contatoSubmitted, setContatoSubmitted] = useState(false);
  
  // Estado para o formulário de contato
  const [contatoForm, setContatoForm] = useState({
    nome: "", email: "", fragrancia: "", mensagem: ""
  });

  const { addItem, count, openCart } = useCart();
  const { toggle, isFavorite, count: favCount } = useFavorites();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Validação de segurança e integridade em produção
    if (import.meta.env.PROD) {
      if (!import.meta.env.VITE_API_URL) {
        console.error("Configuração Crítica: VITE_API_URL ausente no painel da Vercel.");
      }
    } else if (import.meta.env.DEV) {
      // Log detalhado apenas para desenvolvimento local
      console.log(`[AL MAJD DEBUG] Modo: ${import.meta.env.MODE} | API: ${import.meta.env.VITE_API_URL || "Localhost"}`);
    }
  }, []);

  useEffect(() => {
    const hasSeenPromo = localStorage.getItem("almajd_promo_dismissed");
    if (hasSeenPromo) return;

    const timer = setTimeout(() => setShowPromo(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const filtered = activeFilter === "todos"
    ? collections
    : collections.filter(c => c.gender === activeFilter);

  const handleClosePromo = () => {
    setShowPromo(false);
    localStorage.setItem("almajd_promo_dismissed", "true");
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* Promo Popup */}
      <AnimatePresence>
        {showPromo && <PromoPopup onClose={handleClosePromo} />}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <div className="font-serif text-2xl tracking-widest text-primary">AL MAJD</div>
          <div className="hidden md:flex gap-8 text-sm tracking-widest uppercase text-muted-foreground">
            <a href="#heranca" className="hover:text-primary transition-colors">Herança</a>
            <a href="#colecao" className="hover:text-primary transition-colors">Coleção</a>
            <a href="#artesania" className="hover:text-primary transition-colors">Artesania</a>
            <a href="#missao" className="hover:text-primary transition-colors">A Empresa</a>
            <a href="#cadastro" className="hover:text-primary transition-colors">Cadastro</a>
            <a href="#contato" className="hover:text-primary transition-colors">Contato</a>
          </div>
          <div className="flex items-center gap-5">
            <button
              data-testid="open-favorites"
              onClick={() => setLocation("/favoritos")}
              className="relative text-muted-foreground hover:text-primary transition-colors"
              title="Meus Favoritos"
            >
              <Heart size={20} />
              {favCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {favCount}
                </span>
              )}
            </button>
            <button
              data-testid="open-cart"
              onClick={openCart}
              className="relative text-muted-foreground hover:text-primary transition-colors"
              title="Carrinho"
            >
              <ShoppingBag size={22} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-24">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero.png"
            alt="Majlis majestoso"
            className="w-full h-full object-cover opacity-40"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/1920x1080/1a1a1a/b8a87a?text=Al+Majd+Luxury";
              (e.target as HTMLImageElement).onerror = null;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="container relative z-10 px-6 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h2 className="text-primary text-sm uppercase tracking-[0.3em] mb-6">A Glória da Perfumaria Árabe</h2>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
              O Perfume é a <br />Memória da Alma
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Descubra fragrâncias que contam histórias de rotas comerciais antigas, palácios reais e desertos sem fim.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-serif tracking-wider uppercase px-12 h-14 text-sm" asChild>
                <a href="#colecao">Descobrir a Coleção</a>
              </Button>
              <Button size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 font-serif tracking-wider uppercase px-12 h-14 text-sm rounded-none" asChild>
                <a href="#cadastro">Criar Cadastro</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Heritage Section */}
      <section id="heranca" className="py-32 bg-background border-b border-border/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-serif text-white">Nossa Herança</h2>
              <div className="w-16 h-px bg-primary"></div>
              <p className="text-muted-foreground text-lg leading-relaxed font-light">
                Al Majd, "A Glória", não é apenas uma casa de perfumes. É um santuário de tradições milenares. Fundada sobre a arte da perfumaria árabe tradicional, cada gota que engarrafamos é um tributo aos antigos alquimistas do Golfo.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed font-light">
                Utilizamos apenas o oud mais puro, o âmbar mais rico e o almíscar mais profundo, combinados com uma paciência cerimonial para criar fragrâncias que não apenas cheiram bem, mas que possuem uma presença, uma aura.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[600px] bg-secondary border border-border"
            >
              <img
                src="/images/hero.png"
                alt="Detalhe de incenso"
                className="w-full h-full object-cover opacity-60 grayscale-[30%] contrast-125"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Collection Section */}
      <section id="colecao" className="py-32 bg-background">
        <div className="container mx-auto px-6 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">A Coleção Soberana</h2>
            <div className="w-16 h-px bg-primary mx-auto mb-6"></div>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
              Uma coleção completa de fragrâncias exclusivas, elaboradas sem pressa para quem entende que o verdadeiro luxo é intemporal.
            </p>
            <div className="flex items-center justify-center gap-1 p-1 bg-card border border-border inline-flex mx-auto">
              {filterLabels.map(({ key, label }) => (
                <button
                  key={key}
                  data-testid={`filter-${key}`}
                  onClick={() => setActiveFilter(key)}
                  className={`px-8 py-3 text-xs tracking-widest uppercase font-light transition-all duration-300 ${
                    activeFilter === key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="container mx-auto px-6">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-[3/4] mb-8 overflow-hidden border border-border bg-card">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x800/1a1a1a/b8a87a?text=Perfume";
                        (e.target as HTMLImageElement).onerror = null;
                      }}
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <span className={`text-[10px] tracking-widest uppercase px-3 py-1 font-light ${
                        item.gender === "masculino"
                          ? "bg-[#1a1a2e]/80 text-[#b8a87a] border border-[#b8a87a]/40"
                          : "bg-[#1a0a0f]/80 text-[#d4a0b0] border border-[#d4a0b0]/40"
                      }`}>
                        {item.gender === "masculino" ? "Masculino" : "Feminino"}
                      </span>
                    </div>
                    <button
                      data-testid={`fav-${item.id}`}
                      onClick={() => toggle(item)}
                      className={`absolute top-4 right-4 z-20 w-9 h-9 border flex items-center justify-center transition-all duration-300 ${
                        isFavorite(item.id)
                          ? "bg-rose-600/20 border-rose-400/60 text-rose-400"
                          : "bg-background/70 border-border text-muted-foreground hover:text-rose-400 hover:border-rose-400/40"
                      }`}
                      title={isFavorite(item.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    >
                      <Heart size={13} fill={isFavorite(item.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div className="flex flex-col flex-1 text-center">
                    <div className="space-y-3 flex-1">
                      <h3 className="text-2xl font-serif text-primary">{item.name}</h3>
                      <p className="text-xs tracking-widest uppercase text-muted-foreground/60 font-light">{item.notes}</p>
                      <p className="text-sm text-muted-foreground font-light leading-relaxed px-4">{item.description}</p>
                      <p className="text-lg font-serif text-white pt-2 tracking-widest">{item.price}</p>
                    </div>
                    <button
                      data-testid={`buy-${item.id}`}
                      onClick={() => addItem({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        priceNum: item.priceNum,
                        image: item.image,
                        gender: item.gender,
                        notes: item.notes,
                      })}
                      className="w-full flex items-center justify-center gap-2 border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 py-3 text-xs tracking-widest uppercase font-light mt-6"
                    >
                      <ShoppingCart size={13} />
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section id="artesania" className="py-32 bg-card border-y border-border/50">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-serif text-primary">A Arte do Tempo</h2>
            <p className="text-xl text-muted-foreground font-light leading-relaxed">
              "Na Al Majd, não medimos nossos perfumes em ml, mas em anos. O envelhecimento do nosso oud em barris escuridão, a maceração cuidadosa das resinas. O tempo é o nosso ingrediente mais secreto e valioso."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Vision Values Section */}
      <section id="missao" className="py-32 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4">Quem Somos</p>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Missão, Visão e Valores</h2>
            <div className="w-16 h-px bg-primary mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Missão */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0 }}
              className="relative bg-card border border-border p-10 flex flex-col"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
              <div className="mb-8">
                <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-light">01</span>
                <h3 className="text-2xl font-serif text-white mt-3">Missão</h3>
                <div className="w-8 h-px bg-primary mt-4" />
              </div>
              <p className="text-muted-foreground font-light leading-relaxed flex-1">
                Levar a arte milenar da perfumaria árabe ao Brasil com autenticidade e excelência. Cada fragrância Al Majd é criada para despertar memórias, emoções e uma conexão profunda com a riqueza cultural do Oriente Médio — tornando o luxo verdadeiro acessível a quem aprecia o extraordinário.
              </p>
            </motion.div>

            {/* Visão */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative bg-card border border-border p-10 flex flex-col md:mt-8"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
              <div className="mb-8">
                <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-light">02</span>
                <h3 className="text-2xl font-serif text-white mt-3">Visão</h3>
                <div className="w-8 h-px bg-primary mt-4" />
              </div>
              <p className="text-muted-foreground font-light leading-relaxed flex-1">
                Ser reconhecida como a principal casa de perfumaria árabe da América Latina até 2030 — um símbolo de sofisticação, herança e inovação olfativa. Queremos que o nome Al Majd evoque, em cada canto do mundo, a mesma reverência que as grandes casas do Golfo inspiram há séculos.
              </p>
            </motion.div>

            {/* Valores */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative bg-card border border-border p-10 flex flex-col"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
              <div className="mb-8">
                <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-light">03</span>
                <h3 className="text-2xl font-serif text-white mt-3">Valores</h3>
                <div className="w-8 h-px bg-primary mt-4" />
              </div>
              <ul className="space-y-5 flex-1">
                {[
                  { titulo: "Autenticidade", desc: "Ingredientes genuínos, processos tradicionais, sem atalhos." },
                  { titulo: "Excelência", desc: "Cada detalhe importa — do frasco à última nota olfativa." },
                  { titulo: "Herança", desc: "Honramos a tradição árabe em cada gota que engarrafamos." },
                  { titulo: "Respeito", desc: "Com o cliente, a cultura e o meio ambiente." },
                  { titulo: "Exclusividade", desc: "Produção limitada para preservar a raridade e o valor." },
                ].map(({ titulo, desc }) => (
                  <li key={titulo} className="flex gap-4 items-start">
                    <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-white text-sm font-serif">{titulo}</p>
                      <p className="text-muted-foreground text-xs font-light leading-relaxed mt-1">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 border border-primary/20 p-10 md:p-14 text-center"
          >
            <p className="text-xl md:text-2xl font-serif text-white/80 leading-relaxed italic">
              "Al Majd nasceu da crença de que um perfume não é um produto — é uma promessa. A promessa de carregar consigo um pedaço da glória árabe aonde quer que vá."
            </p>
            <div className="w-12 h-px bg-primary mx-auto mt-8 mb-4" />
            <p className="text-xs tracking-widest uppercase text-primary font-light">Fundadores da Al Majd Perfumaria</p>
          </motion.div>
        </div>
      </section>

      {/* Customer Registration Section */}
      <section id="cadastro" className="py-32 bg-background border-b border-border/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4">Faça Parte</p>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Cadastro de Cliente</h2>
            <div className="w-16 h-px bg-primary mx-auto mb-6"></div>
            <p className="text-muted-foreground max-w-xl mx-auto font-light">
              Cadastre-se para receber ofertas exclusivas, lançamentos em primeira mão e acesso prioritário às novas fragrâncias.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto bg-card border border-border p-10 md:p-14"
          >
            {!cadastroSubmitted ? (
              <form
                className="space-y-6"
                onSubmit={(e) => { e.preventDefault(); setCadastroSubmitted(true); }}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs tracking-wider uppercase text-muted-foreground">Nome</label>
                    <Input data-testid="cadastro-nome" required className="bg-background border-border focus-visible:ring-primary h-12 rounded-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs tracking-wider uppercase text-muted-foreground">Sobrenome</label>
                    <Input data-testid="cadastro-sobrenome" required className="bg-background border-border focus-visible:ring-primary h-12 rounded-none" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs tracking-wider uppercase text-muted-foreground">Email</label>
                    <Input data-testid="cadastro-email" type="email" required className="bg-background border-border focus-visible:ring-primary h-12 rounded-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs tracking-wider uppercase text-muted-foreground">Telefone / WhatsApp</label>
                    <Input data-testid="cadastro-telefone" type="tel" placeholder="(00) 00000-0000" className="bg-background border-border focus-visible:ring-primary h-12 rounded-none" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs tracking-wider uppercase text-muted-foreground">CPF</label>
                    <Input data-testid="cadastro-cpf" placeholder="000.000.000-00" className="bg-background border-border focus-visible:ring-primary h-12 rounded-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs tracking-wider uppercase text-muted-foreground">Data de Nascimento</label>
                    <Input data-testid="cadastro-nascimento" type="date" className="bg-background border-border focus-visible:ring-primary h-12 rounded-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs tracking-wider uppercase text-muted-foreground">Endereço</label>
                  <Input data-testid="cadastro-endereco" placeholder="Rua, número, bairro" className="bg-background border-border focus-visible:ring-primary h-12 rounded-none" />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs tracking-wider uppercase text-muted-foreground">Cidade</label>
                    <Input data-testid="cadastro-cidade" className="bg-background border-border focus-visible:ring-primary h-12 rounded-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs tracking-wider uppercase text-muted-foreground">Estado</label>
                    <select data-testid="cadastro-estado" className="flex h-12 w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary rounded-none text-foreground">
                      <option value="">UF</option>
                      {["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"].map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs tracking-wider uppercase text-muted-foreground">CEP</label>
                    <Input data-testid="cadastro-cep" placeholder="00000-000" className="bg-background border-border focus-visible:ring-primary h-12 rounded-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs tracking-wider uppercase text-muted-foreground">Preferência de Fragrâncias</label>
                  <select data-testid="cadastro-preferencia" className="flex h-12 w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary rounded-none text-foreground">
                    <option value="">Selecione sua preferência...</option>
                    <option value="masculino">Fragrâncias Masculinas</option>
                    <option value="feminino">Fragrâncias Femininas</option>
                    <option value="ambos">Ambas as categorias</option>
                  </select>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <input
                    data-testid="cadastro-aceite"
                    type="checkbox"
                    id="aceite"
                    required
                    className="mt-1 accent-[hsl(var(--primary))]"
                  />
                  <label htmlFor="aceite" className="text-xs text-muted-foreground font-light leading-relaxed">
                    Concordo em receber comunicações exclusivas da Al Majd Perfumaria, incluindo promoções, lançamentos e novidades. Posso cancelar a qualquer momento.
                  </label>
                </div>

                <Button
                  data-testid="cadastro-submit"
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 font-serif tracking-widest uppercase rounded-none"
                >
                  Criar Meu Cadastro
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8 space-y-6"
              >
                <div className="w-20 h-20 border border-primary/40 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={40} className="text-primary" />
                </div>
                <h3 className="text-3xl font-serif text-white">Cadastro Realizado</h3>
                <div className="w-12 h-px bg-primary mx-auto" />
                <p className="text-muted-foreground font-light max-w-sm mx-auto">
                  Bem-vindo ao Círculo Al Majd. Você receberá em breve um email de boas-vindas com suas vantagens exclusivas.
                </p>
                <Button
                  onClick={() => { window.location.href = "#colecao"; }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-serif tracking-widest uppercase rounded-none px-10"
                >
                  Explorar a Coleção
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-32 bg-background relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-secondary/30 -skew-x-12 transform origin-top-right"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl mx-auto bg-card border border-border p-12 md:p-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif text-white mb-4">Solicite sua Encomenda</h2>
              <p className="text-muted-foreground">Devido à produção limitada, nossos perfumes são adquiridos mediante solicitação direta.</p>
            </div>

            {!contatoSubmitted ? (
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setContatoSubmitted(true); }}>
                <div className="space-y-2">
                  <label className="text-sm tracking-wider uppercase text-muted-foreground">Nome Completo</label>
                  <Input 
                    required
                    value={contatoForm.nome}
                    onChange={e => setContatoForm({...contatoForm, nome: e.target.value})}
                    data-testid="input-name" 
                    className="bg-background border-border focus-visible:ring-primary h-12 rounded-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm tracking-wider uppercase text-muted-foreground">Email</label>
                  <Input 
                    required
                    type="email" 
                    value={contatoForm.email}
                    onChange={e => setContatoForm({...contatoForm, email: e.target.value})}
                    data-testid="input-email" 
                    className="bg-background border-border focus-visible:ring-primary h-12 rounded-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm tracking-wider uppercase text-muted-foreground">Fragrância Desejada</label>
                  <select 
                    required
                    value={contatoForm.fragrancia}
                    onChange={e => setContatoForm({...contatoForm, fragrancia: e.target.value})}
                    data-testid="select-fragrance" 
                    className="flex h-12 w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary rounded-none text-foreground"
                  >
                    <option value="" hidden>Selecione uma fragrância...</option>
                    <optgroup label="— Masculinos —">
                      {collections.filter(c => c.gender === "masculino").map(c => (
                        <option key={c.id} value={c.id}>{c.name} — {c.price}</option>
                      ))}
                    </optgroup>
                    <optgroup label="— Femininos —">
                      {collections.filter(c => c.gender === "feminino").map(c => (
                        <option key={c.id} value={c.id}>{c.name} — {c.price}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm tracking-wider uppercase text-muted-foreground">Mensagem (Opcional)</label>
                  <Textarea 
                    value={contatoForm.mensagem}
                    onChange={e => setContatoForm({...contatoForm, mensagem: e.target.value})}
                    data-testid="input-message" 
                    className="bg-background border-border focus-visible:ring-primary min-h-[120px] rounded-none" 
                  />
                </div>
                <Button data-testid="button-submit" type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 font-serif tracking-widest uppercase rounded-none mt-4">
                  Enviar Solicitação
                </Button>
              </form>
            ) : (
              <div className="text-center py-10 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-serif text-white">Solicitação Enviada</h3>
                <p className="text-muted-foreground font-light">Entraremos em contato em breve para finalizar sua reserva.</p>
                <Button variant="outline" onClick={() => setContatoSubmitted(false)} className="mt-4 border-primary text-primary hover:bg-primary/10 rounded-none">Nova Solicitação</Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/5511999999999?text=Olá!%20Tenho%20interesse%20nos%20perfumes%20Al%20Majd."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-[#25D366] text-white pl-4 pr-5 py-3 shadow-2xl shadow-black/40 group transition-all duration-300 hover:shadow-[#25D366]/30 hover:scale-105"
        aria-label="Fale conosco pelo WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 flex-shrink-0"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.532 5.845L.057 23.486a.5.5 0 0 0 .612.612l5.726-1.462A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.803 9.803 0 0 1-5.028-1.382l-.36-.213-3.4.868.896-3.307-.235-.38A9.802 9.802 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
        </svg>
        <span className="text-sm font-light tracking-wide whitespace-nowrap">Fale Conosco</span>
      </a>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-6 text-center flex flex-col items-center">
          <div className="font-serif text-2xl tracking-widest text-primary mb-6">AL MAJD</div>
          <p className="text-muted-foreground text-sm font-light">
            &copy; {new Date().getFullYear()} Al Majd Perfumaria. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
