import { useState, useEffect, useContext } from "react";
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
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { useNotification } from "../../context/NotificationContext.jsx";
import { ProductModal } from "./EditProduct";

export function Products() {
  const { showNotification } = useNotification();
  const [products, setProducts] = useState(productsData);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingSync, setLoadingSync] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");

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

  const loadProducts = async (
    perPage,
    currentPage,
    searchValue = search,
    categoryValue = categoryId,
  ) => {
    setLoading(true);
    try {
      const res = await apiFetch(
        `/api/products?page=${currentPage}&per_page=${perPage}&search=${searchValue}&category_id=${categoryValue}`,
      );

      const data = await res.json();
      //console.log(data);
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
  }, [currentPage, perPage]);

  const handleSaveProduct = async (product) => {
    console.log(product);
    setLoadingSave(true);
    try {
      const res = await apiFetch(`/api/products/${product.id}`, {
        method: "PUT",
        body: JSON.stringify(product),
      });
      //  console.log("res:", res);
      if (res.ok) {
        const data = await res.json();
        // console.log(data);
        setOpenModal(false);
        setSelectedProduct(null);
        showNotification(LANG.PRODUCTS.SUCCESSUPD, "success");
        await loadProducts();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSave(false);
    }
  };

  const handleSync = async () => {
    setLoadingSync(true);
    try {
      const res = await apiFetch("/api/products/sync", {
        method: "PUT",
      });
      //  console.log("res:", res);
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        showNotification(LANG.PRODUCTS.SUCCESS, "success");
        await loadProducts();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSync(false);
    }
  };

  const handleSearch = async () => {
    setCurrentPage(1);

    await loadProducts(perPage, 1, search, categoryId);
  };

  const handleClear = async () => {
    setSearch("");
    setCategoryId("");
    setCurrentPage(1);
    await loadProducts(perPage, 1, "", "");
  };

  /*  if (loading || loadingSync || loadingSave) {
    return <Loader />;
  } */

  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" className="page-title">
            Produtos
          </Typography>

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

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            size="small"
            label="Buscar"
            placeholder={LANG.PRODUCTS.PLACEHOLDERSEARCH}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 350 }}
          />

          <Select
            size="small"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            displayEmpty
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">Todas as categorias</MenuItem>

            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>

          <Button
            variant="contained"
            size="small"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            /* onClick={() => {
              setCurrentPage(1);
              loadProducts(perPage, 1);
            }} */
          >
            {LANG.PRODUCTS.SEARCH}
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ClearIcon />}
            onClick={handleClear}
          >
            {LANG.PRODUCTS.CLEAN}
          </Button>
        </Box>
        
        {/* Table */}
        <Box sx={{ position: "relative" }}>
          {loading && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(255,255,255,0.7)",
                zIndex: 10,
              }}
            >
              <Loader />
            </Box>
          )}

          <TableContainer component={Paper}>
            <table className="table">
              <thead>
                <tr>
                  {/* <th>Código</th> */}
                  <th style={{ width: "93px" }}>Imagen</th>
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
                    <td
                      style={{
                        padding: "1px",
                        width: "60px",
                      }}
                    >
                      <img
                        // loading="lazy"
                        src={product.image || "/no-image.png"}
                        /*   onError={(e) => {                       
                        e.target.src = "/no-image.png";
                      }} */
                      />
                    </td>
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
                    <td style={{ textAlign: "center" }}>{product.price}</td>
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
                          handleChange(
                            product.id,
                            "price_per_kg",
                            e.target.value,
                          )
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
                      <Switch
                        checked={product.active}
                        onChange={(e) =>
                          handleChange(product.id, "active", e.target.checked)
                        }
                      />
                    </td>

                    <td>
                      <IconButton
                        // color=""
                        size="small"
                        sx={{
                          color: "#64748b",
                          "&:hover": {
                            backgroundColor: "#14532d",
                            color: "#fff",
                          },
                        }}
                        onClick={() => {
                          setSelectedProduct(product);
                          setOpenModal(true);
                        }}
                      >
                        <SettingsIcon />
                      </IconButton>

                      {/* Save */}
                      <IconButton
                        color="disabled"
                        size="small"
                        sx={{
                          color: "#64748b",
                          "&:hover": {
                            backgroundColor: "#14532d",
                            color: "#fff",
                          },
                        }}
                        onClick={() => {
                          handleSaveProduct(product);
                        }}
                      >
                        <SaveIcon />
                      </IconButton>

                      {/*  <IconButton color="error" size="small">
                      <DeleteIcon />
                    </IconButton> */}
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
