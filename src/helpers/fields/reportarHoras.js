const reportarHorasFields = [
  {
    type_element: "number",
    id: "tiempo",
    name: "tiempo",
    label: "Tiempo",
    accept_decimals: true,
  },
  {
    type_element: "single-checkbox",
    id: "actividad_finalizada",
    name: "actividad_finalizada",
    label: "Actividad Finalizada",
    items_select: ["SI", "NO"],
    // default_value: () => "NO",
  },
  {
    type_element: "single-checkbox",
    id: "reproceso",
    name: "reproceso",
    label: "Reproceso",
    items_select: ["SI", "NO"],
  },
  {
    type_element: "single-select",
    id: "causa_reproceso_id",
    name: "causa_reproceso_id",
    label: "Causa Reproceso",
    cols_desktop: "md:basis-1/2",
    cols_mobile: "basis-full",
    api_call: {
      method: "GET",
      endpoint: "api/list/causasReproceso",
      params: null,
      headers: null,
    },
    show: false,
  },
  {
    type_element: "number",
    id: "tiempo_adicional",
    name: "tiempo_adicional",
    label: "Tiempo Adicional",
    accept_decimals: true,
    default_value: () => {
        return 0.0;
    },
  },
  {
    type_element: "textarea",
    id: "observacion",
    name: "observacion",
    label: "Observación",
    cols_desktop: "md:basis-1/2",
    cols_mobile: "basis-full",
    required: true,
  },
];

export default reportarHorasFields;
