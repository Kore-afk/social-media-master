import React from 'react';
import AddProducts from '../../components/addProducts/AddProducts';
import Products from '../../components/Products/Products';
import { ProductsContextProvider } from '../../Global/ProductsContext';

const Marketplace: React.FC = () => {
  console.log('Rendering Marketplace component');

  return (
    <ProductsContextProvider>
      <div className="marketplace">
        <AddProducts />
        <Products />
      </div>
    </ProductsContextProvider>
  );
};

export default Marketplace;
