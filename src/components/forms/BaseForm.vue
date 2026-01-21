<template>
    <AppLoader v-if="isLoadingApp" />

    <div v-else class="w-full py-8 rounded-lg custom-shadow"
        :class="isMobile ? (isDarkMode ? 'border-color-identity' : 'border-color-identity-dark-gold') : isDarkMode ? '' : 'border-color-identity-dark-gold'">
        <div v-if="props.iconsView.length > 0"
            class="flex justify-center items-center -mt-16 md:-mt-28 md:justify-end md:mb-4">
            <!-- Icono Form -->
            <component v-if="viewIcons[props.iconsView[0]]" :is="viewIcons[props.iconsView[0]]"
                class="p-4 w-20 h-20 md:w-24 md:h-24 md:mr-1/4 border-color-identity-dark-gold-thick rounded-full dark:border-gray-300"
                :class="isDarkMode ? 'bg-black text-gray-300' : 'bg-identity-dark text-identity'" />
        </div>
        <div class="flex flex-row flex-wrap">
            <!-- Header -->
            <slot name="form-header">
            </slot>
            <br v-if="$slots['form-header']">
            <hr class="mx-4 border-color-identity-dark dark:border-gray-200" v-if="$slots['form-header']">
            <br v-if="$slots['form-header']">
            <!-- Form -->

            <!-- {{ formData }} -->

            <form class="w-full">
                <!-- Fields -->
                <slot name="form-fields">
                    <div class="flex flex-row flex-wrap justify-center">
                        <!-- Field -->
                        <div v-for="(field, index) in  fieldsData " :key="field.id"
                            :class="[!isMobile ? (isDarkMode ? 'border-color-identity' : 'border-color-identity-dark-gold ') : '', field.cols_mobile, field.cols_desktop, field.class]"
                            v-show="field.show" class="p-2 md:p-4 rounded-lg">
                            <!-- Label -->
                            <div class="flex flex-row items-center">
                                <div
                                    :class="[field.can_add && (props.actionSelected === 'save') ? 'basis-4/5' : 'basis-full']">
                                    <label :for="field.name"
                                        class="block text-sm text-identity-dark dark:text-gray-300 max-w-full">
                                        <div class="flex flex-row max-w-full">
                                            <span v-if="field.required" class="relative flex h-2 w-2 mt-1.5 max-w-full">
                                                <span
                                                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span
                                                    class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                            </span>
                                            <span class="ml-1 max-w-full truncate"> {{ field.label }} :</span>
                                        </div>
                                    </label>
                                </div>
                                <div v-if="field.can_refresh && (props.actionSelected === 'save')"
                                    class="basis-1/5 p-1 flex justify-center">
                                    <button @click="refreshField(field.name)" type="button"
                                        class="px-4 py-2 font-medium text-white bg-cyan-500 rounded-lg transition-colors duration-200 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                                        <component :is="iconsForm['IconRefresh']" v-if="!isRefresingField" />
                                        <component :is="iconsForm['IconLoading']" v-else />
                                    </button>
                                </div>
                            </div>
                            <!-- Inputs Types -->
                            <div class="mt-2 max-w-full">
                                <div class="flex flex-row justify-center">
                                    <div
                                        :class="[field.can_add && (props.actionSelected === 'save') ? 'basis-4/5' : 'basis-full']">
                                        <!-- Type Text -->
                                        <input v-if="field.type_element === 'text'" v-model="formData[field.name]"
                                            :disabled="isFieldDisabled(field)" type="text" :placeholder="field.label"
                                            :class="isFieldDisabled(field) ? 'bg-gray-400' : 'bg-white'"
                                            class="block w-full rounded-lg px-5 py-2.5 placeholder-gray-400/70 text-gray-700 border border-gray-200 dark:border-gray-600 focus:border-orange-600 dark:focus:border-orange-300 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40" />
                                        <!-- Type Email -->
                                        <div v-else-if="field.type_element === 'email'"
                                            class="relative flex items-center">
                                            <span class="absolute">
                                                <component :is="iconsForm['IconEmail']" />
                                            </span>
                                            <input v-model="formData[field.name]" type="email"
                                                :disabled="isFieldDisabled(field)" :placeholder="field.label"
                                                :class="isFieldDisabled(field) ? 'bg-gray-400' : 'bg-white'"
                                                class="block w-full py-2.5 rounded-lg pl-11 pr-5 rtl:pr-11 rtl:pl-5 placeholder-gray-400/70 text-gray-700 border border-gray-200 dark:border-gray-600 focus:border-orange-600 dark:focus:border-orange-300 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40">
                                        </div>
                                        <!-- Type Single Select -->
                                        <multiselect v-else-if="field.type_element === 'single-select'"
                                            v-model="formData[field.name]" selected-label="Seleccionado"
                                            select-label="Seleccionar" deselect-label="Deseleccionar" :track-by="'id'"
                                            placeholder="Selecciona una opción" :custom-label="customLabel"
                                            :options="field.items_select" :disabled="isFieldDisabled(field)">
                                            <!-- :label="field.show_attribute" -->
                                            <template #singleLabel="{ option }">
                                                <!-- <strong>{{ option.id }}: {{ option.show_data }}</strong> -->
                                                <strong>{{ option.show_data }}</strong>
                                            </template>
                                            <template #noResult> No hay resultados </template>
                                        </multiselect>
                                        <!-- Type Multi Select -->
                                        <multiselect v-else-if="field.type_element === 'multi-select'"
                                            v-model="formData[field.name]" placeholder="Selecciona una o más opciones"
                                            selected-label="Seleccionado" select-label="Seleccionar"
                                            deselect-label="Deseleccionar" label="name" :track-by="'id'"
                                            :options="field.items_select" :multiple="true"
                                            :disabled="isFieldDisabled(field)">
                                            <template #selection="{ values, search, isOpen }">
                                                <span v-if="values.length" v-show="!isOpen" class="multiselect__single">
                                                    {{ values.length }} opciones seleccionadas</span>
                                            </template>
                                            <template #noResult> No hay resultados </template>
                                        </multiselect>
                                        <!-- Type Tag -->
                                        <multiselect v-else-if="field.type_element === 'tag'"
                                            v-model="formData[field.name]" tag-placeholder="Nuevo tag"
                                            placeholder="Selecciona una o más opciones" selected-label="Seleccionado"
                                            select-label="Seleccionar" deselect-label="Deseleccionar" :track-by="'id'"
                                            :options="field.items_select" :multiple="true" :taggable="false"
                                            :disabled="isFieldDisabled(field)" label="show_data" @tag="addTag">
                                            <template #noResult> No hay resultados </template>
                                        </multiselect>
                                        <!-- Type Currency -->
                                        <CurrencyInput v-else-if="field.type_element === 'price'"
                                            v-model="formData[field.name]" :options="currencyOptions"
                                            :disabled="isFieldDisabled(field)" />
                                        <!-- @update-model-value="value => formData[field.name] = value" -->

                                        <!-- Type Files -->
                                        <label
                                            v-else-if="field.type_element === 'single-file' || field.type_element === 'multi-file'"
                                            for="file"
                                            class="flex flex-col items-center w-full max-w-lg p-1 mx-auto text-center border-2 border-gray-300 border-dashed cursor-pointer  dark:border-gray-700 rounded-xl">
                                            <component :is="iconsForm['IconUpload']" />

                                            <div class="flex flex-row flex-wrap mt-1">
                                                <div class="max-w-full">
                                                    <span v-for="(file, index) in formData[field.name]" :key="index"
                                                        class="text-xs p-1 text-identity-dark bg-gray-200 rounded m-1 overflow-hidden whitespace-nowrap text-ellipsis block">
                                                        {{ getFileName(file.name) }}
                                                    </span>
                                                </div>
                                            </div>
                                            <p class="mt-1 text-xs tracking-wide text-gray-500 dark:text-gray-400">
                                                Escoge o arrastra un archivo PNG, JPG, PDF o HEIC.
                                            </p>

                                            <input @change="(event) => handleFiles(event, field.name)" id="file"
                                                type="file" class="hidden" accept=".png, .jpg, .jpeg, .pdf, .heic"
                                                :multiple="field.type_element === 'multi-file'"
                                                :class="isFieldDisabled(field) ? 'bg-gray-400' : 'bg-white'"
                                                :disabled="isFieldDisabled(field)" />
                                        </label>
                                        <!-- Type Single Checkbox -->
                                        <div v-else-if="field.type_element === 'single-checkbox'">
                                            <div v-for="(option, index) in field.items_select" :key="index"
                                                class="flex items-center mb-2">
                                                <input type="radio" :id="`option-radio-${index}-${field.name}`"
                                                    v-model="formData[field.name]" :value="option"
                                                    :name="`options-${field.name}`"
                                                    :class="isFieldDisabled(field) ? 'bg-gray-400' : 'bg-gray-100'"
                                                    :disabled="isFieldDisabled(field)"
                                                    class="cursor-pointer w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-orange-500" />
                                                <label :for="`option-radio-${index}-${field.name}`"
                                                    class="cursor-pointer ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                    <span class="font-semibold">
                                                        {{ option }}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <!-- Type Multi Checkbox -->
                                        <div v-else-if="field.type_element === 'multi-checkbox'">
                                            <div v-for="(option, index) in field.items_select" :key="index"
                                                class="flex items-center mb-4">
                                                <input :id="`option-checkbox-${index}`" type="checkbox"
                                                    v-model="formData[field.name]" :value="option"
                                                    :class="isFieldDisabled(field) ? 'bg-gray-400' : 'bg-gray-100'"
                                                    :disabled="isFieldDisabled(field)"
                                                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
                                                <label :for="`option-checkbox-${index}`"
                                                    class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                    <span class="font-semibold">
                                                        {{ option }}
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                        <!-- Type Textarea -->
                                        <textarea v-else-if="field.type_element === 'textarea'"
                                            v-model="formData[field.name]" :placeholder="field.label"
                                            :disabled="isFieldDisabled(field)"
                                            :class="isFieldDisabled(field) ? 'bg-gray-400' : 'bg-white'"
                                            class="block w-full max-w-full rounded-lg  px-4 h-20 py-2.5 placeholder-gray-400/70 text-gray-700 border border-gray-200 dark:border-gray-600 focus:border-orange-600 dark:focus:border-orange-300 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40"></textarea>
                                        <!-- Type Number -->
                                        <input v-else-if="field.type_element === 'number'"
                                            v-model="formData[field.name]" type="number" :placeholder="field.label"
                                            :min="field.min_value" :max="field.max_value"
                                            :disabled="isFieldDisabled(field)"
                                            :class="isFieldDisabled(field) ? 'bg-gray-400' : 'bg-white'"
                                            :step="field.accept_decimals ? '0.1' : null"
                                            class="block w-full rounded-lg px-5 py-2.5 placeholder-gray-400/70 text-gray-700 border border-gray-200 dark:border-gray-600 focus:border-orange-600 dark:focus:border-orange-300 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40" />
                                        <!-- Type Date -->
                                        <VueDatePicker v-else-if="field.type_element === 'date'"
                                            :ref="element => datePickerRefs[field.name] = element"
                                            v-model="formData[field.name]" :placeholder="field.label" locale="es"
                                            :enable-time-picker="false" auto-apply :disabled="isFieldDisabled(field)"
                                            :min-date="field.restrict_past_dates ? new Date() : null"
                                            :max-date="field.restrict_future_dates ? new Date() : null"
                                            :format="formatPrettyDate"
                                            class="block w-full rounded-lg placeholder-gray-400/70 text-gray-700 border border-gray-200 dark:border-gray-600 focus:border-orange-600 dark:focus:border-orange-300 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40">
                                        </VueDatePicker>
                                        <!-- Type Range -->
                                        <VueDatePicker v-else-if="field.type_element === 'date-range'"
                                            :ref="element => datePickerRefs[field.name] = element"
                                            v-model="formData[field.name]" :placeholder="field.label" locale="es"
                                            :enable-time-picker="false" auto-apply range
                                            :disabled="isFieldDisabled(field)"
                                            :min-date="field.restrict_past_dates ? new Date() : null"
                                            :max-date="field.restrict_future_dates ? new Date() : null"
                                            :disabled-dates="(date) => datesDisabled(date, field.disabled_dates ?? [])"
                                            :format="formatPrettyDates"
                                            class="block w-full rounded-lg placeholder-gray-400/70 text-gray-700 border border-gray-200 dark:border-gray-600 focus:border-indigo-600 dark:focus:border-indigo-300 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40">
                                        </VueDatePicker>
                                        <!-- Type Time -->
                                        <VueDatePicker v-else-if="field.type_element === 'time'"
                                            v-model="formData[field.name]" time-picker :is-24="false"
                                            :placeholder="field.label" :disabled="isFieldDisabled(field)"
                                            class="block w-full rounded-lg placeholder-gray-400/70 text-gray-700 border border-gray-200 dark:border-gray-600 focus:border-orange-600 dark:focus:border-orange-300 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40" />
                                        <!-- Switch -->
                                        <div v-else-if="field.type_element === 'switch'"
                                            class="flex items-center  w-full justify-start">
                                            <label for="toogleA" class="flex items-center cursor-pointer">
                                                <div class="relative">
                                                    <input id="toogleA" type="checkbox" class="sr-only"
                                                        v-model="formData[field.name]" />
                                                    <div class="block bg-identity-dark  w-14 h-8 rounded-full"></div>
                                                    <div
                                                        class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition">
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                        <!-- Others -->
                                        <h1 v-else>
                                            En progreso...
                                        </h1>
                                    </div>
                                    <div v-if="field.can_add && (props.actionSelected === 'save')"
                                        class="basis-1/5 p-1 flex justify-center">
                                        <button @click="addEntity(field.name)" type="button"
                                            class="px-4 py-2 font-medium text-white bg-orange-600 rounded-lg transition-colors duration-200 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
                                            <component :is="iconsForm['IconAdd']" />
                                        </button>
                                    </div>
                                </div>
                                <p v-if="formErrors[field.name]" class="text-xs text-red-400">
                                    {{ formErrors[field.name] }}
                                </p>
                                <!-- <p class="text-black dark:text-gray-300 text-xs">
                                    {{ field.name }}
                                    <hr>
                                    {{ formData[field.name] }}
                                    <hr>
                                    errors: {{ formErrors[field.name] }}
                                    <hr>
                                    restrict_past_dates: {{ field.restrict_past_dates ? new Date() : null }}
                                    <hr>
                                    field: <code>{{ field }}</code>
                                    <hr>
                                    {{ datePickerRefs[field.name] }}
                                </p> -->
                            </div>
                        </div>
                    </div>
                </slot>
            </form>
            <!-- Footer -->
            <br v-if="$slots['form-footer']">
            <hr class="mx-4 border-color-identity-dark dark:border-gray-200" v-if="$slots['form-footer']">
            <br v-if="$slots['form-footer']">
            <slot name="form-footer">
                <!-- {{ formData }} -->
                <!-- {{ props.typeForm }} - {{ props.actionSelected }} -->
            </slot>
            <!-- Actions -->
            <slot name="form-actions">
                <div class="flex justify-center md:justify-end p-4 w-full">
                    <div class="flex flex-col justify-center">
                        <button @click="handleSubmit"
                            class="flex justify-center items-center px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-orange-600 rounded-lg hover:bg-orange-500 focus:outline-none focus:ring focus:ring-orange-300 focus:ring-opacity-80">
                            <component :is="iconsForm['IconSubmit']" v-if="!isLoadingForm" />
                            <component :is="iconsForm['IconLoading']" v-else />
                            <span class="mx-1">{{ titleActionButton }}</span>
                        </button>
                        <p v-if="!emptyErrors" class="text-xs text-red-400">
                            Hay errores en el formulario.
                        </p>
                    </div>
                </div>
            </slot>
        </div>
    </div>
    <!-- Modal -->
    <Modal :is-modal-open="isModalOpen" @close-modal="closeModal" max-height="max-entity-height" max-width="max-w-4xl">
        <template #icon>
            <component :is="iconsForm['IconPlus']" />
        </template>
        <template #title>
            <h3 class="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white" id="modal-title">
                Agregar {{ modalTitle }}
            </h3>
        </template>
        <template #content>
            <BaseForm :type-form="typeEntity" @close-modal="closeModal" />
        </template>
    </Modal>
