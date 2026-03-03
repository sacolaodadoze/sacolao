import Swal from "sweetalert2";
import { LANG } from "../constants/languages.js";
import { useNotification } from "../context/NotificationContext.jsx"; //msg de info
import { apiFetch } from "../../api/apiFetch.js";

export function useDeleteOrder() {
  const { showNotification } = useNotification();

  const deleteOrder = async (order_id, orders) => {
    const result = await Swal.fire({
      title: LANG.DELETEORDER.TITLE,
      text: LANG.DELETEORDER.TEXT,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: LANG.DELETEORDER.CONFIRM,
      cancelButtonText: LANG.GLOBAL.CANCEL,
    });

    if (result.isConfirmed) {
      try {
        const res = await apiFetch( `/api/orders/${order_id}`,{
            method: "DELETE"         
          }
        );

        if (res.ok) {
          showNotification(
            LANG.DELETEORDER.NOTIFICATIONS_ORDER_DELETED,
            "success",
          );
          return true;
        } else {
          const errorData = await res.json();
          showNotification(
            errorData.message || LANG.DELETEORDER.NOTIFICATIONS_ORDER_DELETED,
            "error",
          );
          return false;
        }
      } catch (error) {
        showNotification(error.message || LANG.GLOBAL.CONNECTION, "error");
        return false;
      }
    }
  };
  return { deleteOrder };
}
