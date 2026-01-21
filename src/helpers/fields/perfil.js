const perfilFields = [
  {
    type_element: "text",
    id: "nombre",
    name: "nombre",
    label: "Nombre del Perfil",
    cols_desktop: "md:basis-1/4",
    cols_mobile: "basis-full",
  },
  {
    type_element: "single-select",
    id: "cargo_id",
    name: "cargo_id",
    label: "Cargo",
    cols_desktop: "md:basis-2/4",
    cols_mobile: "basis-full",
    api_call: {
      method: "GET",
      endpoint: "api/list/cargos",
      params: null,
      headers: null,
    },
    can_edit: false,
  },
];

export default perfilFields;
