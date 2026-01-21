const areaFields = [
  {
    type_element: "text",
    id: "nombre",
    name: "nombre",
    label: "Nombre del Área",
    cols_desktop: "md:basis-1/2",
    cols_mobile: "basis-full",
  },
  {
    type_element: "single-select",
    id: "proceso_id",
    name: "proceso_id",
    label: "Proceso",
    cols_desktop: "md:basis-2/4",
    cols_mobile: "basis-full",
    api_call: {
      method: "GET",
      endpoint: "api/list/procesos",
      params: null,
      headers: null,
    },
  },
  {
    type_element: "single-select",
    id: "responsable_id",
    name: "responsable_id",
    label: "Responsable del Área",
    cols_desktop: "md:basis-2/4",
    cols_mobile: "basis-full",
    api_call: {
      method: "GET",
      endpoint: "api/list/personas",
      params: null,
      headers: null,
    },
  },
];

export default areaFields;
