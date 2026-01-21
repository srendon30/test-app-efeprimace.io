const filteredAnswersSurveyFields = [
  {
    type_element: "single-checkbox",
    id: "tipo_reporte",
    name: "tipo_reporte",
    label: "Tipo Reporte",
    items_select: ["POR RANGO FECHAS", "POR CLIENTE", "POR AÑO"],
    // default_value: () => "GENERAL",
  },
  {
    type_element: "single-select",
    id: "cliente_id",
    name: "cliente_id",
    label: "Cliente",
    api_call: {
      method: "GET",
      endpoint: "api/list/clientes",
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

export default filteredAnswersSurveyFields;
