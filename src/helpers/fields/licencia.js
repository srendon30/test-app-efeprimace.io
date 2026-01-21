const licenciaFields = [
  {
    type_element: "single-select",
    id: "persona_id",
    name: "persona_id",
    label: "Persona",
    cols_desktop: "md:basis-1/2",
    cols_mobile: "basis-full",
    api_call: {
      method: "GET",
      endpoint: "api/list/empleadosActivos",
      params: null,
      headers: null,
    },
    can_edit: false,
  },
  {
    type_element: "single-checkbox",
    id: "tipo_licencia",
    name: "tipo_licencia",
    label: "Tipo de Licencia",
    items_select: ["Remunerada", "No Remunerada", "Calamidad"],
    cols_desktop: "md:basis-1/2",
    cols_mobile: "basis-full",
  },
  {
    type_element: "date",
    id: "fecha_inicio_periodo",
    name: "fecha_inicio_periodo",
    label: "Inicio de Periodo",
  },
  {
    type_element: "date",
    id: "fecha_fin_periodo",
    name: "fecha_fin_periodo",
    label: "Fin de Periodo",
  },
  {
    type_element: "textarea",
    id: "observaciones",
    name: "observaciones",
    label: "Observaciones",
    cols_desktop: "md:basis-2/4",
    cols_mobile: "basis-full",
  },
];

export default licenciaFields;