</template>
<script setup>

import { ref, onMounted, computed, markRaw, watch, defineProps, onUnmounted, defineEmits, defineAsyncComponent, nextTick, onBeforeUnmount } from "vue";
import AppLoader from "../loader/AppLoader.vue";
import CurrencyInput from "@/components/inputs/CurrencyInput.vue";
import Modal from "@/components/helpers/Modal.vue"
import { storeToRefs } from "pinia";
import { useMainStore } from "@/stores/main";
import { useMomentStore } from "@/stores/moment";
import { useBusinessStore } from "@/stores/business";
import formsHelper from "@/helpers/forms.js";
import fieldsHelper from "@/helpers/fields";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useAuthStore } from "@/stores/auth";
import { useIconStore } from "@/stores/icons";
import { showErrorMessage } from "@/helpers/errors";
import { HttpError } from "@/helpers/errors";
import { eventBus, sendDataViaEventBus, getDataFromEventBus, clearDataFromEventBus } from "@/helpers/eventBus";
import { onBeforeMount } from "vue";

const props = defineProps({
    iconsView: {
        type: Array,
        required: false,
        default: []
    },
    typeForm: {
        type: String,
        required: true,
    },
    actionSelected: {
        type: String,
        required: false,
        default: 'save'
    },
    rowSelected: {
        type: Object,
        required: false,
        default: null
    },
});
const { iconsForm, loadFormIcons } = useIconStore();
const formIconNames = ref(['IconSubmit', 'IconLoading', 'IconRefresh', 'IconPlus', 'IconAdd', 'IconUpload', 'IconEmail', 'IconGantt']);

const emit = defineEmits(["closeModal", "updateRow", "addTask"]);

