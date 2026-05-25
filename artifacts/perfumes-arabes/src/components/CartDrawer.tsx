import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count } = useCart();
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    closeCart();
    setLocation("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-primary" />
                <h2 className="font-serif text-lg text-white tracking-wider">
                  Carrinho
                  {count > 0 && (
                    <span className="ml-2 text-sm text-primary font-light">({count})</span>
                  )}
                </h2>
              </div>
              <button
                data-testid="cart-close"
                onClick={closeCart}
                className="text-muted-foreground hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-20">
                  <ShoppingBag size={48} className="text-muted-foreground/30" />
                  <p className="text-muted-foreground font-light">Seu carrinho está vazio.</p>
                  <button
                    onClick={closeCart}
                    className="text-xs tracking-widest uppercase text-primary hover:underline"
                  >
                    Explorar a Coleção
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4 border-b border-border/50 pb-6"
                    >
                      <div className="w-20 h-28 flex-shrink-0 bg-background border border-border overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] tracking-widest uppercase text-muted-foreground/60 mb-1">{item.notes}</p>
                          <h3 className="font-serif text-white text-base">{item.name}</h3>
                          <p className="text-primary font-serif text-sm mt-1">
                            R$ {(item.priceNum * item.quantity).toLocaleString("pt-BR")}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 border border-border">
                            <button
                              data-testid={`qty-minus-${item.id}`}
                              onClick={() => updateQty(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-sm text-white">{item.quantity}</span>
                            <button
                              data-testid={`qty-plus-${item.id}`}
                              onClick={() => updateQty(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            data-testid={`remove-${item.id}`}
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground/50 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-8 py-6 border-t border-border space-y-4 bg-card">
                <div className="flex items-center justify-between">
                  <span className="text-sm tracking-wider uppercase text-muted-foreground">Total</span>
                  <span className="font-serif text-xl text-white">
                    R$ {total.toLocaleString("pt-BR")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground/50 font-light">Frete calculado no checkout</p>
                <Button
                  data-testid="cart-checkout"
                  onClick={handleCheckout}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 font-serif tracking-widest uppercase rounded-none"
                >
                  Finalizar Compra
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
