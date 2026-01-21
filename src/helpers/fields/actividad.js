const actividadFields = [
  {
    type_element: "text",
    id: "titulo_actividad",
    name: "titulo_actividad",
    label: "Título de la Actividad",
    cols_desktop: "md:basis-1/2",
    cols_mobile: "basis-full",
    can_edit: false,
    disabled: true,
  },
  {
    type_element: "text",
    id: "area_responsable",
    name: "area_responsable",
    label: "Área Responsable",
    cols_desktop: "md:basis-1/2",
    cols_mobile: "basis-full",
    can_edit: false,
    disabled: true,
  },
  {
    type_element: "text",
    id: "tipo_estructura",
    name: "tipo_estructura",
    label: "Tipo de Estructura",
    cols_desktop: "md:basis-1/2",
    cols_mobile: "basis-full",
    can_edit: false,
    disabled: true,
  },
  {
    type_element: "tag",
    id: "responsables",
    name: "responsables",
    label: "Responsables",
    cols_desktop: "md:basis-2/4",
    cols_mobile: "basis-full",
    api_call: {
      method: "GET",
      endpoint: "api/list/responsables",
      params: null,
      headers: null,
    },
    disabled: false,
  },
];

export default actividadFields;
