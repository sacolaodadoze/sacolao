import { useState, useEffect, use } from "react";
import { useForm, Controller } from "react-hook-form";

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
import AddIcon from "@mui/icons-material/Add";
import { CategoryModal } from "./CategoryModal.jsx";
import { useNotification } from "../../context/NotificationContext.jsx";
import { apiFetch } from "../../../api/apiFetch.js";
import { Loader } from "./Loader.jsx";
import { LANG } from "../../constants/languages.js";
import Swal from "sweetalert2";

export function Categories() {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { showNotification } = useNotification();
  const [active, setActive] = useState(null);

  const loadCategories = async () => {
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

  useEffect(() => {
    loadCategories();
  }, []);

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setOpenModal(true);
  };

  const categoriesForTable = categories.flatMap((category) => [
    category,
    ...(category.children || []),
  ]);

  const handleSaveCategory = async (data) => {
    console.log(data);
    try {
      // await apiFetch("/sanctum/csrf-cookie");

      if (selectedCategory) {
        const response = await apiFetch(
          `/api/categories/${selectedCategory.id}`,
          {
            method: "PUT",
            body: JSON.stringify(data),
          },
        );
        if (response.ok) {
          showNotification(LANG.CATEGORIES.SUCCESSEDIT, "success");
          await loadCategories();
          setOpenModal(false);
          setSelectedCategory(null);
        } else {
          showNotification(LANG.CATEGORIES.ERROREDIT, "error");
        }
      } else {
        const response = await apiFetch("/api/categories", {
          method: "POST",
          body: JSON.stringify(data),
        });
        if (response.ok) {
          setOpenModal(false);
          await loadCategories();
          showNotification(LANG.CATEGORIES.SUCCESSADD, "success");
          setSelectedCategory(null);
        } else {
          showNotification(LANG.CATEGORIES.ERRORADD, "error");
        }
      }
    } catch (error) {
      console.error(error);
      showNotification("Aconteceu um error", "error");
    }
  };

  const handleActiveChange = async (category) => {
    setActive(category.id);
    try {
      await apiFetch(`/api/categories/${category.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...category,
          active: !category.active,
        }),
      });

      setCategories((prev) =>
        prev.map((c) =>
          c.id === category.id ? { ...c, active: !c.active } : c,
        ),
      );
      setActive(null);
    } catch (error) {
      console.error(error);
      setActive(null);
    }
  };

  const handleDelete = async (id) => {
    const deleteMessage = await Swal.fire({
      title: LANG.CATEGORIES.TITLE,
      text: LANG.CATEGORIES.TEXT,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: LANG.CATEGORIES.CONFIRM,
      cancelButtonText: LANG.GLOBAL.CANCEL,
    });

    if (deleteMessage.isConfirmed) {
      try {
        const response = await apiFetch(`/api/categories/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          await loadCategories();
          showNotification(
            LANG.CATEGORIES.NOTIFICATIONS_CATEGORY_DELETED,
            "success",
          );
        }
      } catch (error) {
        console.error(error);
        showNotification(LANG.GLOBAL.ERROR, "error");
      }
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
            mb: 3,
          }}
        >
          <Typography variant="h5" className="page-title">
            {LANG.CATEGORIES.CATEGORIES}
          </Typography>

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
            onClick={() => {
              setSelectedCategory(null);
              setOpenModal(true);
            }}
          >
            <AddIcon fontSize="small" /> {LANG.CATEGORIES.CATEGORY}
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <thead>
              <tr>
                <th>{LANG.CATEGORIES.CATEGORY}</th>
                <th>{LANG.CATEGORIES.SLUG}</th>
                <th>{LANG.CATEGORIES.ORDER}</th>
                <th>{LANG.CATEGORIES.ACTIVE}</th>
                <th align="right">{LANG.CATEGORIES.ACTIONS}</th>
              </tr>
            </thead>

            <tbody>
              {/*  {categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    {category.parent?.name && `${category.parent.name} / `}
                    {category.name}
                  </td>

                  <td>{category.slug}</td>

                  <td>{category.position}</td>

                  <td>
                    <Switch
                      checked={category.active}
                      disabled={active === category.id}
                      onChange={() => handleActiveChange(category)}
                    />
                  </td>

                  <td align="right">
                    <IconButton onClick={() => handleEdit(category)}>
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(category.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))} */}

              {categoriesForTable.map((category) => (
                <tr key={category.id}>
                  <td>
                    {category.parent_id && "↳ "}
                    {category.name}
                  </td>

                  <td>{category.slug}</td>

                  <td>{category.position}</td>

                  <td>
                    <Switch
                      checked={category.active}
                      disabled={active === category.id}
                      onChange={() => handleActiveChange(category)}
                    />
                  </td>

                  <td align="right">
                    <IconButton onClick={() => handleEdit(category)}>
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(category.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}

              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} align="center">
                    Nenhuma categoria cadastrada
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </TableContainer>
      </Box>
      <CategoryModal
        open={openModal}
        initialData={selectedCategory}
        categories={categories}
        onClose={() => {
          setOpenModal(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleSaveCategory}
      />
    </>
  );
}
