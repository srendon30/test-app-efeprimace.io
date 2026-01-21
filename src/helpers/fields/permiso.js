const permisoFields = [
  {
    type_element: "single-select",
    id: "causa_permiso_id",
    name: "causa_permiso_id",
    label: "Motivo",
    api_call: {
      method: "GET",
      endpoint: "api/list/causasPermiso",
      params: null,
      headers: null,
    },
  },
  {
    type_element: "date",
    id: "fecha",
    name: "fecha",
    label: "Fecha Permiso",
    restrict_past_dates: true,
  },
  {
    type_element: "time",
    id: "hora_salida",
    name: "hora_salida",
    label: "Hora Salida",
  },
  {
    type_element: "time",
    id: "hora_llegada",
    name: "hora_llegada",
    label: "Hora Llegada",
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

export default permisoFields;