const { isDarkMode, isMobile } = storeToRefs(useMainStore())
const { backendUrlFC, slug } = useMainStore()
const { formatStoreDate, parseStoreDate, formatStoreTime, parseStoreTime, formatPrettyDate, formatPrettyDates, parseStoreRangeDates, compareDatesLess, getToday } = useMomentStore()
const { token } = storeToRefs(useAuthStore())
const { businessDays, getNextCodigoEstructura, getActiveOrdenByEstructura, formatHours, getLaboralTimeBetweenTwoDates, getPuntajeByYearsExperience, getLevelExperienceByYears, getCategorizacion } = useBusinessStore();

const fields = ref([]);
const fieldsData = ref([]);

let eventBusWatch;

const changeFieldName = async (oldFieldName, newFieldName) => {
    const fieldIndex = findFieldIndexById(oldFieldName);
    fields.value[fieldIndex].name = newFieldName;
    const fieldDataIndex = findFieldDataIndexById(oldFieldName);
    fieldsData.value[fieldDataIndex].name = newFieldName;
}

onUnmounted(() => {
    clearComponentData()
    eventBusWatch();
    clearDataFromEventBus()
});

onMounted(async () => {
    try {
        activateWatchers()
        await loadFormData()
        await verifyFormAction()
        await verifyConditionsByTypeForm()
        await getDataFromEventBus()
        await initDefaultValues()
    } catch (error) {
        showErrorMessage(error)
    }
});

eventBusWatch = watch(() => eventBus.data, async (newEventBusData) => {
    if (newEventBusData) {
        if (newEventBusData.actionSelected === 'approve_reject_vacation') {
            changeFieldName('estado', newEventBusData.approvedBy === 'jefe_area' ? 'estado_jefe' : 'estado_gerente')
            changeFieldName('obs', newEventBusData.approvedBy === 'jefe_area' ? 'obs_jefe' : 'obs_gerente')
        }
    }
}, { immediate: false });

const loadFormData = async () => {
    setLoadingApp(true)
    await getFormFields(props.typeForm);
    await loadFormIcons(formIconNames.value);
    await loadViewIcons(props.iconsView);
    setLoadingApp(false, 1000)
};

const initDefaultValues = async () => {
    if (props.actionSelected !== 'edit') {
        for (const field of fieldsData.value) {
            if (field.default_value) {
                const defaultValue = field.default_value();
                formData.value[field.name] = defaultValue instanceof Promise ? await defaultValue : defaultValue;
            } else if (field.show && !formData.value[field.name]) {
                formData.value[field.name] = null;
            }
        }
    }

    fieldsData.value.map(field => {
        if (field.type_element === 'tag' && field.select_all) {
            field.items_select.unshift({ id: 'all', show_data: 'Seleccionar todo' })
        }
    })

    if (props.actionSelected && props.actionSelected === 'approve_reject_permission') {
        formData.value['permiso_id'] = props.rowSelected.id
    }

    if (props.typeForm === 'estructura' && props.actionSelected && props.actionSelected === 'add_structure') {
        formData.value['proyecto_id'] = props.rowSelected.id
        const response = await getNextCodigoEstructura(props.rowSelected?.id)
        formData.value['codigo_estructura'] = response.codigo
    }

    if (props.actionSelected && props.actionSelected === 'add_order') {
        formData.value['estructura_proyecto_id'] = props.rowSelected.id
    }

    if (props.actionSelected && props.actionSelected === 'approve_reject_vacation') {
        formData.value['vacacion_id'] = props.rowSelected.id
    }

    if (props.actionSelected && props.actionSelected === 'assign_responsabilitites' && props.typeForm === 'actividadesOrdenEtap') {
        formData.value['actividad_id'] = props.rowSelected.id
        formData.value['orden_id'] = props.rowSelected.orden_id
        formData.value['ordenEtapa'] = props.rowSelected.ordenEtapa
        await getEditData()
        await setFormResponsables()
    }

    if (props.actionSelected && props.actionSelected === 'report_hours' && props.typeForm === 'reportarHoras') {
        formData.value['actividad_id'] = props.rowSelected.id
        formData.value['orden_id'] = props.rowSelected.orden_id
    }

    if (props.actionSelected && props.actionSelected === 'add_email_survey' && props.typeForm === 'agregarEmailEncuesta') {
        formData.value['cliente_id'] = props.rowSelected.id
    }

    return
};


const verifyFormAction = async () => {
    if (props.actionSelected === 'edit') {
        await getEditData()
    }
    updateActionButton()
    return
};
const verifyConditionsByTypeForm = () => {
    if (props.typeForm === 'contrato') {
        if (props.actionSelected === 'edit') {
            const fieldIndex = findFieldIndexByName('observaciones');
            fields.value[fieldIndex].show = true;
            fieldsData.value[fieldIndex].show = true;
        } else {
            const fieldIndex = findFieldIndexByName('observaciones');
            fields.value[fieldIndex].show = false;
            fieldsData.value[fieldIndex].show = false;
        }
    }

    return
};
// Obtener datos de edición
const getEditData = async () => {
    try {
        setLoadingApp(true)
        const response = await fetch(`${backendUrlFC}/api/edit/form/${props.typeForm}/${props.rowSelected.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.value}`
            }
        });
        const data = await response.json();

        if (!response.ok) {
            throw new HttpError(data.message, response.status);
        }

        setFormData(data.data)
        setLoadingApp(false, 1000)
    } catch (error) {
        showErrorMessage(error)
    }
};

const setFormData = (data) => {
    for (const field of fieldsData.value) {
        if (data && field.name in data) {
            if (field.type_element === 'number' || field.type_element === 'price') {
                formData.value[field.name] = parseFloat(data[field.name]);
            } else if (field.type_element === 'time') {
                formData.value[field.name] = parseStoreTime(data[field.name]);
            } else if (field.type_element === 'date') {
                formData.value[field.name] = parseStoreDate(data[field.name]);
            } else if (typeof data[field.name] === 'boolean') {
                formData.value[field.name] = data[field.name];
            } else if (data[field.name]) {
                formData.value[field.name] = data[field.name];
            }
        }
    }
    // Seteando responsables en actividadesOrdenEtap Form(assign_responsabilitites)
    // if (props.typeForm === 'actividadesOrdenEtap') {
    //     //Seteando responsables de la actividad
    //     setFormResponsables()
    // }
};

const setFormResponsables = async () => {
    const responsables = props.rowSelected?.responsables.map(responsable => {
        return {
            id: responsable.id,
            show_data: responsable.nombre_completo,
            asignaciones: responsable.asignaciones
        }
    })
    formData.value['responsables'] = responsables
    return
};

const titleActionButtonMap = {
    save: 'Guardar',
    edit: 'Actualizar',
    download_document_contract: 'Descargar',
    approve_reject_permission: 'Aprobar/Rechazar',
    download_reporte_gh: 'Descargar',
    add_structure: 'Agregar Estructura',
    approve_reject_vacation: 'Aprobar/Rechazar',
    add_order: 'Agregar Orden',
    planning: 'Planificar',
    request_vacation: 'Solicitar',
    my_activities: 'Buscar',
    report_hours: 'Reportar',
    assign_responsabilitites: 'Asignar Responsabilidades',
    add_task: 'Agregar Actividad',
    download_report_categorization: 'Generar Reporte',
    add_email_survey: 'Agregar Email Encuesta',
    download_filtered_answers_survey: 'Descargar Respuestas',
};
const updateActionButton = () => {
    titleActionButton.value = titleActionButtonMap[props.actionSelected]
};

const isModalOpen = ref(false)
const formData = ref({})
const formErrors = ref({})
const currencyOptions = ref({
    locale: 'en-US',
    currency: 'COP',
    currencyDisplay: 'narrowSymbol',
});
const emptyErrors = computed(() => {
    return Object.keys(formErrors.value).length === 0
})
const isLoadingApp = ref(false)

const setLoadingApp = (value, delay = 0) => {
    return setTimeout(() => {
        isLoadingApp.value = value;
    }, delay);
}
const isLoadingForm = ref(false)
const setLoadingForm = (value, delay = 0) => {
    if (delay > 0) {
        setTimeout(() => {
            isLoadingForm.value = value
        }, delay);
    } else {
        isLoadingForm.value = value
    }
}
const isRefresingField = ref(false)
const setRefresingField = (value, delay = 0) => {
    if (delay > 0) {
        setTimeout(() => {
            isRefresingField.value = value
        }, delay);
    } else {
        isRefresingField.value = value
    }
}

const viewIcons = ref({})
const datePickerRefs = ref([]);
const titleActionButton = ref('Guardar')

const loadViewIcons = async (iconsName) => {
    try {
        if (iconsName.length === 0) return;

        const promises = iconsName.map(iconName => import(`@/components/icons/${iconName}.vue`));
        const loadedIcons = await Promise.all(promises);

        iconsName.forEach((iconName, index) => {
            viewIcons.value[iconName] = markRaw(loadedIcons[index].default);
        });
    } catch (error) {
        throw new Error('Failed to load form icons.');
    }
}

