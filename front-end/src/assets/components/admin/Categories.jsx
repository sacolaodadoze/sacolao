import { useState, useEffect, use } from "react";

import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { CreateCategory } from "./CreateCategory.jsx";
import { useNotification } from "../../context/NotificationContext.jsx";
import { apiFetch } from "../../../api/apiFetch.js";
import { Loader } from "./Loader.jsx";

export function Categories() {
  const [loading, setLoading] = useState(false);
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [categories, setCategories] = useState([
    /* 
    {
      id: 1,
      name: "Frutas",
      slug: "frutas",
      position: 1,
      active: true,
    },
    {
      id: 2,
      name: "Verduras",
      slug: "verduras",
      position: 2,
      active: true,
    },
    {
      id: 3,
      name: "Bebidas",
      slug: "bebidas",
      position: 3,
      active: false,
    }, */
  ]);
  const { showNotification } = useNotification();

  const handleActiveChange = (id) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id
          ? { ...category, active: !category.active }
          : category,
      ),
    );
  };

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await apiFetch("/api/categories");

        const data = await res.json();
        // console.log(data);

        if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleEdit = (category) => {
    console.log("Editar:", category);
  };

  const handleDelete = (id) => {
    console.log("Eliminar:", id);
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
            mb: 3,
          }}
        >
          <Typography variant="h5">Categorias</Typography>

          <Button
            variant="outlined"
            size="small"
            sx={{
              alignSelf: "flex-end",
              borderColor: "#f97316",
              color: "#f97316",
              borderRadius: "12px",
              "&:hover": {
                backgroundColor: "#f97316",
                color: "#fff",
                opacity: 0.9,
              },
            }}
            onClick={() => setOpenAddCategory(true)}
          >
            + Adicionar categoria
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Ordem</TableCell>
                <TableCell>Ativa</TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>

                  <TableCell>{category.slug}</TableCell>

                  <TableCell>{category.position}</TableCell>

                  <TableCell>
                    <Switch
                      checked={category.active}
                      onChange={() => handleActiveChange(category.id)}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(category)}>
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(category.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhuma categoria cadastrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <CreateCategory
        open={openAddCategory}
        onClose={() => setOpenAddCategory(false)}
        onSubmit={(data) => {
          console.log(data);

          // POST /api/categories

          setOpenAddCategory(false);
        }}
      />
    </>
  );
}
