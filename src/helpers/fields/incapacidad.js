const incapacidadFields = [
  {
    type_element: "single-select",
    id: "persona_id",
    name: "persona_id",
    label: "Persona",
    cols_desktop: "md:basis-2/4",
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
    id: "tipo_evento",
    name: "tipo_evento",
    label: "Tipo de Evento",
    items_select: ["EG", "AT", "EL"],
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
    type_element: "single-select",
    id: "diagnostico_id",
    name: "diagnostico_id",
    label: "Diagnóstico",
    cols_desktop: "md:basis-2/4",
    cols_mobile: "basis-full",
    api_call: {
      method: "GET",
      endpoint: "api/list/diagnosticos",
      params: null,
      headers: null,
    },
    can_edit: false,
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

export default incapacidadFields;