const getFormFields = async (typeForm) => {
    fields.value = fieldsHelper.getFormFields(typeForm);
    await createFields(fields.value);
};

const createFields = async (fields) => {
    fieldsData.value = await formsHelper.createFields(fields);
};

const isFieldDisabled = (field) => {
    return field.disabled || (props.actionSelected === 'edit' && !field.can_edit)
}

const getIdObject = (object) => {
    return object ? object.id : null;
};

const predefinedApiCalls = ref({
    departamento_id: {
        method: "GET",
        endpoint: "api/list/departamentos",
        params: null,
        headers: null,
    },
    municipio_id: {
        method: "GET",
        endpoint: "api/list/municipios",
        params: null,
        headers: null,
    },
    departamento_nacimiento_id: {
        method: "GET",
        endpoint: "api/list/departamentos",
        params: null,
        headers: null,
    },
    municipio_nacimiento_id: {
        method: "GET",
        endpoint: "api/list/municipios",
        params: null,
        headers: null,
    },
    departamento_expedicion_id: {
        method: "GET",
        endpoint: "api/list/departamentos",
        params: null,
        headers: null,
    },
    municipio_expedicion_id: {
        method: "GET",
        endpoint: "api/list/municipios",
        params: null,
        headers: null,
    },
    departamento_domicilio_id: {
        method: "GET",
        endpoint: "api/list/departamentos",
        params: null,
        headers: null,
    },
    municipio_domicilio_id: {
        method: "GET",
        endpoint: "api/list/municipios",
        params: null,
        headers: null,
    },
    area_id: {
        method: "GET",
        endpoint: "api/list/areas",
        params: null,
        headers: null,
    },
    cargo_id: {
        method: "GET",
        endpoint: "api/list/cargos",
        params: null,
        headers: null,
    },
    perfil_id: {
        method: "GET",
        endpoint: "api/list/perfiles",
        params: null,
        headers: null,
    },
    empleado_usuario_id: {
        method: "GET",
        endpoint: "api/list/empleadosActivosYsinUsuario",
        params: null,
        headers: null,
    },
    cliente_usuario_id: {
        method: "GET",
        endpoint: "api/list/clientesActivosYsinUsuario",
        params: null,
        headers: null,
    },
    estructura_id: {
        method: "GET",
        endpoint: "api/list/estructurasProyectoActivas",
        params: null,
        headers: null,
    },
    codigo_estructura: {
        method: "GET",
        endpoint: "api/estructuras/next-codigo",
        params: null,
        headers: null,
    },
    actividad_id: {
        method: "GET",
        endpoint: "api/list/actividadesOrdenEtapa",
        params: null,
        headers: null,
    },
});

const findFieldIndexByName = (name) => {
    return fields.value.findIndex(field => field.name === name);
};

const findFieldIndexById = (id) => {
    return fields.value.findIndex(field => field.id === id);
};

const findFieldDataIndexByName = (name) => {
    return fieldsData.value.findIndex(field => field.name === name);
};

const findFieldDataIndexById = (id) => {
    return fieldsData.value.findIndex(field => field.id === id);
};
const changeFieldApiCall = (index, params) => {
    fields.value[index].api_call = predefinedApiCalls.value[fields.value[index].name];
    fields.value[index].api_call.params = params;
};

const clearFieldItemsSelect = (index) => {
    delete fields.value[index].items_select;
};
const createSingleField = async (index) => {
    clearFieldItemsSelect(index);
    fieldsData.value[index] = await formsHelper.createFieldElement(fields.value[index]);
};

const relatedAttributes = ref({
    pais_id: 'departamento_id',
    departamento_id: 'municipio_id',
    pais_nacimiento_id: 'departamento_nacimiento_id',
    departamento_nacimiento_id: 'municipio_nacimiento_id',
    pais_expedicion_id: 'departamento_expedicion_id',
    departamento_expedicion_id: 'municipio_expedicion_id',
    pais_domicilio_id: 'departamento_domicilio_id',
    departamento_domicilio_id: 'municipio_domicilio_id',
    proceso_id: 'area_id',
    area_id: 'cargo_id',
    cargo_id: 'perfil_id',
    proyecto_id: 'estructura_id',
    estructura_id: 'orden_id',
    orden_id: 'actividad_id',
    "general": 'rango_fechas',
    "por-empleado": 'empleado_id',
    "por-ano": 'year',
    "por-mes": 'month',
    "por-cliente": 'cliente_id',
    "por-rango-fechas": 'rango_fechas',
    "por-proyecto": 'proyecto_id',
});

// Watching for some form attributes.
const watchForAttributes = ref(['pais_id', 'departamento_id', 'municipio_id', 'pais_nacimiento_id', 'departamento_nacimiento_id', 'pais_expedicion_id', 'departamento_expedicion_id', 'pais_domicilio_id', 'departamento_domicilio_id', 'proceso_id', 'area_id', 'cargo_id', 'role_user', 'fecha_salida', 'fecha_ingreso', 'proyecto_id', 'estructura_id', 'orden_id', 'vacacion_id', 'estado', 'obs', 'reproceso', 'etapas', 'responsables', 'tipo', 'nivel_educacion_id', 'nivel_formacion_id', 'years_experience', 'tipo_categorizacion', 'tipo_reporte']);

