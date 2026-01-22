//import { useMainStore } from "@/stores/main"; Sirve para conectarlo con el cpanel
import { backendUrlFC } from "@/stores/main";
import { useAuthStore } from "@/stores/auth";
import { HttpError } from "./errors";

//const backendUrlFC = useMainStore().backendUrlFC;
const authStore = useAuthStore();

async function fetchItems({ method, endpoint, params, headers }) {
  if (params && method === "GET") {
    Object.keys(params).forEach((key) => {
      endpoint += `/${params[key]}`;
    });
  }
  const url = new URL(endpoint, backendUrlFC);

  const response = await fetch(url, {
    method: method,
    headers: headers
      ? headers
      : {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
  });
  if (response.status === 401) {
    throw new HttpError(
      "Unauthorized: Porfavor vuelve a Iniciar Sesión",
      response.status
    );
  }
  if (!response.ok) {
    throw new HttpError("Error al listar los datos", response.status);
  }
  const data = await response.json();
  return data;
}

async function createFieldElement(field) {
  const formElement = { ...typesDefaultElements[field.type_element] };

  for (const key in field) {
    // Fields from fields.js. manually created.
    if (Object.hasOwnProperty.call(field, key)) {
      const value = field[key];

      if (key === "api_call") {
        //Si tiene llamada a la api, no tiene items_select
        const data = {
          method: field[key]?.method,
          endpoint: field[key]?.endpoint,
          params: field[key]?.params,
          headers: field[key]?.headers,
        };
        formElement.items_select = await fetchItems(data);
      }
      formElement[key] = value;
    }
  }
  return formElement;
}

async function createFields(fields) {
  const fieldPromises = fields.map((field) => createFieldElement(field));
  const fieldsData = await Promise.all(fieldPromises);

  return fieldsData;
}

const defaultTextElement = {
  id: "text_id",
  name: "text_name",
  label: "text_label",
  type_element: "text",
  show: true,
  show_attribute: "",
  cols_desktop: "md:basis-1/4",
  cols_mobile: "basis-full",
  class: "",
  required: true,
  disabled: false,
  can_add: false,
  can_edit: true,
  can_refresh: false,
  default_value: null,
};

const defaultEmailElement = {
  type_element: "email",
  id: "email_id",
  name: "email_name",
  label: "email_label",
  cols_desktop: "md:basis-1/4",
  cols_mobile: "basis-full",
  class: "",
  show: true,
  show_attribute: "",
  required: true,
  disabled: false,
  can_add: false,
  can_edit: true,
  can_refresh: false,
  default_value: null,
};

const defaultSingleSelectElement = {
  type_element: "single-select",
  id: "single-select_id",
  name: "single-select_name",
  label: "single-select_label",
  cols_desktop: "md:basis-1/4",
  cols_mobile: "basis-full",
  class: "",
  items_select: [],
  api_call: null,
  show: true,
  show_attribute: "",
  required: true,
  disabled: false,
  can_add: false,
  can_edit: true,
  can_refresh: false,
  default_value: null,
};

const defaultMultiSelectElement = {
  type_element: "multi-select",
  id: "multi-select_id",
  name: "multi-select_name",
  label: "multi-select_label",
  cols_desktop: "md:basis-1/4",
  cols_mobile: "basis-full",
  class: "",
  items_select: [],
  api_call: null,
  show: true,
  show_attribute: "",
  required: true,
  disabled: false,
  can_add: false,
  can_edit: true,
  can_refresh: false,
  default_value: null,
};

const defaultTagElement = {
  type_element: "tag",
  id: "tag_id",
  name: "tag_name",
  label: "tag_label",
  cols_desktop: "md:basis-1/4",
  cols_mobile: "basis-full",
  class: "",
  items_select: [],
  api_call: null,
  show: true,
  show_attribute: "",
  required: true,
  disabled: false,
  can_add: false,
  can_edit: true,
  can_refresh: false,
  default_value: null,
  select_all: false,
};

const defaultPriceElement = {
  type_element: "price",
  id: "price_id",
  name: "price_name",
  label: "price_label",
  cols_desktop: "md:basis-1/4",
  cols_mobile: "basis-full",
  class: "",
  show: true,
  show_attribute: "",
  required: true,
  disabled: false,
  can_add: false,
  can_edit: true,
  can_refresh: false,
  default_value: null,
};

const defaultSingleFileElement = {
  id: "single-file_id",
  name: "single-file_name",
  label: "single-file_label",
  cols_desktop: "md:basis-1/4",
  cols_mobile: "basis-full",
  class: "",
  type_element: "file",
  show: true,
  show_attribute: "",
  required: true,
  disabled: false,
  can_add: false,
  can_edit: true,
  can_refresh: false,
  default_value: null,
};

const defaultMultiFileElement = {
  type_element: "multi-file",
  id: "multi-file_id",
  name: "multi-file_name",
  label: "multi-file_label",
  cols_desktop: "md:basis-1/4",
  cols_mobile: "basis-full",
  class: "",
  show: true,
  show_attribute: "",
  required: true,
  disabled: false,
  can_add: false,
  can_edit: true,
  can_refresh: false,
  default_value: null,
};

const defaultSingleCheckboxElement = {
  type_element: "single-checkbox",
  id: "single-checkbox_id",
  name: "single-checkbox_name",
  label: "single-checkbox_label",
  cols_desktop: "md:basis-1/4",
  cols_mobile: "basis-full",
  class: "",
  items_select: [],
  api_call: null,
  show: true,
  show_attribute: "",
  required: true,
  disabled: false,
  can_add: false,
  can_edit: true,
  can_refresh: false,
  default_value: null,
};

const defaultMultiCheckboxElement = {
  type_element: "multi-checkbox",
  id: "multi-checkbox_id",
  name: "multi-checkbox_name",
  label: "multi-checkbox_label",
  cols_desktop: "md:basis-1/4",
  cols_mobile: "basis-full",
  class: "",
  items_select: [],
  api_call: null,
  show: true,
  show_attribute: "",
  required: true,
  disabled: false,
  can_add: false,
  can_edit: true,
  can_refresh: false,
  default_value: null,
};

const defaultTextAreaElement = {
  type_element: "textarea",
  id: "textarea_id",
  name: "textarea_name",
  label: "textarea_label",
  cols_desktop: "md:basis-1/4",
  cols_mobile: "basis-full",
  class: "",
  show: true,
  show_attribute: "",
  required: true,
  disabled: false,
  can_add: false,
  can_edit: true,
  can_refresh: false,
  default_value: null,
};

const defaultNumberElement = {
  type_element: "number",
  id: "number_id",
  name: "number_name",
  label: "number_label",
  cols_desktop: "md:basis-1/4",
  cols_mobile: "basis-full",
  class: "",
  show: true,
  show_attribute: "",
  required: true,
  disabled: false,
  can_add: false,
  can_edit: true,
  can_refresh: false,
  default_value: null,
  accept_decimals: false,
  min_value: null,
  max_value: null,
};

const defaultDateElement = {
  type_element: "date",
  id: "date_id",
  name: "date_name",
  label: "date_label",
  cols_desktop: "md:basis-1/4",
  cols_mobile: "basis-full",
  class: "",
  show: true,
  show_attribute: "",
  required: true,
  disabled: false,
  can_add: false,
  can_edit: true,
  can_refresh: false,
  default_value: null,
  restrict_past_dates: false,
  restrict_future_dates: false,
};

const defaultDateRangeElement = {
  type_element: "date-range",
  id: "date_range_id",
  name: "date_range_name",
  label: "date_range_label",
  cols_desktop: "md:basis-1/4",
  cols_mobile: "basis-full",
  class: "",
  show: true,
  show_attribute: "",
  required: true,
  disabled: false,
  can_add: false,
  can_edit: true,
  default_value: null,
  restrict_past_dates: false,
  restrict_future_dates: false,
};

const defaultTimeElement = {
  type_element: "time",
  id: "time_id",
  name: "time_name",
  label: "time_label",
  cols_desktop: "md:basis-1/4",
  cols_mobile: "basis-full",
  class: "",
  show: true,
  show_attribute: "",
  required: true,
  disabled: false,
  can_add: false,
  can_edit: true,
  can_refresh: false,
  default_value: null,
};

const defaultSwitchElement = {
  id: "switch_id",
  name: "switch_name",
  label: "switch_label",
  type_element: "switch",
  show: true,
  show_attribute: "",
  cols_desktop: "md:basis-1/4",
  cols_mobile: "basis-full",
  class: "",
  required: true,
  disabled: false,
  can_add: false,
  can_edit: true,
  can_refresh: false,
  default_value: null,
};

const typesDefaultElements = {
  text: defaultTextElement,
  email: defaultEmailElement,
  "single-select": defaultSingleSelectElement,
  "multi-select": defaultMultiSelectElement,
  tag: defaultTagElement,
  price: defaultPriceElement,
  "single-file": defaultSingleFileElement,
  "multi-file": defaultMultiFileElement,
  "single-checkbox": defaultSingleCheckboxElement,
  "multi-checkbox": defaultMultiCheckboxElement,
  textarea: defaultTextAreaElement,
  number: defaultNumberElement,
  date: defaultDateElement,
  "date-range": defaultDateRangeElement,
  time: defaultTimeElement,
  switch: defaultSwitchElement,
};

export default {
  createFields,
  createFieldElement,
};
