const planeacionFields = [
  {
    type_element: "single-select",
    id: "proyecto_id",
    name: "proyecto_id",
    label: "Proyecto",
    cols_desktop: "md:basis-1/3",
    cols_mobile: "basis-full",
    api_call: {
      method: "GET",
      endpoint: "api/list/proyectos",
      params: null,
      headers: null,
    },
    can_edit: false,
  },
  {
    type_element: "single-select",
    id: "estructura_id",
    name: "estructura_id",
    label: "Estructura",
    cols_desktop: "md:basis-1/3",
    cols_mobile: "basis-full",
  },
  {
    type_element: "single-select",
    id: "orden_id",
    name: "orden_id",
    label: "Orden",
    cols_desktop: "md:basis-1/3",
    cols_mobile: "basis-full",
    disabled: true,
  },
];

export default planeacionFields;