const activateWatchers = () => {
    watchForAttributes.value.forEach(attribute => {
        watch(
            () => formData.value[attribute],
            async (newValue, oldValue) => {

                if (newValue !== oldValue) {

                    if (attribute.startsWith('pais')) {
                        if (props.actionSelected === 'save') {
                            clearDataRelatedPais(attribute);
                        }
                        if (newValue) {
                            const fieldIndex = findFieldIndexByName(relatedAttributes.value[attribute]);
                            changeFieldApiCall(fieldIndex, { [attribute]: getIdObject(newValue) });
                            await createSingleField(fieldIndex);
                        }
                    }

                    if (attribute.startsWith('departamento')) {
                        if (props.actionSelected === 'save') {
                            clearDataRelatedDepartamento(attribute);
                        }
                        if (newValue) {
                            const fieldIndex = findFieldIndexByName(relatedAttributes.value[attribute]);
                            changeFieldApiCall(fieldIndex, { [attribute]: getIdObject(newValue) });
                            await createSingleField(fieldIndex);
                        }
                    }

                    if (props.typeForm === 'contrato') {
                        if (attribute.startsWith('proceso') || attribute.startsWith('area') || attribute.startsWith('cargo')) {
                            if (props.actionSelected === 'save') {
                                clearDataRelatedProcesoAreaCargoPerfil(attribute);
                            }
                            if (newValue) {
                                const fieldIndex = findFieldIndexByName(relatedAttributes.value[attribute]);
                                changeFieldApiCall(fieldIndex, { [attribute]: getIdObject(newValue) });
                                await createSingleField(fieldIndex);
                            }
                        }

                        if (attribute === 'tipo') {
                            if (newValue) {
                                if (newValue === 'FIJO') {
                                    const fieldIndex = findFieldIndexByName('fecha_finalizacion');
                                    fieldsData.value[fieldIndex].required = true;
                                } else {
                                    const fieldIndex = findFieldIndexByName('fecha_finalizacion');
                                    fieldsData.value[fieldIndex].required = false;
                                }
                            }
                        }
                    }

                    if (attribute === 'role_user') {
                        if (newValue) {
                            changeItemByAttributeRoleUser(newValue);
                        }
                    }

                    if (attribute === 'fecha_salida') {
                        if (newValue && formData.value['fecha_ingreso']) {
                            validateAndCalculateDays()
                        }
                    }

                    if (attribute === 'fecha_ingreso') {
                        if (newValue) {
                            if (!formData.value['fecha_salida']) {
                                Swal.fire({
                                    title: 'Error',
                                    text: 'Debes seleccionar la fecha de salida antes de la fecha de ingreso.',
                                    icon: 'error',
                                    confirmButtonText: 'Aceptar',
                                });
                                formData.value['fecha_ingreso'] = null;
                            } else {
                                validateAndCalculateDays()
                            }
                        }
                    }

                    if (props.typeForm === 'planeacion' || props.typeForm === 'addTask') {

                        if (attribute === 'proyecto_id') {
                            if (props.actionSelected === 'planning') {
                                clearDataRelatedProyecto(attribute);
                            }
                            if (newValue) {
                                const fieldIndex = findFieldIndexByName('estructura_id');
                                changeFieldApiCall(fieldIndex, { [attribute]: getIdObject(newValue) });
                                await createSingleField(fieldIndex);
                            }
                        }

                        if (attribute === 'estructura_id') {
                            if (props.actionSelected === 'planning') {
                                clearDataRelatedEstructura(attribute);
                            }
                            if (newValue) {
                                const response = await getActiveOrdenByEstructura(newValue.id);
                                if (!response) {
                                    formData.value['estructura_id'] = null;
                                    formData.value['orden_id'] = null;
                                } else {
                                    formData.value['orden_id'] = response;
                                }
                            }
                        }
                    }

                    if (props.typeForm === 'addTask') {
                        if (attribute === 'orden_id') {
                            if (newValue) {
                                const fieldIndex = findFieldIndexByName(relatedAttributes.value[attribute]);
                                changeFieldApiCall(fieldIndex, { [attribute]: getIdObject(newValue) });
                                await createSingleField(fieldIndex);
                            }
                        }
                    }

                    if (props.typeForm === 'misActividades') {
                        if (attribute === 'proyecto_id') {
                            if (newValue) {
                                const fieldIndex = findFieldIndexByName('estructura_id');
                                changeFieldApiCall(fieldIndex, { [attribute]: getIdObject(newValue) });
                                await createSingleField(fieldIndex);
                            }
                        }
                    }

                    if (attribute === 'reproceso') {
                        let showAttribute = newValue === "SI" ? true : false
                        hideOrShowFieldByName(['causa_reproceso_id'], showAttribute)
                    }

                    if (attribute === 'etapas') {
                        const includeAll = newValue && newValue.some(item => item.id === 'all');
                        if (includeAll) {
                            formData.value['etapas'] = fieldsData.value[findFieldDataIndexByName('etapas')].items_select.filter(item => item.id !== 'all');
                        }
                    }

                    if (props.typeForm === 'categorizacion') {
                        if (attribute === 'nivel_educacion_id' || attribute === 'nivel_formacion_id' || attribute === 'years_experience') {

                            if (attribute === 'years_experience') {
                                formData.value['nivel_experiencia_id'] = getLevelExperienceByYears(newValue, fieldsData.value[findFieldDataIndexByName('nivel_experiencia_id')].items_select);
                            }

                            if (!newValue) {
                                if (attribute === 'years_experience') {
                                    formData.value['nivel_experiencia_id'] = null;
                                }
                            }

                            const puntajePorFormacion = (formData.value['nivel_formacion_id']?.calificacion ?? 0);
                            const puntajePorEducacion = (formData.value['nivel_educacion_id']?.calificacion ?? 0);

                            const yearsExperience = formData.value['years_experience'] ?
                                parseFloat(formData.value['years_experience']) : 0;
                            const puntajePorExperiencia = await getPuntajeByYearsExperience(yearsExperience);

                            formData.value['puntaje_obtenido'] = parseFloat((puntajePorFormacion + puntajePorEducacion + puntajePorExperiencia).toFixed(2));

                            if (formData.value['puntaje_obtenido'] > 100) {
                                formData.value['puntaje_obtenido'] = 100
                            }

                            const response = await getCategorizacion(formData.value['puntaje_obtenido'])

                            formData.value['categoria_obtenida_id'] = response.categoria_obtenida
                            formData.value['salario_segun_categorizacion'] = response.salario_segun_categorizacion
                        }

                        if (attribute === 'tipo_categorizacion') {
                            if (newValue) {
                                const isExterna = newValue === 'EXTERNA';
                                const isInterna = newValue === 'INTERNA';

                                // Update 'nombre' field visibility
                                let fieldIndexNombre = findFieldIndexByName('nombre');
                                fieldsData.value[fieldIndexNombre].show = isExterna;
                                fields.value[fieldIndexNombre].show = isExterna;

                                // Update 'empleado_id' field visibility
                                let fieldIndexEmpleadoId = findFieldIndexByName('empleado_id');
                                fieldsData.value[fieldIndexEmpleadoId].show = isInterna;
                                fields.value[fieldIndexEmpleadoId].show = isInterna;

                                // Update 'salario_solicitado' field visibility
                                let fieldIndexSalarioSolicitado = findFieldIndexByName('salario_solicitado');
                                fieldsData.value[fieldIndexSalarioSolicitado].show = isExterna;
                                fields.value[fieldIndexSalarioSolicitado].show = isExterna;
                            }
                        }
                    }

                    if (props.typeForm === 'relacionCategorizacionEmpleado') {
                        if (attribute === 'nivel_educacion_id' || attribute === 'nivel_formacion_id' || attribute === 'years_experience') {

                            if (attribute === 'years_experience') {
                                formData.value['nivel_experiencia_id'] = getLevelExperienceByYears(newValue, fieldsData.value[findFieldDataIndexByName('nivel_experiencia_id')].items_select);
                            }

                            if (!newValue) {
                                if (attribute === 'years_experience') {
                                    formData.value['nivel_experiencia_id'] = null;
                                }
                            }
                        }
                    }

                    if (props.typeForm === 'reportesCategorizacion' || props.typeForm === 'reportesUsuariosBloqueados' || props.typeForm === 'filteredAnswersSurvey' || props.typeForm === 'reportesMisReportes') {
                        if (attribute === 'tipo_reporte') {

                            if (newValue) {
                                let slugNewValue = slug(newValue);
                                if (relatedAttributes.value[slugNewValue]) {
                                    const fieldIndex = findFieldIndexByName(relatedAttributes.value[slugNewValue]);
                                    if (fieldIndex !== -1) {
                                        fieldsData.value[fieldIndex].show = true;
                                        fields.value[fieldIndex].show = true;
                                    }
                                }
                            }

                            if (oldValue) {
                                let slugOldValue = slug(oldValue);
                                if (relatedAttributes.value[slugOldValue]) {
                                    const oldFieldIndex = findFieldIndexByName(relatedAttributes.value[slugOldValue]);
                                    if (oldFieldIndex !== -1) {
                                        fieldsData.value[oldFieldIndex].show = false;
                                        fields.value[oldFieldIndex].show = false;
                                        delete formData.value[relatedAttributes.value[slugOldValue]];
                                    }
                                }
                            }

                            const yearFieldIndex = findFieldIndexByName('year');
                            fieldsData.value[yearFieldIndex].items_select = [
                                new Date().getFullYear(),
                                new Date().getFullYear() - 1
                            ];
                            fields.value[yearFieldIndex].items_select = [
                                new Date().getFullYear(),
                                new Date().getFullYear() - 1
                            ];
                        }
                    }

                    // if (props.typeForm === 'actividadesOrdenEtap' && attribute === 'responsables') {

                    //     if (!newValue) return;

                    //     await nextTick();
                    //     const responsablesAssigned = newValue?.length ? newValue.map(responsable => responsable.id) : [];
                    //     const oldResponsablesAssigned = oldValue?.length ? oldValue.map(responsable => responsable.id) : [];

                    //     // Eliminar los responsables que ya no están asignados.
                    //     if (oldResponsablesAssigned.length > 0) {
                    //         const responsablesToRemove = oldResponsablesAssigned.filter(responsable => !responsablesAssigned.includes(responsable));

                    //         if (responsablesToRemove.length > 0) {
                    //             responsablesToRemove.forEach(responsableId => {
                    //                 const fieldIndex = findFieldIndexByName(responsableId);
                    //                 fields.value.splice(fieldIndex, 1);
                    //                 fieldsData.value.splice(fieldIndex, 1);
                    //                 delete formData.value[responsableId];
                    //             });
                    //         }
                    //     }
                    //     Agregar los nuevos responsables asignados.
                    //     newValue.forEach(async (responsable) => {
                    //         console.log('new responsable', responsable)
                    //         if (!oldResponsablesAssigned.includes(responsable.id)) {//No volver a setear los campos de fecha_planeada a los responsables que ya estaban.
                    //             Asignar valores a formData de los campos de fecha_planeada del responsable

                    //             const asignacion = responsable.asignaciones.find(asignacion =>
                    //                 asignacion.actividad_id === formData.value['actividad_id'] && asignacion.orden_id === formData.value['orden_id']);

                    //             console.log('asignacion para', responsable.id, asignacion)

                    //             const { fecha_inicio_planeada, fecha_entrega_planeada } = asignacion ?? {};
                    //             const fechasPlaneadas = fecha_inicio_planeada && fecha_entrega_planeada ? [fecha_inicio_planeada, fecha_entrega_planeada] : null;

                    //             formData.value[responsable.id] = fechasPlaneadas ? parseStoreRangeDates(fechasPlaneadas) : null;

                    //             Generar campos de fecha_planeada para cada responsable
                    //             let tiempo_planeado = asignacion?.tiempo_planeado ?? 0;

                    //             const newFieldDate = {
                    //                 type_element: "date-range",
                    //                 id: responsable.id,
                    //                 name: responsable.id,
                    //                 label: responsable.show_data + ' - ' + formatHours(tiempo_planeado),
                    //                 cols_desktop: "md:basis-1/3",
                    //                 cols_mobile: "basis-full",
                    //                 disabled_dates: asignacion?.fechas_no_disponibles ?? [],
                    //                 disabled: true,
                    //             }
                    //             fields.value.push(newFieldDate)
                    //             const lastIndexField = fields.value.length - 1
                    //             createSingleField(lastIndexField)

                    //             Observar cambios en los campos de fecha_planeada del responsable
                    //             addResponsableToWatchers(responsable.id);
                    //         }
                    //     });
                    // }
                }
            },
            { immediate: false }
        );
    })
};

