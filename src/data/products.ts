// src/data/products.ts
export type Gender = "masculino" | "feminino" | "unissex";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  priceNum: number;
  image: string;
  gender: Gender;
  notes: string;
};

export const collections: Product[] = [
  {
    id: "oud-al-majd",
    name: "Oud Al Majd",
    description: "O rei dos ouds. Intenso, amadeirado e inesquecível.",
    price: "R$ 459",
    priceNum: 459,
    image: "/images/oud-al-majd.png",
    gender: "masculino",
    notes: "Oud · Âmbar · Baunilha"
  },
  {
    id: "sultan-al-layl",
    name: "Sultan Al Layl",
    description: "Elegância noturna com notas florais e especiarias nobres.",
    price: "R$ 399",
    priceNum: 399,
    image: "/images/sultan-al-layl.png",
    gender: "unissex",
    notes: "Rosa · Açafrão · Sândalo"
  },
  {
    id: "nour",
    name: "Nour",
    description: "Luz e pureza. Uma fragrância floral luminosa e sofisticada.",
    price: "R$ 429",
    priceNum: 429,
    image: "/images/nour.png",
    gender: "feminino",
    notes: "Jasmim · Flor de Laranjeira · Baunilha"
  },
  {
    id: "rose-baghdad",
    name: "Rose Baghdad",
    description: "Rosa intensa de Baghdad. Sedutora e apaixonante.",
    price: "R$ 419",
    priceNum: 419,
    image: "/images/rose-baghdad.png",
    gender: "feminino",
    notes: "Rosa Vermelha · Açafrão · Patchouli"
  },
  {
    id: "yasmin-al-sham",
    name: "Yasmin Al Sham",
    description: "Jasmim de Damasco. Fresco, puro e encantador.",
    price: "R$ 389",
    priceNum: 389,
    image: "/images/yasmin-al-sham.png",
    gender: "feminino",
    notes: "Jasmim · Lírio · Almíscar Branco"
  },
  {
    id: "night-orion",
    name: "Night Orion",
    description: "Mistério estrelado da noite. Fresco e profundo.",
    price: "R$ 449",
    priceNum: 449,
    image: "/images/night-orion.png",
    gender: "masculino",
    notes: "Íris · Âmbar · Cedro"
  },
  {
    id: "al-asad",
    name: "Al Asad - The Lion",
    description: "Poderoso e majestoso como um leão do deserto.",
    price: "R$ 479",
    priceNum: 479,
    image: "/images/al-asad.png",
    gender: "masculino",
    notes: "Bergamota · Cedro · Couro"
  },
  {
    id: "gumary",
    name: "Gumary",
    description: "Luxo cristalino. Elegância dourada e refinada.",
    price: "R$ 459",
    priceNum: 459,
    image: "/images/amber-royale.png", // usando a imagem que você enviou
    gender: "unissex",
    notes: "Âmbar · Mel · Baunilha"
  },
  {
    id: "trandomo",
    name: "Trandomo",
    description: "Moderno e misterioso. Sedução contemporânea.",
    price: "R$ 409",
    priceNum: 409,
    image: "/images/desert-musk.png",
    gender: "masculino",
    notes: "Almíscar · Sândalo · Couro"
  },
  {
    id: "khashab",
    name: "Khashab",
    description: "Madeira nobre do deserto. Quente e autêntico.",
    price: "R$ 399",
    priceNum: 399,
    image: "/images/khashab.png",
    gender: "masculino",
    notes: "Sândalo · Oud · Cedro"
  },
  {
    id: "laylat-al-qadr",
    name: "Laylat Al Qadr",
    description: "Noite do Destino. Doce, floral e espiritual.",
    price: "R$ 435",
    priceNum: 435,
    image: "/images/laylat-al-qadr.png",
    gender: "feminino",
    notes: "Jasmim · Rosa · Âmbar"
  }
];

export default collections;