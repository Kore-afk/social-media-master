import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductsContext } from '../../Global/ProductsContext';
import { onSelectChat } from '../../utils/onSelectChat';
import { useAppDispatch } from '../../hooks/redux-hooks';
import { setCurrentChat } from '../../redux/currentChat/slice';

const Products: React.FC = () => {
  const { products } = useContext(ProductsContext);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleContactSeller = async (userId: string) => {
    dispatch(setCurrentChat({ chatID: userId, userID: userId }));
    await onSelectChat(userId);
    navigate('/messenger');
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  return (
    <>
      {products.length !== 0 && <h1>Products</h1>}
      <div className="products-container">
        {products.length === 0 && <div>slow internet...no products to display</div>}
        {products.map((product) => (
          <div className="product-card" key={product.ProductID}>
            <div className="product-img">
              <img src={product.ProductImg} alt="not found" />
            </div>
            <div className="product-name">{product.ProductName}</div>
            <div className="product-price">MXN {product.ProductPrice}.00</div>
            <div className="product-description">{product.ProductDescription}</div>
            <div className="product-user">Published by: {product.UserName}</div>
{/*             <button
              onClick={() => handleContactSeller(product.UserId)}
              className="btn btn-primary"
            >
              
            </button> */}
            <button
              onClick={() => handleViewProfile(product.UserId)}
              className="btn btn-secondary"
            >
              Contactar Vendedor
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Products;