const validateAndCalculateDays = async () => {
    const dateSalida = new Date(formData.value['fecha_salida']);
    const dateIngreso = new Date(formData.value['fecha_ingreso']);
    if (dateIngreso <= dateSalida) {
        Swal.fire({
            title: 'Error',
            text: 'La fecha de ingreso no puede ser antes o igual a la fecha de salida.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
        });
        formData.value['fecha_ingreso'] = null;
    } else {
        const { diasHabiles, diasCalendario } = await businessDays(formData.value['fecha_salida'], formData.value['fecha_ingreso']);
        formData.value['nro_dias_habiles'] = diasHabiles;
        formData.value['nro_dias_calendario'] = diasCalendario;
    }
}
// Watching for typeForm 
watch(
    () => props.typeForm,
    async (newValue) => {

    },
    { immediate: true }
);

const changeItemByAttributeRoleUser = async (newValue) => {
    if (newValue === 'EMPLEADO' || newValue === 'CLIENTE') {
        const fieldIndex = findFieldIndexByName('model_id');

        fieldsData.value[fieldIndex].show = true;
        fields.value[findFieldIndexByName('model_id')].show = true;

        formData.value.model_id = null;

        fieldsData.value[fieldIndex].label = newValue === 'EMPLEADO' ? 'Empleado' : 'Cliente';
        fields.value[fieldIndex].label = newValue === 'EMPLEADO' ? 'Empleado' : 'Cliente';

        fieldsData.value[fieldIndex].api_call = predefinedApiCalls.value[newValue.toLowerCase() + '_usuario_id'];
        fields.value[fieldIndex].api_call = predefinedApiCalls.value[newValue.toLowerCase() + '_usuario_id'];

        await createSingleField(fieldIndex);
    } else {
        fieldsData.value[findFieldDataIndexByName('model_id')].show = false;
        fields.value[findFieldIndexByName('model_id')].show = false;
        delete formData.value.model_id;
    }
};

const hideOrShowFieldByName = (names, value) => {
    names.forEach(name => {
        const index = findFieldIndexByName(name);
        fields.value[index].show = value;
        fieldsData.value[index].show = value;
    });
};

const clearDataRelatedProyecto = (attribute) => {
    formData.value[relatedAttributes.value[attribute]] = null;
    formData.value[relatedAttributes.value[relatedAttributes.value[attribute]]] = null;
    fieldsData.value[findFieldDataIndexByName(relatedAttributes.value[attribute])].items_select = [];
    fieldsData.value[findFieldDataIndexByName(relatedAttributes.value[relatedAttributes.value[attribute]])].items_select = [];
};

const clearDataRelatedEstructura = (attribute) => {
    formData.value[relatedAttributes.value[attribute]] = null;
    fieldsData.value[findFieldDataIndexByName(relatedAttributes.value[attribute])].items_select = [];
};

const clearDataRelatedPais = (attribute) => {
    formData.value[relatedAttributes.value[attribute]] = null;
    formData.value[relatedAttributes.value[relatedAttributes.value[attribute]]] = null;
    fieldsData.value[findFieldDataIndexByName(relatedAttributes.value[attribute])].items_select = [];
    fieldsData.value[findFieldDataIndexByName(relatedAttributes.value[relatedAttributes.value[attribute]])].items_select = [];
};

const clearDataRelatedDepartamento = (attribute) => {
    formData.value[relatedAttributes.value[attribute]] = null;
    fieldsData.value[findFieldDataIndexByName(relatedAttributes.value[attribute])].items_select = [];
};

const clearDataRelatedProcesoAreaCargoPerfil = (attribute) => {
    formData.value[relatedAttributes.value[attribute]] = null;
    fieldsData.value[findFieldDataIndexByName(relatedAttributes.value[attribute])].items_select = [];

    if (attribute.startsWith('proceso')) {
        formData.value[relatedAttributes.value[relatedAttributes.value[attribute]]] = null;
        fieldsData.value[findFieldDataIndexByName(relatedAttributes.value[relatedAttributes.value[attribute]])].items_select = [];

        formData.value[relatedAttributes.value[relatedAttributes.value[relatedAttributes.value[attribute]]]] = null;
        fieldsData.value[findFieldDataIndexByName(relatedAttributes.value[relatedAttributes.value[relatedAttributes.value[attribute]]])].items_select = [];
    }

    if (attribute.startsWith('area')) {
        formData.value[relatedAttributes.value[relatedAttributes.value[attribute]]] = null;
        fieldsData.value[findFieldDataIndexByName(relatedAttributes.value[relatedAttributes.value[attribute]])].items_select = [];
    }
};

const refreshField = async (fieldName) => {
    setRefresingField(true)
    const fieldIndex = findFieldIndexByName(fieldName);
    await createSingleField(fieldIndex);
    setRefresingField(false, 500)
};

const addEntitys = {
    persona_id: 'persona',
}
const modalTitles = {
    persona_id: 'Persona'
}
const modalTitle = ref('')
const typeEntity = ref('')

const addEntity = async (name) => {
    let entity;
    entity = name;

    modalTitle.value = modalTitles[entity]
    typeEntity.value = addEntitys[entity]
    isModalOpen.value = true
}
const clearEntity = () => {
    modalTitle.value = ''
    typeEntity.value = ''
}

const handleSubmit = async () => {
    await validateForm()
    if (emptyErrors.value) {
        const structureData = structureJsonData(formData.value);
        console.log('structureData', structureData)
        const dataForm = jsonToDataForm(structureData);
        setLoadingForm(true)
        try {
            await actionsForm[props.actionSelected](dataForm);
            clearFormErrors()
            clearFormData()
            clearEntity()
            emit("closeModal")
            nextTick(async () => {
                await initDefaultValues()
            });
        } catch (error) {
            showErrorMessage(error)
        }
        setLoadingForm(false)
    }
};
const jsonToDataForm = (json) => {
    const dataForm = new FormData();
    Object.entries(json).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            appendArrayToFormData(dataForm, key, value);
        } else if (typeof value === 'object' && value !== null) {
            appendObjectToFormData(dataForm, key, value);
        } else if (typeof value === 'boolean' || typeof value === 'number') {
            dataForm.append(key, value);
        } else if (value !== null && value !== undefined) {
            dataForm.append(key, value);
        }
    });
    return dataForm;
};
const appendArrayToFormData = (dataForm, key, array) => {
    array.forEach((item, index) => {
        if (item instanceof File) {
            dataForm.append(`${key}[${index}]`, item, item.name);
        } else if (typeof item === 'object' && !Array.isArray(item)) {
            appendObjectToFormData(dataForm, `${key}[${index}]`, item);
        } else {
            dataForm.append(`${key}[]`, item);
        }
    });
};
const appendObjectToFormData = (dataForm, key, object) => {
    Object.entries(object).forEach(([subKey, subValue]) => {
        dataForm.append(`${key}[${subKey}]`, subValue);
    });
};

const formatCurrency = (value) => {
    const formatter = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    return formatter.format(value).trim().replace(/\s/g, '');
};
const handlersStructureJsonData = {
    hora: value => value ? formatStoreTime(value.hours, value.minutes, value.seconds) : null,
    fecha: value => value && !isNaN(Date.parse(value)) ? formatStoreDate(value) : null,
    range: value => value = {
        startDate: value[0] ? formatStoreDate(value[0]) : null,
        endDate: value[1] ? formatStoreDate(value[1]) : null,
    },
    valor: value => value ? formatCurrency(value) : null,
    object: value => ('id' in value) ? value.id : value,
    default: value => value
};

const getHandlerKey = (key, value) => {
    const index = findFieldDataIndexByName(key);
    const field = fieldsData.value[index];
    return field && field.show ? field.type_element === 'time' ? 'hora' :
        field.type_element === 'date' ? 'fecha' :
            field.type_element === 'date-range' ? 'range' :
                field.type_element === 'price' ? 'valor' :
                    value === null ? 'default' :
                        typeof value === 'object' ? 'object' :
                            'default' : 'default';
};
const structureJsonData = (formData) => {
    const structuredData = {};
    Object.entries(formData).forEach(([key, value]) => {
        const handlerKey = getHandlerKey(key, value);
        const handler = handlersStructureJsonData[handlerKey];
        structuredData[key] = handler(value);
    });
    return structuredData;
};

const sendForm = async (dataForm) => {
    for (const [key, value] of dataForm.entries()) {
        console.log(key, value);
    }
    try {
        const response = await fetch(`${backendUrlFC}/api/save/form/${props.typeForm}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token.value}`,
                Accept: "application/json",
            },
            mode: "cors",
            body: dataForm,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new HttpError(data.message, response.status);
        }

        if (data.newRow) {
            await new Promise(resolve => {
                emit("updateRow", props.rowSelected.id, data.newRow);
                resolve();
            });
        }

        if (data.extraData) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: data.message,
                html: extraDataToPrettyFormat(data.extraData),
                showConfirmButton: true,
            })
            return;
        }

        Swal.fire({
            position: "center",
            icon: response.status === 200 ? "success" : "error",
            title: data.message,
            showConfirmButton: true,
        });
        return;

    } catch (error) {
        showErrorMessage(error)
    }
};

