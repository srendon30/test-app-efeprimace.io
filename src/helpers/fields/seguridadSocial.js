const seguridadSocialFields = [
    {
      type_element: "single-checkbox",
      id: "tipo_afiliado",
      name: "tipo_afiliado",
      label: "Tipo de Afiliado",
      items_select: ["DEPENDIENTE", "INDEPENDIENTE"],
    },
    {
      type_element: "single-checkbox",
      id: "tipo_cotizante",
      name: "tipo_cotizante",
      label: "Tipo de Cotizante",
      items_select: ["DEPENDIENTE", "INDEPENDIENTE", "APRENDIZ"],
    },
    {
      type_element: "single-select",
      id: "eps_id",
      name: "eps_id",
      label: "EPS",
      api_call: {
        method: "GET",
        endpoint: "api/list/eps",
        params: null,
        headers: null,
      },
    },
    {
      type_element: "single-select",
      id: "afp_id",
      name: "afp_id",
      label: "AFP",
      api_call: {
        method: "GET",
        endpoint: "api/list/afp",
        params: null,
        headers: null,
      },
      required: false,
    },
    {
      type_element: "single-select",
      id: "arl_id",
      name: "arl_id",
      label: "ARL",
      api_call: {
        method: "GET",
        endpoint: "api/list/arl",
        params: null,
        headers: null,
      },
    },
    {
      type_element: "single-checkbox",
      id: "nivel_riesgo",
      name: "nivel_riesgo",
      label: "Nivel de Riesgo",
      items_select: ["NR1", "NR2", "NR3"],
    },
    {
      type_element: "single-select",
      id: "fondo_cesantia_id",
      name: "fondo_cesantia_id",
      label: "Fondo de Cesantía",
      api_call: {
        method: "GET",
        endpoint: "api/list/fondosCensantias",
        params: null,
        headers: null,
      },
      required: false,
    },
    {
      type_element: "single-select",
      id: "caja_compensacion_id",
      name: "caja_compensacion_id",
      label: "Caja de Compensación",
      api_call: {
        method: "GET",
        endpoint: "api/list/cajasCompensacion",
        params: null,
        headers: null,
      },
      required: false,
    },
];

export default seguridadSocialFields;
