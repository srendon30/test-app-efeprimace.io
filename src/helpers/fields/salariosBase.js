const salariosBaseFields = [
  {
    type_element: "text",
    id: "categoria",
    name: "categoria",
    label: "Categoría",
    cols_desktop: "md:basis-1/4",
    cols_mobile: "basis-full",
    can_edit: false,
  },
  {
    type_element: "number",
    id: "min_puntaje",
    name: "min_puntaje",
    label: "Puntaje Mínimo",
    accept_decimals: true,
    can_edit: false,
  },
  //Max puntaje is not editable
  {
    type_element: "number",
    id: "max_puntaje",
    name: "max_puntaje",
    label: "Puntaje Máximo",
    accept_decimals: true,
    can_edit: false,
  },
  {
    type_element: "price",
    id: "salario_base",
    name: "salario_base",
    label: "Salario Base",
  },
];

export default salariosBaseFields;
