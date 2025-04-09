import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      name?: string;
      isAdmin?: boolean; // ← Add this
    };
  }
}

export type MenuType = {
  id: string;
  slug: string;
  title: string;
  desc?: string;
  img?: string;
  color: string;
}[];

export type ProductType = {
  id: string;
  title: string;
  desc?: string;
  img?: string;
  price: number;
  options?: { title: string; additionalPrice: number }[];
}[];

// type singleOrderProduct = {
//   title: string;
// };

export type cartItemType = {
  id: string;
  title: string;
  desc?: string;
  img?: string;
  price: number;
  options?: { title: string; additionalPrice: number };
};

export type OrderType = {
  id: string;
  title: string;
  createdAt: number;
  products: cartItemType[];
  price: number;
  status: string;
}[];

export type ActionTypes = {
  addToCart: (item: cartItemType) => void;
  removeFromCart: (item: cartItemType) => void;
};

// For cart

export type CartProduct = {
  id: string;
  title: string;
  price: number;
  img?: string;
  selectedTitle: string;
  quantity: number;
  userEmail: string;
  // Add more fields as needed
};
export type CartState = {
  products: CartProduct[];
};
