import { useState, useEffect } from "react";
import productsData from "../../data/products.json";
import "./Products.css";
import { LANG } from "../../constants/languages.js";
import { apiFetch } from "../../../api/apiFetch.js";
import { Loader } from "./Loader.jsx";

import {
  Box,
  Typography,
  Button,
  TableContainer,
  Paper,
  IconButton,
  Switch,
  Select,
  MenuItem,
  TextField,
  Chip,
  Tooltip,
  TablePagination,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import { ProductModal } from "./EditProduct";

export function Products() {
  const [products, setProducts] = useState(productsData);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingSync, setLoadingSync] = useState(false);
  const [loading, setLoading] = useState(false);

  //Paginado
  const [currentPage, setCurrentPage] = useState(1);
  // const [lastPage, setLastPage] = useState(1); //
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);

  const categories = [
    { id: 1, name: "Frutas" },
    { id: 2, name: "Legumes" },
    { id: 3, name: "Verduras" },
  ];

  const units = ["kg", "un", "maço", "bandeja", "caixa"];

  const handleChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, [field]: value } : product,
      ),
    );
  };

  const isConfigured = (product) => {
    return (
      product.category_id && (product.price_per_kg || product.price_per_unit)
    );
  };

  const loadProducts = async (perPage, currentPage) => {
    setLoading(true);
    try {
      const res = await apiFetch(
        `/api/products?page=${currentPage}&per_page=${perPage}`,
      );

      const data = await res.json();
      console.log(data);
      if (data) {
        setProducts(data.data);
        setTotal(data.total);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(perPage, currentPage);
  }, []);

  const handleSaveProduct = (data) => {};

  const handleSync = async () => {
    setLoadingSync(true);
    try {
      const res = await apiFetch("/api/products", {
        method: "PUT",
      });
      //  console.log("res:", res);
      if (res.ok) {
        const data = await res.json();
        // console.log(data);
        showNotification(LANG.CATEGORIES.SUCCESSEDIT, "success");
        await loadProducts();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSync(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h5">Produtos</Typography>

          <Button
            variant="outlined"
            size="small"
            sx={{
              borderColor: "#f97316",
              color: "#f97316",
              borderRadius: "12px",

              "&:hover": {
                backgroundColor: "#f97316",
                color: "#fff",
              },
            }}
            onClick={() => {
              handleSync();
            }}
          >
            Update Produtos
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <table className="table">
            <thead>
              <tr>
                {/* <th>Código</th> */}
                <th>Produto</th>
                <th style={{ width: "190px" }}>Categoria</th>
                {/*   <th style={{ width: "120px" }}>Unidade</th> */}
                <th style={{ width: "90px" }}>Preço</th>
                <th style={{ width: "125px" }}>Preço Kg</th>
                <th style={{ width: "125px" }}>Preço Un</th>
                <th style={{ width: "80px" }}>Ativo</th>
                <th style={{ width: "90px" }}>Ações</th>
                <th style={{ width: "91px" }}>Status</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  {/* <td>{product.code}</td> */}
                  <td className="product-column">{product.name}</td>

                  <td>
                    <Tooltip
                      title={
                        categories.find((c) => c.id === product.category_id)
                          ?.name || ""
                      }
                      arrow
                    >
                      <Select
                        size="small"
                        value={product.category_id || ""}
                        onChange={(e) =>
                          handleChange(
                            product.id,
                            "category_id",
                            e.target.value,
                          )
                        }
                        sx={{
                          width: "100%",
                          "& .MuiSelect-select": {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          },
                        }}
                      >
                        <MenuItem value="">Selecione</MenuItem>

                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Tooltip>
                  </td>
                  <td /* className="product-column" */>{product.price}</td>
                  {/*     <td>
                  <Select
                    size="small"
                    value={product.unit || ""}
                    onChange={(e) =>
                      handleChange(product.id, "unit", e.target.value)
                    }
                    sx={{ width: "100%" }}
                  >
                    <MenuItem value="">-</MenuItem>

                    {units.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Select>
                </td> */}

                  <td>
                    <TextField
                      size="small"
                      type="number"
                      value={product.price_per_kg || ""}
                      onChange={(e) =>
                        handleChange(product.id, "price_per_kg", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <TextField
                      size="small"
                      type="number"
                      value={product.price_per_unit || ""}
                      onChange={(e) =>
                        handleChange(
                          product.id,
                          "price_per_unit",
                          e.target.value,
                        )
                      }
                    />
                  </td>

                  <td>
                    <Switch checked={product.active} />
                  </td>

                  <td>
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => {
                        setSelectedProduct(product);
                        setOpenModal(true);
                      }}
                    >
                      <SettingsIcon />
                    </IconButton>

                    <IconButton color="error" size="small">
                      <DeleteIcon />
                    </IconButton>
                  </td>
                  <td>
                    {isConfigured(product) ? (
                      <Chip label="✓" color="success" size="small" />
                    ) : (
                      <Chip label="…" color="warning" size="small" />
                    )}
                  </td>
                  {/* ⚠ */}
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    Nenhum produto cadastrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </TableContainer>
      </Box>
      <ProductModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSaveProduct}
        product={selectedProduct}
      />

      <TablePagination
        component="div"
        labelRowsPerPage={LANG.ORDERSLIST.PERPAGE}
        count={total}
        page={currentPage - 1} // MUI base 0
        rowsPerPage={perPage}
        onPageChange={(event, currentPage) => setCurrentPage(currentPage + 1)}
        onRowsPerPageChange={(event) => {
          const newPerPage = parseInt(event.target.value, 10);
          setPerPage(newPerPage);
          setCurrentPage(1);
        }}
        rowsPerPageOptions={[10, 20, 50, 100]}
      />
    </>
  );
}