const editForm = async (dataForm) => {
    console.log('editForm')
    for (const [key, value] of dataForm.entries()) {
        console.log(key, value);
    }
    try {
        const response = await fetch(`${backendUrlFC}/api/edit/form/${props.typeForm}/${props.rowSelected.id}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token.value}`,
                Accept: "application/json",
            },
            mode: "cors",
            body: dataForm,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new HttpError(data.message, response.status);
        }

        if (data.newRow) {
            console.log('Actualizando fila', data.newRow, ' en el formulario', props.typeForm);
            emit("updateRow", props.rowSelected.id, data.newRow);
        }

        if (data.extraData) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: data.message,
                html: extraDataToPrettyFormat(data.extraData),
                showConfirmButton: true,
            })
        } else {
            Swal.fire({
                position: "center",
                icon: "success",
                title: data.message,
                showConfirmButton: true,
            });
        }
    } catch (error) {
        showErrorMessage(error)
    }
};

const actionsForm = {
    edit: value => editForm(value),
    save: async (value) => await sendForm(value),
    download_document_contract: value => downloadDocumentContract(value),
    approve_reject_permission: async (value) => await sendForm(value),
    download_reporte_gh: value => downloadReporteGH(value),
    add_structure: async (value) => await sendForm(value),
    approve_reject_vacation: async (value) => await sendForm(value),
    add_order: value => addOrder(value),
    planning: value => showPlanningTable(value),
    request_vacation: value => requestVacation(value),
    my_activities: value => showMyActivitiesTable(value),
    report_hours: async (value) => await sendForm(value),
    assign_responsabilitites: value => assignResponsabilitites(value),
    add_task: value => addTask(value),
    download_report_categorization: async (value) => await downloadReportCategorization(value),
    add_email_survey: async (value) => await sendForm(value),
    download_filtered_answers_survey: async (value) => await downloadFilteredAnswersSurvey(value),
};

const addTask = () => {
    emit('addTask', formData.value)
}

const showPlanningTable = async () => {
    sendDataViaEventBus({
        actionSelected: 'show_planning_table',
        ordenId: formData.value['orden_id']?.id,
        infoEstructura: formData.value['estructura_id']
    })
    await getDataFromEventBus()
}

const showMyActivitiesTable = async () => {
    sendDataViaEventBus({
        actionSelected: 'show_my_activities_table',
        estructura: {
            id: formData.value['estructura_id']?.id
        },
    })
    await getDataFromEventBus()
}

const downloadFilteredAnswersSurvey = async (dataForm) => {
    let fileName = '';
    let typeDocument = '';

    fileName = dataForm.get('tipo_reporte');
    const sluggedValue = slug(fileName);
    dataForm.set('tipo_reporte', sluggedValue);
    typeDocument = sluggedValue;

    let mapUrl = {
        'por-rango-fechas': `respuesta-encuesta-${typeDocument}/${null}/${dataForm.get('rango_fechas[startDate]')}/${dataForm.get('rango_fechas[endDate]')}`,
        'por-cliente': `respuesta-encuesta-${typeDocument}/${dataForm.get('cliente_id')}`,
        'por-ano': `respuesta-encuesta-${typeDocument}/${dataForm.get('year')}`,
    };

    const url = `${backendUrlFC}/api/download/${mapUrl[typeDocument]}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.value}`,
                'Accept': 'application/pdf'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            showErrorMessage(new HttpError(errorData.message, response.status));
        }
        const contentType = response.headers.get('Content-Type');

        const contentTypeToExtension = {
            'application/pdf': 'pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            'application/msword': 'doc',
            'application/vnd.ms-excel': 'xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        };
        const fileExtension = contentTypeToExtension[contentType] || 'txt';

        fileName = `${fileName} - ${formatPrettyDate(new Date())}.${fileExtension}`;

        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        showErrorMessage(error);
    }
}

const assignResponsabilitites = async (dataForm) => {
    try {
        const responsables = [];
        const formDataEntries = dataForm.entries();

        for (let [key, value] of formDataEntries) {
            const match = key.match(/^responsables\[(\d+)\]\[(id|show_data)\]$/);
            if (match) {
                const index = match[1];
                const field = match[2];

                if (!responsables[index]) {
                    responsables[index] = {};
                }

                if (field === 'id') {
                    responsables[index].id = value;
                } else if (field === 'show_data') {
                    responsables[index].nombre = value;
                }
            }
        }
        // Filtrar elementos no definidos
        const filteredResponsables = responsables.filter(responsable => responsable !== undefined).map(responsable => {
            return responsable.id;
        });

        if (filteredResponsables.length === 0) {
            Swal.fire({
                title: 'Error',
                text: 'Debes seleccionar al menos un responsable.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#EC7522',
            });
            return;
        }

        formData.value['assigned_dates'] = []
        filteredResponsables.forEach(responsableId => {
            const fechaInicio = formData.value[responsableId][0];
            const fechaFin = formData.value[responsableId][1];

            formData.value['assigned_dates'].push({
                responsable_id: Number(responsableId),
                fecha_inicio_planeada: formatStoreDate(fechaInicio),
                fecha_entrega_planeada: formatStoreDate(fechaFin),
                tiempo_planeado: getLaboralTimeBetweenTwoDates(fechaInicio, fechaFin)
            });
            delete formData.value[responsableId];
        });

        dataForm = jsonToDataForm(structureJsonData(formData.value));

        await sendForm(dataForm);

    } catch (error) {
        showErrorMessage(error)
    }
};

async function obtenerFechasResponsables(responsables) {
    const fechas = [];

    for (const [index, responsable] of responsables.entries()) {
        const result = await Swal.fire({
            title: `Responsable ${responsable.nombre}`,
            html: `
                <label for="fecha_inicio_responsable_${index}" class="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                <input type="date" id="fecha_inicio_responsable_${index}" name="fecha_inicio_responsable_${index}" class="mt-1 focus:ring-cyan-500 focus:border-cyan-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                <label for="fecha_entrega_responsable_${index}" class="block text-sm font-medium text-gray-700">Fecha de Entrega</label>
                <input type="date" id="fecha_entrega_responsable_${index}" name="fecha_entrega_responsable_${index}" class="mt-1 focus:ring-cyan-500 focus:border-cyan-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
            `,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#EC7522',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            const fechaInicio = document.getElementById(`fecha_inicio_responsable_${index}`).value;
            const fechaEntrega = document.getElementById(`fecha_entrega_responsable_${index}`).value;

            fechas.push({ fechaInicio, fechaEntrega });
        }
    }

    return fechas;
}

const saturday = 6;
const sunday = 0;

const datesDisabled = (date, ranges) => {
    if (!date) return false; // Asegurarse de que la fecha esté definida

    if (ranges.length === 0) return false; // Si no hay rangos, no deshabilitar

    console.log('date', date);
    console.log("\n\n");
    const today = parseStoreDate(getToday());

    if (compareDatesLess(date, today)) return true;

    // Deshabilitar sábados y domingos
    const saturday = 6, sunday = 0;

    if (date.getDay() === saturday || date.getDay() === sunday) return true;

    // Convertir las cadenas de fechas a objetos Date
    const convertedRanges = ranges.map(range =>
        range.map(dates => ({
            start: parseStoreDate(dates.start),
            end: parseStoreDate(dates.end)
        }))
    );

    // Verificar si la fecha está en alguno de los rangos
    return convertedRanges.some(range =>
        range.some(dates => {
            return date >= dates.start && date <= dates.end;
        })
    );
};


const addOrder = (dataForm) => {
    return Swal.fire({
        title: '¿Estás seguro?',
        text: 'Está será la nueva orden activa, las demás quedarán inactivas.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, crear Orden',
        confirmButtonColor: '#EC7522',
        cancelButtonText: 'Cancelar',
    }).then(async (result) => {
        if (result.isConfirmed) {
            await sendForm(dataForm);
        }
    });
}

const requestVacation = async (dataForm) => {
    try {
        if (formData.value['nro_dias_habiles'] > formData.value['dias_disponibles']) {
            Swal.fire({
                title: 'Error',
                text: 'No puedes solicitar más días de los que tienes disponibles.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
            return;
        }
        await sendForm(dataForm);
    } catch (error) {
        showErrorMessage(error)
    }
};

const downloadDocumentContract = async (dataForm) => {
    let fileName = '';
    let typeDocument = '';

    fileName = dataForm.get('type_file');
    const sluggedValue = slug(fileName);
    dataForm.set('type_file', sluggedValue);
    typeDocument = sluggedValue;

    const url = `${backendUrlFC}/api/download/${typeDocument}/${props.rowSelected.id}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.value}`,
                'Accept': 'application/pdf'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            showErrorMessage(new HttpError(errorData.message, response.status));
        }
        const contentType = response.headers.get('Content-Type');

        const contentTypeToExtension = {
            'application/pdf': 'pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            'application/msword': 'doc',
            'application/vnd.ms-excel': 'xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        };
        const fileExtension = contentTypeToExtension[contentType] || 'txt';

        fileName = `${fileName} - ${props.rowSelected.persona.nombre_completo} - ${formatPrettyDate(new Date())}.${fileExtension}`;

        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error('Error:', error);
        showErrorMessage(error)
    }
}

const downloadReporteGH = async (dataForm) => {
    let fileName = '';
    let typeDocument = '';

    fileName = dataForm.get('tipo_reporte');
    const sluggedValue = slug(fileName);
    dataForm.set('tipo_reporte', sluggedValue);
    typeDocument = sluggedValue;

    const url = `${backendUrlFC}/api/download/${typeDocument}/${dataForm.get('empresa_id')}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.value}`,
                'Accept': 'application/pdf'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            showErrorMessage(new HttpError(errorData.message, response.status));
        }
        const contentType = response.headers.get('Content-Type');

        const contentTypeToExtension = {
            'application/pdf': 'pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            'application/msword': 'doc',
            'application/vnd.ms-excel': 'xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        };
        const fileExtension = contentTypeToExtension[contentType] || 'txt';

        fileName = `${fileName} - ${formatPrettyDate(new Date())}.${fileExtension}`;

        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error('Error:', error);
    }
}

const downloadReportCategorization = async (dataForm) => {
    let fileName = '';
    let typeDocument = '';

    fileName = dataForm.get('tipo_reporte');
    const sluggedValue = slug(fileName);
    dataForm.set('tipo_reporte', sluggedValue);
    typeDocument = sluggedValue;

    let mapUrl = {
        'general': `categorizacion-${typeDocument}/${null}/${dataForm.get('rango_fechas[startDate]')}/${dataForm.get('rango_fechas[endDate]')}`,
        'por-empleado': `categorizacion-${typeDocument}/${dataForm.get('empleado_id')}`,
        'por-ano': `categorizacion-${typeDocument}/${dataForm.get('year')}`,
    };

    const url = `${backendUrlFC}/api/download/${mapUrl[typeDocument]}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.value}`,
                'Accept': 'application/pdf'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            showErrorMessage(new HttpError(errorData.message, response.status));
        }
        const contentType = response.headers.get('Content-Type');

        const contentTypeToExtension = {
            'application/pdf': 'pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            'application/msword': 'doc',
            'application/vnd.ms-excel': 'xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        };

        const fileExtension = contentTypeToExtension[contentType] || 'txt';

        fileName = `Categorización - ${fileName} - ${formatPrettyDate(new Date())}.${fileExtension}`;

        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        console.error('Error:', error);
    }
}

