import { render, screen, fireEvent, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Home from "../Home";
import { CartProvider } from "../../context/CartContext";
import { FavoritesProvider } from "../../context/FavoritesContext";

// Mock do scrollIntoView que não existe no JSDOM
window.HTMLElement.prototype.scrollIntoView = vi.fn();

const renderHome = () => {
  return render(
    <FavoritesProvider>
      <CartProvider>
        <Home />
      </CartProvider>
    </FavoritesProvider>
  );
};

describe("Home Page - Al Majd Perfumaria", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  it("deve renderizar o título principal da marca", () => {
    renderHome();
    const brandName = screen.getAllByText(/AL MAJD/i);
    expect(brandName.length).toBeGreaterThan(0);
  });

  it("deve exibir o popup promocional após 4 segundos", async () => {
    renderHome();
    
    // Verifica que o popup não está lá inicialmente
    expect(screen.queryByText(/10% OFF/i)).not.toBeInTheDocument();

    // Avança o tempo
    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(screen.getByText(/10% OFF na/i)).toBeInTheDocument();
  });

  it("deve fechar o popup e não mostrar novamente (localStorage)", () => {
    renderHome();
    
    act(() => {
      vi.advanceTimersByTime(4000);
    });

    const closeButton = screen.getByTestId("popup-close");
    fireEvent.click(closeButton);

    expect(screen.queryByText(/10% OFF/i)).not.toBeInTheDocument();
    expect(localStorage.getItem("almajd_promo_dismissed")).toBe("true");
  });

  it("deve filtrar perfumes por gênero corretamente", () => {
    renderHome();
    
    const filterMasculino = screen.getByTestId("filter-masculino");
    fireEvent.click(filterMasculino);

    // Verifica se os cards masculinos estão presentes e femininos não
    // Baseado no array de collections original
    expect(screen.getByText("Oud Al Majd")).toBeInTheDocument();
    expect(screen.queryByText("Amber Royale")).not.toBeInTheDocument();

    const filterFeminino = screen.getByTestId("filter-feminino");
    fireEvent.click(filterFeminino);

    expect(screen.getByText("Amber Royale")).toBeInTheDocument();
    expect(screen.queryByText("Oud Al Majd")).not.toBeInTheDocument();
  });
});