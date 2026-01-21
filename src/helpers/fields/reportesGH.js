const reportesGHFields = [
  {
    type_element: "single-checkbox",
    id: "tipo_reporte",
    name: "tipo_reporte",
    label: "Tipo Reporte",
    items_select: [
      "PERMISOS",
      "INCAPACIDADES",
      "VACACIONES",
      "VACACIONES CONSOLIDADO",
      "PERFIL SOCIODEMOGRÁFICO",
      "CONTRATOS CANCELADOS",
    ],
  },
  {
    type_element: "single-select",
    id: "empresa_id",
    name: "empresa_id",
    label: "Empresa",
    api_call: {
      method: "GET",
      endpoint: "api/list/empresas",
      params: null,
      headers: null,
    },
    can_edit: false,
    cols_desktop: "md:basis-1/2",
    cols_mobile: "basis-full",
  },
];

export default reportesGHFields;
