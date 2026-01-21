const procesoFields = [
  {
    type_element: "text",
    id: "nombre",
    name: "nombre",
    label: "Nombre del Proceso",
    cols_desktop: "md:basis-1/2",
    cols_mobile: "basis-full",
  },
  {
    type_element: "single-select",
    id: "director_id",
    name: "director_id",
    label: "Director del Proceso",
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

export default procesoFields;
