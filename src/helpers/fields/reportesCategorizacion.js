const reportesCategorizacionFields = [
  {
    type_element: "single-checkbox",
    id: "tipo_reporte",
    name: "tipo_reporte",
    label: "Tipo Reporte",
    items_select: ["GENERAL", "POR EMPLEADO", "POR AÑO"],
    // default_value: () => "GENERAL",
  },
  {
    type_element: "single-select",
    id: "empleado_id",
    name: "empleado_id",
    label: "Empleado",
    api_call: {
      method: "GET",
      endpoint: "api/list/empleadosActivos",
      params: null,
      headers: null,
    },
    cols_desktop: "md:basis-2/4",
    cols_mobile: "basis-full",
    show: false,
  },
  {
    type_element: "date-range",
    id: "rango_fechas",
    name: "rango_fechas",
    label: "Rango Fechas",
    show: false,
  },
  {
    type_element: "single-checkbox",
    id: "year",
    name: "year",
    label: "Año",
    items_select: [],
    show: false,
  },
];

export default reportesCategorizacionFields;
