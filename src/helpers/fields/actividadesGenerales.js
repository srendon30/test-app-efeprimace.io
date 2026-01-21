const actividadesGeneralesFields = [
    {
      type_element: "single-select",
      id: "actividad_general_id",
      name: "actividad_general_id",
      label: "Actividad General",
      cols_desktop: "md:basis-2/4",
      cols_mobile: "basis-full",
      api_call: {
        method: "GET",
        endpoint: "api/list/actividadesGenerales",
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
  
  export default actividadesGeneralesFields;
  