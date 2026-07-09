import { useEffect, useState, useRef } from "react";
import "./Product.css";
import { Grid, Box, Typography } from "@mui/material";

import { ProductCard } from "../components/ProductCard";
import { ProductC } from "../components/ProductC";
import { apiFetch } from "../api/apiFetch.js";

import { useQuery } from "@tanstack/react-query";

export function Products({ selectedCategory, headerHeight }) {
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
  });

  useEffect(() => {
    if (!selectedCategory) return;
    //  console.log("selectedCategory:", selectedCategory);
    //console.log("refs:", categoryRefs.current);

    const element = categoryRefs.current[selectedCategory];
    // console.log("element:", element);

    /*  if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 140; // altura del header

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    } */
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [selectedCategory]);

  //console.log("selectedCategory", selectedCategory);

  const groupedProducts = products.reduce((acc, product) => {
    const id = product.category?.id || 0;
    const categoryName = product.category?.name || "Sem categoria";

    if (!acc[id]) {
      acc[id] = {
        categoryName,
        products: [],
      };
    }

    acc[id].products.push(product);

    /*     if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(product); */

    return acc;
  }, {});


useEffect(() => {
  if (!selectedCategory) return;

  const timer = setTimeout(() => {
    const element = categoryRefs.current[selectedCategory];

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 500);

  return () => clearTimeout(timer);
}, [selectedCategory]);


  if (isLoading) return <p>Cargando productos...</p>;
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
          sx={{ mb: 6,
             scrollMarginTop: `${headerHeight}px` //  20px de margen
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
              <ProductC key={product.code} product={product} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
