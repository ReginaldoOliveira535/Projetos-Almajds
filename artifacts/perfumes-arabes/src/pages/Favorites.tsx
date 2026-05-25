import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useFavorites } from "@/context/FavoritesContext";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingCart, ChevronLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Favorites() {
  const { favorites, toggle } = useFavorites();
  const { addItem } = useCart();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-md px-6 h-20 flex items-center justify-between sticky top-0 z-40">
        <button
          data-testid="favorites-back"
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors text-sm tracking-wider"
        >
          <ChevronLeft size={16} />
          Voltar à Coleção
        </button>
        <div className="font-serif text-xl tracking-widest text-primary">AL MAJD</div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Heart size={16} className="text-primary" />
          <span>{favorites.length} {favorites.length === 1 ? "favorito" : "favoritos"}</span>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-16 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-xs tracking-[0.3em] uppercase mb-4">Sua Seleção</p>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Guia de Favoritos</h1>
          <div className="w-16 h-px bg-primary mx-auto mb-6" />
          <p className="text-muted-foreground font-light max-w-xl mx-auto">
            As fragrâncias que capturaram a sua alma. Guarde-as aqui até o momento certo de trazê-las para a sua vida.
          </p>
        </motion.div>

        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 gap-6"
          >
            <div className="w-24 h-24 border border-border flex items-center justify-center">
              <Heart size={36} className="text-muted-foreground/30" />
            </div>
            <p className="text-muted-foreground font-light text-lg">Nenhum favorito salvo ainda.</p>
            <p className="text-muted-foreground/60 text-sm font-light max-w-sm text-center">
              Explore nossa coleção e clique no coração para salvar as fragrâncias que você ama.
            </p>
            <Button
              onClick={() => setLocation("/")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-serif tracking-widest uppercase px-10 h-12"
            >
              Explorar a Coleção
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
              <AnimatePresence>
                {favorites.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    className="group"
                  >
                    {/* Image */}
                    <div className="relative aspect-[3/4] mb-6 overflow-hidden border border-border bg-card">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      />
                      {/* Gender badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className={`text-[10px] tracking-widest uppercase px-3 py-1 font-light ${
                          item.gender === "masculino"
                            ? "bg-[#1a1a2e]/80 text-[#b8a87a] border border-[#b8a87a]/40"
                            : "bg-[#1a0a0f]/80 text-[#d4a0b0] border border-[#d4a0b0]/40"
                        }`}>
                          {item.gender === "masculino" ? "Masculino" : "Feminino"}
                        </span>
                      </div>
                      {/* Remove favorite */}
                      <button
                        data-testid={`remove-fav-${item.id}`}
                        onClick={() => toggle(item)}
                        className="absolute top-4 right-4 z-10 w-9 h-9 bg-background/80 border border-border flex items-center justify-center text-primary hover:bg-red-900/30 hover:border-red-400/40 transition-all duration-200"
                        title="Remover dos favoritos"
                      >
                        <Heart size={14} fill="currentColor" />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="space-y-3 text-center">
                      <h3 className="text-2xl font-serif text-primary">{item.name}</h3>
                      <p className="text-xs tracking-widest uppercase text-muted-foreground/60 font-light">{item.notes}</p>
                      <p className="text-sm text-muted-foreground font-light leading-relaxed px-2">{item.description}</p>
                      <p className="text-lg font-serif text-white tracking-widest">{item.price}</p>

                      {/* Actions */}
                      <div className="flex gap-2 pt-1">
                        <button
                          data-testid={`fav-add-cart-${item.id}`}
                          onClick={() => addItem(item)}
                          className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-xs tracking-widest uppercase font-light transition-colors duration-200"
                        >
                          <ShoppingCart size={12} />
                          Adicionar
                        </button>
                        <button
                          data-testid={`fav-remove-${item.id}`}
                          onClick={() => toggle(item)}
                          className="w-12 flex items-center justify-center border border-border text-muted-foreground hover:border-red-400/40 hover:text-red-400 transition-all duration-200"
                          title="Remover"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Bottom CTA */}
            {favorites.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-20 border border-border bg-card p-10 text-center space-y-6"
              >
                <p className="text-primary text-xs tracking-[0.3em] uppercase">Pronto para dar o próximo passo?</p>
                <h2 className="text-2xl font-serif text-white">
                  {favorites.length === 1 ? "Sua fragrância escolhida espera por você." : `${favorites.length} fragrâncias escolhidas esperam por você.`}
                </h2>
                <div className="w-12 h-px bg-primary mx-auto" />
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => {
                      favorites.forEach(f => addItem(f));
                      setLocation("/checkout");
                    }}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none font-serif tracking-widest uppercase px-12 h-12"
                  >
                    Adicionar Tudo ao Carrinho
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/")}
                    className="border-border text-muted-foreground hover:text-white rounded-none font-serif tracking-widest uppercase px-10 h-12"
                  >
                    Continuar Explorando
                  </Button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-10 mt-20">
        <div className="container mx-auto px-6 text-center">
          <div className="font-serif text-xl tracking-widest text-primary mb-4">AL MAJD</div>
          <p className="text-muted-foreground text-sm font-light">
            &copy; {new Date().getFullYear()} Al Majd Perfumaria. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
