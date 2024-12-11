import React, { createContext, useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

interface Product {
  ProductID: string;
  ProductName: string;
  ProductPrice: number;
  ProductDescription: string;
  ProductImg: string;
  UserName: string;
  UserId: string;
}

interface ProductsContextType {
  products: Product[];
}

export const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsContextProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const productsCollection = collection(db, 'Products');
    const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
      const productsData: Product[] = [];
      snapshot.forEach((doc) =>
        productsData.push({
          ProductID: doc.id,
          ProductName: doc.data().ProductName,
          ProductPrice: doc.data().ProductPrice,
          ProductDescription: doc.data().ProductDescription,
          ProductImg: doc.data().ProductImg,
          UserName: doc.data().UserName,
          UserId: doc.data().UserId,
        })
      );
      setProducts(productsData);
    });

    return () => unsubscribe();
  }, []);

  return <ProductsContext.Provider value={{ products }}>{children}</ProductsContext.Provider>;
};