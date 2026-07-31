import "./ProductCard.css";
import { useContext, useState } from "react";
import { Chip, Typography, Box } from "@mui/material";
import { useCart } from "../context/CartContext.jsx";
import { ProductModal } from "./ProductModal";

export function ProductCard({ product }) {
  const [openModal, setOpenModal] = useState(false);

  const { cartItems, addToCart, updateQuantity } = useCart();

  const cartItem = cartItems.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity ?? 0;

  //console.log(product);
  // console.log(product.category);
  return (
    <section /* className="component-section" */>
      {/*  <h2 className="section-title">{product.name}</h2>  */}
      <div className="product-card" onClick={() => setOpenModal(true)}>
        {/*   {product.new_product && <span className="benefit-tag">+ Vendido</span>} */}
        {/*  <div className="product-badges"> */}
        {/*   {product.new_product && (
            <Chip
              size="small"
             
              className="product-chip"
              label="🆕 Novidade"
            />
          )} */}

        {product.promotion && (
          <Box
            // size="small"
            className="product-badge"
            /*  // label="🔥"
              sx={{
                boxShadow: "none",
                border: "none",
              }} */
          >
            🔥Promoção
          </Box>
        )}

        {/*   {product.feature && (
            <div           
              className="product-badge"             
            >
            "Destaque ⭐"
            </div>
          )}

          
          {product.week_offer && (
            <Chip
              size="small"
             
              className="product-chip"
              label="Oferta"
            />
          )} */}
        {/* </div> */}

        <div className="product-image-container">
          <img src={product.image || "/no-image.png"} />
        </div>
        <div className="product-info">
          {/*  <span className="product-category">
            {" "}
            {product.category != null ? product.category.name : ""}
          </span> */}
          {/*  <h3 className="product-title"></h3> */}
          <h3 className="product-title">{product.name}</h3>
          <Box className="product-tags">
            {product.featured && <span>⭐ Destaque</span>}
            {product.featured && product.new_product && <span>•</span>}
            {product.new_product && <span>🆕 Novidade</span>}
          </Box>

          <p className="product-description">
            {product.description != null ? product.description : ""}
          </p>

          <div className="product-price-row">
            <span className="product-price">
              R${" "}
              {new Intl.NumberFormat("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(product.price)}
            </span>
            {quantity > 0 ? (
              <div className="qty-controls">
                <button
                  onClick={(e) => {
                    e.stopPropagation;
                    updateQuantity(product.id, -1);
                  }}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation;
                    updateQuantity(product.id, 1);
                  }}
                >
                  +
                </button>
              </div>
            ) : (
              <button
                className="btn-add-cart"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
              >
                +
              </button>
            )}
          </div>
        </div>
      </div>

      <ProductModal
        product={product}
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </section>
  );
}