const getStatusClass = (value) => {
    const statusClass = {
        'CANCELADA': 'text-red-500 bg-red-100/60',
        'PAGADA': 'text-emerald-500 bg-emerald-100/60',
        'POR PAGAR': 'text-yellow-600 bg-yellow-100/60',
    };
    return statusClass[value] || 'text-cyan-600 bg-cyan-100/60';
}

const extraDataToPrettyFormat = (extraData) => {
    let prettyFormat = '';
    if (extraData.title) {
        prettyFormat += `<h2 class="text-center text-lg font-bold">${extraData.title}</h2><hr><br>`;
        delete extraData.title;
    }
    prettyFormat += '<ul class="list-disc list-inside">';
    for (let key in extraData) {
        if (key.startsWith('Estado')) {
            let value = extraData[key];
            let statusClass = getStatusClass(value);
            prettyFormat += `<li><div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 dark:bg-gray-800 ${statusClass}"><h2 class="text-sm font-normal"><span class="font-bold">${key}</span>: ${value}</h2></div></li>`;
        } else if (key.startsWith('Saldo')) {
            prettyFormat += `<li><div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 dark:bg-gray-800 text-cyan-600 bg-cyan-100/60"><h2 class="text-sm font-normal"><span class="font-bold">${key}</span>: ${extraData[key]}</h2></div></li>`;
        } else {
            prettyFormat += `<li><div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 dark:bg-gray-800"><h2 class="text-sm font-normal"><span class="font-bold">${key}</span>: ${extraData[key]}</h2></div></li>`;
        }
    }
    prettyFormat += '</ul>';
    return prettyFormat;
}
const clearComponentData = () => {
    fields.value = []
    fieldsData.value = []
    clearFormData()
    clearFormErrors()
    clearEntity()
}

const clearFormData = () => {
    formData.value = {}
}

const clearFormErrors = () => {
    formErrors.value = {};
};
const formsToValidateDates = {
    contrato: ['fecha_contratacion', 'fecha_finalizacion'],
    vacacione: ['fecha_salida', 'fecha_ingreso'],
    incapacidad: ['fecha_inicio_periodo', 'fecha_fin_periodo'],
    licencia: ['fecha_inicio_periodo', 'fecha_fin_periodo'],
}
const validateForm = async () => {
    clearErrors()

    // Validar campos requeridos, email y número
    for (const field of fieldsData.value) {
        if (field.show) {
            isFieldEmpty(field)
            isFieldEmail(field)
            isFieldNumberExeceded(field)
        }
        console.log('---------------------')
    }

    // Validar fechas de inicio y fin
    if (formsToValidateDates[props.typeForm]) {
        isFieldsDatesEndAfterStartDate(formsToValidateDates[props.typeForm])
    }
}
const isFieldsDatesEndAfterStartDate = (fields) => {
    if (formData.value[fields[0]] && formData.value[fields[1]] && formData.value[fields[0]] >= formData.value[fields[1]] && !formErrors.value[fields[0]] && !formErrors.value[fields[1]]) {
        const fieldStart = fieldsData.value[findFieldDataIndexByName(fields[0])];
        const fieldEnd = fieldsData.value[findFieldDataIndexByName(fields[1])];
        if (fieldStart && fieldEnd) {
            formErrors.value[fields[0]] = `${fieldStart.label} debe ser antes de ${fieldEnd.label}.`;
        }
    } else if (!formErrors.value[fields[0]] && !formErrors.value[fields[1]]) {
        delete formErrors.value[fields[0]];
    }
}
const isFieldEmpty = (field) => {
    const fieldValue = formData.value[field.name];
    const fieldExists = formData.value.hasOwnProperty(field.name);
    const fieldIsRequired = field.required;
    const isNumberField = field.type_element === 'number';

    const shouldValidate = fieldExists && fieldIsRequired;

    const isEmpty = (
        fieldValue === null ||
        fieldValue === undefined ||
        fieldValue === '' ||
        (
            typeof fieldValue !== 'boolean' &&
            (!isNumberField && !fieldValue)
        )
    );

    if (shouldValidate && isEmpty) {
        formErrors.value[field.name] = 'Campo requerido.';
        console.log('❌ Error en campo:', field.name, '| Valor:', fieldValue, '| Tipo:', field.type_element);
    } else {
        delete formErrors.value[field.name];
        console.log('✅ Campo válido:', field.name, '| Valor:', fieldValue, '| Tipo:', field.type_element);
    }
};

const isFieldEmail = (field) => {
    if (field.type_element === 'email' && formData.value[field.name]) {
        if (!isValidEmail(formData.value[field.name])) {
            formErrors.value[field.name] = 'Email no válido.'
            return
        } else {
            delete formErrors.value[field.name]
            return
        }
    }
}

const isFieldNumberExeceded = (field) => {
    if (field.type_element === 'number') {

        if (formErrors.value[field.name]) {
            return
        }
        if (formData.value[field.name] > (field.max_value ?? 9999999999) || formData.value[field.name] < (field.min_value ?? 0) || isNaN(formData.value[field.name])) {
            formErrors.value[field.name] = `${field.label} no válido.`
            return
        } if (field.name.startsWith('nro_documento') && hasLessThan8Digits(formData.value[field.name])) {
            formErrors.value[field.name] = `El ${field.label} debe tener al menos 8 dígitos.`
            return
        } else {
            delete formErrors.value[field.name]
            return
        }
    }
}
const hasLessThan8Digits = (value) => {
    return value.toString().length < 8
}

const isValidEmail = (email) => {
    const emailPattern = /^[\w.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailPattern.test(email);
}

const clearErrors = () => {
    formErrors.value = {}
}

const customLabel = (option) => {
    return option.show_data
};

const addTag = (newTag) => { };

const handleFiles = (event, fieldName) => {
    formData.value[fieldName] = Array.from(event.target.files)
};

const getFileName = (fileName) => {
    return fileName.length > 20 ? fileName.substring(0, 17) + '... ' + fileName.slice(-4) : fileName
}

const closeModal = () => {
    isModalOpen.value = false
}
</script>
<style>
/* En tu archivo de estilos globales */
.custom-shadow {
    box-shadow: 0 8px 16px rgba(255, 89, 0, 0.2),
        0 -8px 16px rgba(255, 89, 0, 0.2),
        8px 0 16px rgba(255, 89, 0, 0.2),
        -8px 0 16px rgba(255, 89, 0, 0.2);
    /* Ajusta los valores según tus necesidades */
}

.max-entity-height {
    max-height: 37rem;
}

input:checked~.dot {
    transform: translateX(100%);
}

.dot {
    transition: all 0.3s ease-in-out;
}
</style>
