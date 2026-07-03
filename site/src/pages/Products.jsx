import { useEffect, useState } from "react";
import "./Product.css";
import { Grid, Box, Typography } from "@mui/material";

import { ProductCard } from "../components/ProductCard";
import { ProductC } from "../components/ProductC";
import { apiFetch } from "../api/apiFetch.js";

import { useQuery } from "@tanstack/react-query";

export function Products() { 

  const loadProducts = async () => {   
      const res = await apiFetch("/api/store/products");
      const data = await res.json();    
      return data.data ?? data;
    
  };

  //Esto maneja la carga de productos usando react-query para manejar el estado de carga y errores
  const {
    data: products=[],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: loadProducts, // función que llama a la API
    staleTime: 1000 * 60 * 15, // considera los datos frescos por 15 minutos
  });



  const groupedProducts = products.reduce((acc, product) => {
    const categoryName = product.category?.name || "Sem categoria";

    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }

    acc[categoryName].push(product);
    

    return acc;
  }, {});

  if (isLoading) return <p>Cargando productos...</p>;
  if (isError) return <p>Error al cargar productos</p>;

  return (
    <Box sx={{ p: 3 }}>
      {/*    <Typography variant="h4" sx={{ mb: 3 }}>
        Produtos
      </Typography> */}

      {Object.entries(groupedProducts).map(([categoryName, products]) => (
        <Box key={categoryName} sx={{ mb: 6 }}>
          <Typography
            variant="h5"
            className="page-title"
            /* sx={{
              mb: 3,
              fontWeight: 700,
            }} */
          >
            {categoryName}
          </Typography>

          <Box className="products-grid">
            {products.map((product) => (
              <ProductC key={product.code} product={product} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
