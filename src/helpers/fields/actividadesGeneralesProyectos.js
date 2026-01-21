const actividadesGeneralesProyectosFields = [
  {
    type_element: "single-select",
    id: "proyecto_id",
    name: "proyecto_id",
    label: "Proyecto",
    cols_desktop: "md:basis-1/3",
    cols_mobile: "basis-full",
    api_call: {
      method: "GET",
      endpoint: "api/list/allProyectos",
      params: null,
      headers: null,
    },
    can_edit: false,
  },
  {
    type_element: "single-select",
    id: "actividad_general_proyecto_id",
    name: "actividad_general_proyecto_id",
    label: "Actividad General Proyecto",
    cols_desktop: "md:basis-2/4",
    cols_mobile: "basis-full",
    api_call: {
      method: "GET",
      endpoint: "api/list/actividadesGeneralesProyectos",
      params: null,
      headers: null,
    },
    can_edit: false,
  },
  {
    type_element: "number",
    id: "tiempo",
    name: "tiempo",
    label: "Tiempo",
    accept_decimals: true,
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

export default actividadesGeneralesProyectosFields;
