import { useEffect, useState, useRef } from "react";
import "./Product.css";
import { Grid, Box, Typography } from "@mui/material";

import { ProductCard } from "../components/ProductCard.jsx";
import { apiFetch } from "../api/apiFetch.js";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../components/Loader.jsx";

export function Products({ selectedCategory,selectedParentCategory, headerHeight }) {
  const categoryRefs = useRef({});

  const loadProducts = async () => {
    const res = await apiFetch("/api/store/products");
    const data = await res.json();
    return data.data ?? data;
  };

  //Esto maneja la carga de productos usando react-query para manejar el estado de carga y errores
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: loadProducts, // función que llama a la API
    staleTime: 1000 * 60 * 15, // considera los datos frescos por 15 minutos
    refetchOnMount: false, //  no refetchea cuando el componente se monta si los datos están frescos
  });
//console.log(products)
    // filtrar productos si hay categoría padre seleccionada
  const visibleProducts = selectedParentCategory
    ? products.filter((product) =>
        selectedParentCategory.children.some(
          (child) => child.id === product.category?.id
        )
      )
    : products;

  const groupedProducts = visibleProducts.reduce((acc, product) => {
    const id = product.category?.id || 0;
    const categoryName = product.category?.name || "Sem categoria";

    if (!acc[id]) {
      acc[id] = {
        categoryName,
        products: [],
      };
    }

    acc[id].products.push(product); 

    return acc;
  }, {});

  //Scroll
  const getOffsetTop = (element) => {
    let top = 0;
    while (element) {
      top += element.offsetTop;
      element = element.offsetParent;
    }
    return top;
  };

  useEffect(() => {
    if (!selectedCategory) return;
    const timer = setTimeout(() => {
      const element = categoryRefs.current[selectedCategory];
      if (!element) return;

      const elementTop = getOffsetTop(element);
      
      document.body.scrollTo({
        top: elementTop - headerHeight - 16,
        behavior: "smooth",
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedCategory, headerHeight]);

  if (isLoading) return <Loader/>;
  if (isError) return <p>Error al cargar productos</p>;

  return (
    <Box sx={{ p: 3 }}>
      {/*    <Typography variant="h4" sx={{ mb: 3 }}>
        Produtos
      </Typography> */}

      {Object.entries(groupedProducts).map(([categoryId, group]) => (
        <Box
          key={categoryId}
          ref={(el) => (categoryRefs.current[categoryId] = el)}
          sx={{
            mb: 6 /* 
             scrollMarginTop: `${headerHeight}px` */, //  20px de margen
          }}
        >
          <Typography
            variant="h5"
            className="page-title"
            /* sx={{
              mb: 3,
              fontWeight: 700,
            }} */
          >
            {group.categoryName}
          </Typography>

          <Box className="products-grid">
            {group.products.map((product) => (
              <ProductCard key={product.code} product={product} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
