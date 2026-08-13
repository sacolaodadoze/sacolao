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

import { zodResolver } from "@hookform/resolvers/zod"; //validaciones
import { schema } from "../../../forms/productsForm.js";

export function Products() {
  const { showNotification } = useNotification();
  const [products, setProducts] = useState(productsData);
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingSync, setLoadingSync] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [unit, setUnit] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  //Paginado
  const [currentPage, setCurrentPage] = useState(1);
  // const [lastPage, setLastPage] = useState(1); //
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);

  const handleChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, [field]: value } : product,
      ),
    );
  };

  const isConfigured = (product) => {
    if (product.unit === "KG") {
      return !!product.category_id && product.average_weight > 0;
    }
    return !!product.category_id;
  };

  const loadProducts = async (
    perPage,
    currentPage,
    searchValue = search,
    categoryValue = categoryId,
    unitValue = unit,
    statusValue = statusFilter,
  ) => {
    setLoading(true);
    try {
      const res = await apiFetch(
        `/api/products?page=${currentPage}&per_page=${perPage}&search=${searchValue}&category_id=${categoryValue}&unit=${unitValue}&status=${statusValue}`,
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

  const loadCategories = async () => {
    try {
      const res = await apiFetch("/api/categories");

      const data = await res.json();
      //console.log("Categories", data);
      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(perPage, currentPage);
  }, [currentPage, perPage]);

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSaveProduct = async (product) => {
    //console.log(product);
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
        await loadProducts(
          perPage,
          currentPage,
          search,
          categoryId,
          unit,
          statusFilter,
        );
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

    await loadProducts(perPage, 1, search, categoryId, unit);
  };

  const handleClear = async () => {
    setSearch("");
    setCategoryId("");
    setCurrentPage(1);
    setUnit("");
    setStatusFilter("");
    await loadProducts(perPage, 1, "", "", "", "");
  };

  if (loadingSync /*  || loadingSave */) {
    return <Loader />;
  }
  // console.log(categories);
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

        <div /* className="sticky-header" */>
          <Box
            className="filters"
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
              sx={{ width: 300 }}
            />

            <Select
              size="small"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              displayEmpty
              /*  sx={{ minWidth: 220 }} */
            >
              <MenuItem value="">Categorias</MenuItem>

              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>

            <Select
              size="small"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              displayEmpty
              sx={{ textAlign: "center" }}
            >
              <MenuItem value="">Unidade</MenuItem>
              <MenuItem value="UN">UN</MenuItem>
              <MenuItem value="KG">KG</MenuItem>
            </Select>

            <Select
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              textAlign="center"
              displayEmpty
            >
              <MenuItem value="">Estado</MenuItem>
              <MenuItem value="configured">
                <Chip label="✓" color="success" size="small" />
              </MenuItem>
              <MenuItem value="pending">
                <Chip label="⚠" color="warning" size="small" />
              </MenuItem>
            </Select>

            <Button
              variant="contained"
              size="small"
              startIcon={<SearchIcon />}
              sx={{
                borderRadius: "12px",
              }}
              onClick={handleSearch}
            >
              {LANG.PRODUCTS.SEARCH}
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ClearIcon />}
              sx={{
                borderRadius: "12px",
              }}
              onClick={handleClear}
            >
              {LANG.PRODUCTS.CLEAN}
            </Button>
          </Box>
        </div>

        {/* Table */}
        <Box sx={{ position: "relative" }}>
          {(loading || loadingSave) && (
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
            {/*   <div className="sticky-header-table"> */}
                <thead >
                  <tr>
                    {/* <th>Código</th> */}
                    <th style={{ width: "93px" }}>Imagen</th>
                    <th>Produto</th>
                    <th style={{ width: "190px" }}>Categoria</th>
                    <th style={{ width: "101px" }}>Unidade</th>
                    <th style={{ width: "100px" }}>Peso medio</th>
                    <th style={{ width: "90px" }}>Preço</th>

                    {/*  <th style={{ width: "107px" }}>Estoque</th> */}
                    {/*  <th style={{ width: "80px" }}>Ativo</th> */}
                    <th style={{ width: "90px" }}>Ações</th>
                    <th style={{ width: "94px" }}>Estado</th>
                  </tr>
                </thead>
              {/* </div> */}
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
                        loading="lazy"
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
                    <td style={{ textAlign: "center" }}>{product.unit}</td>
                    <td style={{ textAlign: "center" }}>
                      {/* {product.average_weight} */}
                      {/*       <TextField
                        //  value={product.average_weight?.toFixed(2) || ""}
                        value={
                          Number(product.average_weight)
                            ? Number(product.average_weight).toFixed(2)
                            : ""
                        }
                        type="number"
                        disabled={product.unit !== "KG"}
                        onChange={(e) =>
                          handleChange(
                            product.id,
                            "average_weight",
                            e.target.value,
                          )
                        }
                        size="small"
                        sx={{
                          "& input[type=number]": {
                            MozAppearance: "textfield",
                          },
                          "& input[type=number]::-webkit-outer-spin-button": {
                            WebkitAppearance: "none",
                            margin: 0,
                          },
                          "& input[type=number]::-webkit-inner-spin-button": {
                            WebkitAppearance: "none",
                            margin: 0,
                          },
                        }}
                      /> */}
                      <TextField
                        value=  /*  {new Intl.NumberFormat("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format( product.average_weight || "")} */
                          { product.average_weight || ""} 
                        type="number"
                        disabled={product.unit !== "KG"}
                        onChange={(e) => {
                          const weight = e.target.value;
                          handleChange(product.id, "average_weight", weight);
                          if (weight === "" || isNaN(Number(weight))) {
                            handleChange(product.id, "calculated_price", "");
                            return;
                          }

                          const calculatedPrice =
                            product.unit === "KG"
                              ? (Number(product.price) * Number(weight)) /* /
                                  1000 */
                                  .toFixed(2)
                              : product.price;

                          handleChange(
                            product.id,
                            "calculated_price",
                            calculatedPrice,
                          ); // precio estimado
                        }}
                        size="small"
                        sx={{
                          "& input[type=number]": {
                            MozAppearance: "textfield",
                          },
                          "& input[type=number]::-webkit-outer-spin-button": {
                            WebkitAppearance: "none",
                            margin: 0,
                          },
                          "& input[type=number]::-webkit-inner-spin-button": {
                            WebkitAppearance: "none",
                            margin: 0,
                          },
                        }}
                      />
                    </td>
                    <td style={{ textAlign: "center" }}>
                      R${" "}
                      {product.calculated_price !== undefined &&
                      product.calculated_price !== ""
                        ? Number(product.calculated_price).toLocaleString(
                            "pt-BR",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )
                        : product.unit === "KG"
                          ? Number(product.price_per_unit).toLocaleString(
                              "pt-BR",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )
                          : Number(product.price).toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                    </td>

                    {/*     <td
                      style={{
                        textAlign: "center",
                        color: product.stock <= 0 ? "red" : "inherit",
                        fontWeight: product.stock <= 0 ? "bold" : "normal",
                      }}
                    >
                      {product.stock}
                    </td> */}

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

                    {/*  <td>
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
                    </td> */}

                    {/*   <td>
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
                    </td> */}

                    <td>
                      <IconButton
                        color="primary"
                        size="small"
                        sx={{
                          //color: "#64748b",
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
                        color="primary"
                        size="small"
                        sx={{
                          //color: "#64748b",
                          "&:hover": {
                            backgroundColor: "#14532d",
                            color: "#fff",
                          },
                        }}
                        onClick={() => {
                          handleSaveProduct(product);
                        }}
                        disabled={!isConfigured(product)}
                      >
                        <SaveIcon />
                      </IconButton>

                      {/*  <IconButton color="error" size="small">
                      <DeleteIcon />
                    </IconButton> */}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {isConfigured(product) ? (
                        <Tooltip title="Configurado" arrow>
                          <Chip label="✓" color="success" size="small" />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Pendente" arrow>
                          <Chip label="⚠" color="warning" size="small" />
                        </Tooltip>
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
