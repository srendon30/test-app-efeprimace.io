import { useBusinessStore } from "@/stores/business";

const { getVacationsData } = useBusinessStore();

const vacacionFields = [
  {
    type_element: "date",
    id: "fecha_salida",
    name: "fecha_salida",
    label: "Fecha de Salida",
    restrict_past_dates: true,
  },
  {
    type_element: "date",
    id: "fecha_ingreso",
    name: "fecha_ingreso",
    label: "Fecha de Ingreso",
    restrict_past_dates: true,
  },
  {
    type_element: "textarea",
    id: "observaciones",
    name: "observaciones",
    label: "Observaciones",
    cols_desktop: "md:basis-2/4",
    cols_mobile: "basis-full",
  },
  {
    type_element: "text",
    id: "dias_disponibles",
    name: "dias_disponibles",
    label: "Días Disponibles",
    disabled: true,
    required: false,
    default_value: async () => {
      const data = await getVacationsData();
      return data ? data.diasDisponibles : "";
    },
  },
  {
    type_element: "text",
    id: "dias_disfrutados",
    name: "dias_disfrutados",
    label: "Días Disfrutados",
    disabled: true,
    required: false,
    default_value: async () => {
      const data = await getVacationsData();
      return data ? data.diasDisfrutados : "";
    },
  },
  {
    type_element: "text",
    id: "nro_dias_habiles",
    name: "nro_dias_habiles",
    label: "Días Hábiles Solicitados",
    disabled: true,
    required: false,
  },
  {
    type_element: "text",
    id: "nro_dias_calendario",
    name: "nro_dias_calendario",
    label: "Días Calendario Solicitados",
    disabled: true,
    required: false,
  },
];

export default vacacionFields;
