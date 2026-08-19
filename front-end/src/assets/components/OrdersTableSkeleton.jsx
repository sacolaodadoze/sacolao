import { Skeleton} from "@mui/material";

export const OrdersTableSkeleton = ({ rows = 8 }) => (
  <>
    {[...Array(rows)].map((_, index) => (
      <tr key={index}>
        {/* No. */}
        <td className="col-number">
          <Skeleton width={40} />
        </td>

        {/* Data */}
        <td>
          <Skeleton width={90} />
        </td>

        {/* Cliente */}
        <td>
          <Skeleton width="80%" />
        </td>

        {/* Endereço */}
        <td>
          <Skeleton width="100%" />
        </td>

        {/* Estado */}
        <td>
          <Skeleton width={80} />
        </td>

         {/* Agendado */}
        <td>
          <Skeleton width={50} />
        </td>

           {/* Retirado */}
        <td>
          <Skeleton width={40} />
        </td>

        {/* Acciones */}
        <td>
          <Skeleton
            variant="rectangular"
            width={90}
            height={32}
          />
        </td>
      </tr>
    ))}
  </>
);
