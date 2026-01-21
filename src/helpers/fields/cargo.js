const cargoFields = [
  {
    type_element: "text",
    id: "nombre",
    name: "nombre",
    label: "Nombre del Cargo",
    cols_desktop: "md:basis-1/4",
    cols_mobile: "basis-full",
  },
  {
    type_element: "single-select",
    id: "area_id",
    name: "area_id",
    label: "Área",
    cols_desktop: "md:basis-2/4",
    cols_mobile: "basis-full",
    api_call: {
      method: "GET",
      endpoint: "api/list/areas",
      params: null,
      headers: null,
    },
  },
];

export default cargoFields;
