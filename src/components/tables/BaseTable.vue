<template>
    <AppLoader v-if="isLoadingApp" />

    <div v-else class="w-full py-8 md:p-8 rounded-lg custom-shadow"
        :class="isMobile ? (isDarkMode ? '' : 'border-color-identity-dark-gold') : isDarkMode ? '' : 'border-color-identity-dark-gold'">
        <div v-if="props.iconsView.length > 0"
            class="flex justify-center items-center -mt-16 md:-mt-28 md:justify-end md:mb-4">
            <!-- Icono Form -->
            <component v-if="viewIcons[props.iconsView[0]]" :is="viewIcons[props.iconsView[0]]"
                class="p-4 w-20 h-20 md:w-24 md:h-24 md:mr-1/4 border-color-identity-dark-gold-thick rounded-full dark:border-gray-300"
                :class="isDarkMode ? 'bg-black text-gray-300' : 'bg-identity-dark text-identity'" />
        </div>
        <div class="flex flex-row flex-wrap">
            <section class="container">
                <!-- Bar Options -->
                <div
                    class="flex flex-col md:flex-row items-center justify-between my-2 md:my-0 md:px-6 lg:px-8  space-y-2 md:space-y-0">
                    <!-- Left: Actions -->
                    <div class="flex flex-row md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
                        <button v-for="action in props.barActions" :key="action.emit"
                            @click="emit('dynamicEvent', { eventName: action.emit, payload: payloadsMap[action.emit] ? payloadsMap[action.emit] : {} })"
                            v-tooltip="action.tooltip"
                            class="px-4 py-2 bg-cyan-100 text-cyan-800 rounded-lg hover:bg-cyan-200 focus:outline-none w-full md:w-auto border-color-identity-dark">
                            {{ action.title }}
                        </button>
                    </div>

                    <!-- Right: Search -->
                    <div v-if="showSearch" class="relative flex items-center justify-end w-full md:w-1/3">
                        <!-- Icon Search -->
                        <span class="absolute left-3">
                            <component :is="iconsForm['IconSearch']" class="text-gray-300 w-6 h-6" />
                        </span>
                        <!-- Input Search -->
                        <input v-model="search" type="text" placeholder="Search" :disabled="isSearchDateRangeDisabled"
                            :class="isSearchDateRangeDisabled ? 'bg-gray-400' : 'bg-white'"
                            class="block w-full py-2.5 rounded-lg pl-12 pr-5 rtl:pr-12 rtl:pl-5 placeholder-gray-400/70 text-gray-700 border border-gray-200 dark:border-gray-600 focus:border-orange-600 dark:focus:border-orange-300 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40">
                        <!-- Calendar Icon -->
                        <span v-if="searchDateRange?.length === 0 || !applyNowRange" @click="showDateRangePicker"
                            class="mr-2 cursor-pointer absolute right-3">
                            <component :is="iconsForm['IconCalendar']" class="text-identity-dark w-8 h-8" />
                        </span>
                        <!-- Clear Icon -->
                        <span v-else @click="clearSearchDateRange"
                            class="mr-2 cursor-pointer absolute right-3 rounded-full p-px">
                            <component :is="iconsForm['IconX']" class="text-red-500 w-5 h-5" />
                        </span>
                    </div>
                </div>
                <!-- Search -->
                <!-- <div v-if="showSearch"
                    class="relative flex items-center my-2 md:my-0 md:px-6 lg:px-8 justify-end ">
                    <div class="basis-full md:basis-1/3">
                        <span class="mt-1 ml-2 absolute">
                            <component :is="iconsForm['IconSearch']" class="text-gray-300 w-8 h-8" />
                        </span>
                        <input v-model="search" type="text" placeholder="Search" :disabled="isSearchDateRangeDisabled"
                            :class="isSearchDateRangeDisabled ? 'bg-gray-400' : 'bg-white'"
                            class="block w-full py-2.5 rounded-lg pl-11 pr-5 rtl:pr-11 rtl:pl-5 placeholder-gray-400/70 text-gray-700 border border-gray-200 dark:border-gray-600 focus:border-orange-600 dark:focus:border-orange-300 focus:ring-orange-300 focus:outline-none focus:ring focus:ring-opacity-40">
                    </div>
                    <span v-if="searchDateRange?.length === 0 || !applyNowRange" @click="showDateRangePicker"
                        class="mr-2 cursor-pointer absolute">
                        <component :is="iconsForm['IconCalendar']" class="text-identity-dark w-8 h-8" />
                    </span>
                    <span v-else @click="clearSearchDateRange" class="mr-2 cursor-pointer absolute  rounded-full p-px">
                        <component :is="iconsForm['IconX']" class="text-red-500 w-5 h-5" />
                    </span>
                </div> -->
                <!-- Div Table -->
                <div class="flex flex-col">
                    <div class="overflow-x-auto">
                        <div class="inline-block min-w-full align-middle py-2 md:px-6 lg:px-8">
                            <div class="overflow-hidden border border-gray-700 dark:border-gray-200 md:rounded-lg">
                                <!-- Table -->
                                <table class="min-w-full divide-y divide-gray-700 dark:divide-gray-200 table-fixed">
                                    <thead class="bg-identity-dark dark:bg-gray-900">
                                        <tr>
                                            <!-- Itera sobre las columnas para crear los encabezados -->
                                            <th v-for="column in filterHeaders()" :key="column.key"
                                                class="py-3.5 px-4 text-sm font-normal text-center rtl:text-right text-identity dark:text-gray-300"
                                                :class="columnClass(column.key)">
                                                <!-- Checkbox para seleccionar todos los elementos -->
                                                <span v-if="column.key === 'selectable'">
                                                    <input type="checkbox" v-model="selectAll"
                                                        class="w-4 h-4 text-identity-dark dark:text-gray-300 focus:ring-identity border-gray-300 rounded cursor-pointer">
                                                </span>
                                                <span v-else>
                                                    {{ column.header }}
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <transition-group tag="tbody" name="fade" mode="out-in"
                                        class="divide-y divide-gray-700 dark:divide-gray-200">
                                        <!-- Itera sobre las rows para crear las rows de la tabla -->
                                        <tr v-for="(row, index_row) in filterTable()" :key="index_row"
                                            :class="rowClass(row, index_row)">
                                            <!-- Itera sobre las columnas para mostrar los valores de cada celda -->
                                            <td v-for="(column, index_colum) in filterColumns()" :key="column.key"
                                                class="px-2 py-2 text-sm text-center font-medium text-gray-700 overflow-auto"
                                                :class="[row['selected'] ? 'dark:text-gray-700' : 'dark:text-gray-200']"
                                                @click="canClikOnColumn(row, column) ? selectRow(row) : null">
                                                <!-- Checkbox para seleccionar una fila -->
                                                <template v-if="column.key === 'selectable'">
                                                    <input type="checkbox" v-model="row['selected']"
                                                        class="w-4 h-4 text-identity-dark dark:text-gray-300 focus:ring-identity border-gray-300 rounded">
                                                </template>
                                                <!-- "Acciones" -->
                                                <template v-else-if="column.key === 'actions'">
                                                    <div class="flex flex-row flex-wrap justify-center">
                                                        <button v-for="action in row.actions" :key="action.key"
                                                            @click="clickAction(action.key, row)" :title="action.action"
                                                            v-tooltip="action.action"
                                                            :class="['m-1 p-1 rounded-md shadow-xl', actionIconClass(action.key), 'custom-shadow']">
                                                            <component :class="['w-5 h-5', actionIconText(action.key)]"
                                                                :is="actionsIcon(action.key)" />
                                                        </button>
                                                    </div>
                                                </template>

                                                <!-- Persona -->
                                                <template
                                                    v-else-if="column.key.startsWith('persona') || column.key.startsWith('jefe')">
                                                    <div class="flex flex-row items-center justify-center">
                                                        <span
                                                            class="text-sm font-medium text-identity-dark dark:text-gray-300">
                                                            {{ row[column.key].nombre_completo }}
                                                        </span>
                                                    </div>
                                                </template>

                                                <!-- Estado -->
                                                <template v-else-if="column.key.startsWith('estado')">
                                                    <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 dark:bg-gray-800"
                                                        :class="[statusClass(row[column.key].color)]">
                                                        <component class="w-4 h-4"
                                                            :is="statusIcon(row[column.key].color)" />
                                                        <h2 class="text-sm font-normal">
                                                            {{ row[column.key].estado }}
                                                        </h2>
                                                    </div>
                                                </template>

                                                <!-- Fecha -->
                                                <template v-else-if="column.key.startsWith('fecha')">
                                                    <div v-if="row[column.key]">
                                                        <span class="text-identity-dark dark:text-gray-300">
                                                            {{ formatPrettyDate(row[column.key]) }}
                                                        </span>
                                                    </div>
                                                    <div v-else>
                                                        <span class="text-identity-dark dark:text-gray-300">
                                                            Sin fecha.
                                                        </span>
                                                    </div>
                                                </template>

                                                <!-- Cantidad Total -->
                                                <template v-else-if="column.key.startsWith('cantidad_total')">
                                                    <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 dark:bg-gray-800"
                                                        :class="[row[column.key] === 0 ? 'text-red-800 bg-red-100/60 border border-red-500' : row[column.key] <= 5 ? 'text-yellow-800 bg-yellow-100/60 border border-yellow-500' : 'text-emerald-800 bg-emerald-100/60 border border-emerald-500']">
                                                        <h2 class="text-sm font-normal">
                                                            {{ row[column.key] }}
                                                        </h2>
                                                    </div>
                                                </template>

                                                <!-- Etapas -->
                                                <template v-else-if="column.key === 'etapas'">
                                                    <VDropdown :triggers="['click']" :placement="'top'">
                                                        <button :title="'Etapas'"
                                                            :class="['m-1 p-1 rounded-md shadow-xl', 'bg-cyan-100 border border-cyan-600', 'custom-shadow']">
                                                            <component :is="iconsForm['IconStep']"
                                                                :class="['w-5 h-5', 'text-cyan-800']" />
                                                        </button>
                                                        <template #popper>
                                                            <div class="p-4 bg-identity-2 dark:bg-gray-800">
                                                                <div v-for="etapa in row[column.key]" :key="column.key"
                                                                    class="basis-full text-sm font-normal text-center rtl:text-right text-identity dark:text-gray-300">
                                                                    <div
                                                                        class="my-1 p-1 border-color-identity-dark dark:border-gray-200">
                                                                        <span
                                                                            class="text-identity-dark font-semibold dark:text-gray-300">
                                                                            • {{ etapa.nombre }}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                    </VDropdown>
                                                </template>

                                                <!-- Responsables -->
                                                <template v-else-if="column.key === 'responsables'">
                                                    <VDropdown :triggers="['hover']" :placement="'top'">
                                                        <button :title="'Responsables'"
                                                            :class="['m-1 p-1 rounded-md shadow-xl', 'bg-cyan-100 border border-cyan-600', 'custom-shadow']">
                                                            <component :is="iconsForm['IconPeople']"
                                                                :class="['w-5 h-5', 'text-cyan-800']" />
                                                        </button>
                                                        <template #popper>
                                                            <div class="p-4 bg-identity-2 dark:bg-gray-800">
                                                                <div v-show="row[column.key].length > 0"
                                                                    v-for="responsable in row[column.key]"
                                                                    :key="column.key"
                                                                    class="basis-full text-sm font-normal text-center rtl:text-right text-identity dark:text-gray-300">
                                                                    <div
                                                                        class="my-1 p-1 border-color-identity-dark dark:border-gray-200">
                                                                        <span
                                                                            class="text-identity-dark font-semibold dark:text-gray-300">
                                                                            • {{ responsable.nombre_completo }}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div v-show="row[column.key].length === 0"
                                                                    class="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-red-100 border border-red-600">
                                                                    <h2 class="text-sm font-semibold text-red-800">
                                                                        Sin responsables.
                                                                    </h2>
                                                                </div>
                                                            </div>
                                                        </template>
                                                    </VDropdown>
                                                </template>

                                                <!-- Area Responsable -->
                                                <template v-else-if="column.key === 'area_responsable'">
                                                    <div class="inline-flex items-center px-3 py-1 rounded-full gap-x-2"
                                                        :class="getClassAreaResponsable(row[column.key])">
                                                        <h2 class="text-sm font-normal"
                                                            :class="getTextClassAreaResponsable(row[column.key])">
                                                            {{ row[column.key] }}
                                                        </h2>
                                                    </div>
                                                </template>

                                                <!-- Horas Estimadas -->
                                                <template v-else-if="column.key === 'horas_estimadas'">
                                                    <div>
                                                        <span class="text-identity-dark dark:text-gray-300">
                                                            {{ formatStringHours(row[column.key]) }}
                                                        </span>
                                                    </div>
                                                </template>

                                                <!-- Tiempo Planeado -->
                                                <template v-else-if="column.key === 'tiempo_planeado'">
                                                    <div>
                                                        <span class="text-identity-dark dark:text-gray-300">
                                                            {{ formatStringHours(row[column.key]) }}
                                                        </span>
                                                    </div>
                                                </template>

                                                <!-- Tiempo Real -->
                                                <template v-else-if="column.key === 'tiempo_real'">
                                                    <div>
                                                        <span class="text-identity-dark dark:text-gray-300">
                                                            {{ formatStringHours(row[column.key]) }}
                                                        </span>
                                                    </div>
                                                </template>

                                                <!-- Progreso -->
                                                <template v-else-if="column.key === 'progreso'">
                                                    <div class="bg-white rounded-xl shadow-sm overflow-hidden p-1">
                                                        <div class="relative h-6 flex items-center justify-center">
                                                            <div class="absolute top-0 bottom-0 left-0 rounded-lg"
                                                                :style="{ width: `${row[column.key]}%` }"
                                                                :class="getClassProgress(row[column.key])">
                                                            </div>
                                                            <div class="relative font-medium text-sm"
                                                                :class="getClassProgressText(row[column.key])">
                                                                {{ row[column.key] }}%
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>

                                                <!-- Ocupación -->
                                                <template v-else-if="column.key === 'ocupacion'">
                                                    <!-- Ocupación -->
                                                    <div class="flex justify-center items-center px-4 py-2 text-center cursor-pointer rounded-lg border border-gray-600 shadow-lg gap-2"
                                                        @click="toggleOcupacionCollapse(index_row)">
                                                        <div class="flex justify-center items-center cursor-pointer">
                                                            <span class="text-black text-sm font-bold ">Ocupación</span>
                                                        </div>
                                                        <span class="text-sm text-gray-500">
                                                            <component v-if="!isOcupacionCollapsed[index_row]"
                                                                class="h-6 w-6" :is="iconsForm['IconArrowDown']" />
                                                            <component v-else class="h-6 w-6"
                                                                :is="iconsForm['IconArrowUp']" />
                                                        </span>
                                                    </div>
                                                    <!-- Content retraibale -->
                                                    <div v-if="isOcupacionCollapsed[index_row]"
                                                        class="flex flex-wrap flex-col items-center justify-center transition-all duration-300 px-4 py-2">

                                                        <div v-for="(ocupacion, index_ocupacion) in row[column.key]"
                                                            :key="index_ocupacion"
                                                            class="w-full text-sm font-normal text-center rtl:text-right text-identity-dark dark:text-gray-300 gap-4">

                                                            <div class="flex justify-center items-center px-4 py-2 text-center cursor-pointer rounded-lg border border-gray-600 shadow-lg gap-2 my-2"
                                                                :class="specificOcupacionClass(index_ocupacion)"
                                                                @click="toggleSpecificOcupacionCollapse(index_ocupacion)">
                                                                <div
                                                                    class="flex justify-center items-center cursor-pointer">
                                                                    <span
                                                                        class="w-full text-identity-dark font-semibold dark:text-gray-30">
                                                                        {{ getTitleOcupacion(index_ocupacion) }}:
                                                                    </span>
                                                                </div>
                                                                <span class="text-sm text-gray-500">
                                                                    <component
                                                                        v-if="!isSpecificOcupacionCollapsed[index_ocupacion]"
                                                                        class="h-6 w-6"
                                                                        :is="iconsForm['IconArrowDown']" />
                                                                    <component v-else class="h-6 w-6"
                                                                        :is="iconsForm['IconArrowUp']" />
                                                                </span>
                                                            </div>

                                                            <div v-if="isSpecificOcupacionCollapsed[index_ocupacion]"
                                                                class="flex flex-wrap flex-col items-center justify-center transition-all duration-300 px-4 py-2">

                                                                <div v-if="ocupacion.length > 0"
                                                                    v-for="(value, index_fecha) in ocupacion"
                                                                    :key="index_fecha"
                                                                    class="my-1 p-2 border-color-identity-dark dark:border-gray-200">

                                                                    <div v-if="index_ocupacion === 'proyectos'">
                                                                        <div class="flex items-center justify-center">
                                                                            <span
                                                                                class="text-identity-dark font-semibold dark:text-gray-300">
                                                                                • <strong>
                                                                                    {{ value.nombre_proyecto }}
                                                                                </strong> |
                                                                                {{ formatPrettyDate(value.fecha_inicio)
                                                                                }}
                                                                                -
                                                                                {{ formatPrettyDate(value.fecha_entrega)
                                                                                }}
                                                                            </span>
                                                                            <button
                                                                                @click="clickToFindFreeDates({ id: row['id'], nombre_completo: row['nombre_completo'] }, value.fecha_inicio, value.fecha_entrega, row['fechas_no_disponibles'])"
                                                                                v-tooltip="'Fechas Disponibles entre Proyecto'"
                                                                                :class="['my-1 mx-4 p-1 rounded-md shadow-xl', 'bg-cyan-100 border border-cyan-600', 'custom-shadow']">
                                                                                <component
                                                                                    :class="['w-5 h-5', 'text-cyan-800']"
                                                                                    :is="iconsForm['IconCalendar']" />
                                                                            </button>
                                                                        </div>

                                                                        <hr class="my-2">

                                                                        <div
                                                                            class="bg-white rounded-xl shadow-sm overflow-hidden p-1">
                                                                            <div
                                                                                class="relative h-6 flex items-center justify-center">
                                                                                <div class="absolute top-0 bottom-0 left-0 rounded-lg"
                                                                                    :style="{ width: `${value.progreso}%` }"
                                                                                    :class="getClassProgress(value.progreso)">
                                                                                </div>
                                                                                <div class="relative font-medium text-sm"
                                                                                    :class="getClassProgressText(value.progreso)">
                                                                                    {{ value.progreso }}%
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <span v-else
                                                                        class="text-identity-dark font-semibold dark:text-gray-300">
                                                                        • <strong>
                                                                            {{ value.title }}
                                                                        </strong> |
                                                                        {{ formatPrettyDate(value.start) }} -
                                                                        {{ formatPrettyDate(value.end) }}
                                                                    </span>
                                                                </div>
                                                                <div v-else
                                                                    class="inline-flex items-center my-2 px-3 py-1 rounded-full gap-x-2 bg-red-100 border border-red-600">
                                                                    <h2 class="text-sm font-semibold text-red-800">
                                                                        Sin ocupación.
                                                                    </h2>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>

                                                <!-- Correos de Envío de Encuesta -->
                                                <template v-else-if="column.key === 'correos_envio_encuesta'">
                                                    <div v-for="(correo, index) in row[column.key]" :key="index">
                                                        <span class="text-identity-dark dark:text-gray-300">
                                                            {{ correo }}
                                                        </span>
                                                    </div>
                                                </template>

                                                <!-- Muestra el valor de la celda para otras columnas -->
                                                <template v-else>
                                                    {{ row[column.key] }}
                                                </template>
                                            </td>
                                        </tr>
                                    </transition-group>
                                </table>
                                <div v-if="filteredRows.length === 0"
                                    class="flex justify-center items-center bg-red-300 w-full h-16 text-center">
                                    <span class="text-identity-dark">
                                        No se encontraron resultados.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-between mt-6">
                    <button @click="prevPage" :disabled="isDisabledPrevPage"
                        :class="isDisabledPrevPage ? 'bg-gray-400' : 'bg-identity-dark hover:bg-gray-700 dark:bg-orange-600 dark:hover:bg-orange-800'"
                        class="flex items-center px-5 py-2 text-sm text-identity capitalize transition-colors duration-200 border rounded-md gap-x-2 dark:text-gray-200 dark:border-gray-200 ">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                        </svg>

                        <span>
                            Anterior
                        </span>
                    </button>

                    <!-- <button @click="refreshCurrentPage"
                        class="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                        Actualizar Página
                    </button> -->

                    <div class="items-center hidden md:flex gap-x-3">
                        <span
                            class="px-2 py-1 text-md text-orange-600 dark:text-orange-400 rounded-md dark:bg-gray-900 bg-orange-100/60">
                            Página {{ dataTable.current_page }} de {{ dataTable.last_page }}
                        </span>
                    </div>

                    <!-- <div class="items-center hidden md:flex gap-x-3">
                        <a href="#"
                            class="px-2 py-1 text-sm text-blue-500 rounded-md dark:bg-gray-800 bg-blue-100/60">1</a>
                        <a href="#"
                            class="px-2 py-1 text-sm text-identity-dark rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">2</a>
                        <a href="#"
                            class="px-2 py-1 text-sm text-identity-dark rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">3</a>
                        <a href="#"
                            class="px-2 py-1 text-sm text-identity-dark rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">...</a>
                        <a href="#"
                            class="px-2 py-1 text-sm text-identity-dark rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">12</a>
                        <a href="#"
                            class="px-2 py-1 text-sm text-identity-dark rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">13</a>
                        <a href="#"
                            class="px-2 py-1 text-sm text-identity-dark rounded-md dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100">14</a>
                    </div> -->

                    <button @click="nextPage" :disabled="isDisabledNextPage"
                        :class="isDisabledNextPage ? 'bg-gray-400' : 'bg-identity-dark hover:bg-gray-700 dark:bg-orange-600 dark:hover:bg-orange-800'"
                        class="flex items-center px-5 py-2 text-sm text-identity capitalize transition-colors duration-200 border rounded-md gap-x-2 dark:text-gray-200 dark:border-gray-200 ">
                        <span>
                            Siguiente
                        </span>

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5 rtl:-scale-x-100">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                    </button>
                </div>
            </section>
        </div>
    </div>
    <!-- Modal Search Range Date-->
    <Modal :is-modal-open="isRangeModalOpen" @close-modal="closeRangeModal" :max-width="'max-w-sm'">
        <template #icon>
            <component :is="iconsForm['IconSearch']" class="text-identity-dark dark:text-gray-300 w-10 h-10" />
        </template>
        <template #title>
            <h3 class="text-lg font-semibold text-center text-identity-dark dark:text-gray-300">
                Buscar por rango de fechas
            </h3>
        </template>
        <template #content>
            <VueDatePicker :teleport="true" ref="vueDatePicker" v-model="searchDateRange" range auto-apply
                class="w-full rounded" :format="formatSearchDateRange" />
        </template>
        <template #footer>
            <div class="mt-4 flex justify-center w-full">
                <div class="basis-1/3 flex justify-center items-center">
                    <button @click="closeRangeModal"
                        class="ml-2 bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400">
                        Cancelar
                    </button>
                </div>
                <div class="basis-1/3 flex justify-center items-center">
                    <button @click="applyDateRange" class="bg-orange-600 text-white p-2 rounded hover:bg-orange-800">
                        <div class="flex flex-row items-center">
                            <component :is="iconsForm['IconSearch']" class="w-4 h-4" />
                            Aplicar
                        </div>
                    </button>
                </div>
            </div>
        </template>
    </Modal>
    <!-- Modal Action-->
    <Modal :is-modal-open="isActionModalOpen" @close-modal="closeActionModal" max-height="max-entity-height"
        max-width="max-w-5xl">
        <template #icon>
            <component :class="['w-9 h-9']" :is="actionsIcon(actionSelected)" />
        </template>
        <template #title>
            <h3 class="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white" id="modal-title">
                {{ modalActionTitle }}
            </h3>
        </template>
        <template #content>
            <BaseForm v-if="actionSelected === 'edit'" :type-form="typeTableForm" :action-selected="actionSelected"
                :row-selected="rowSelected" @update-row="updateRowTable" @close-modal="closeActionModal" />

            <ViewDetails v-if="actionSelected === 'view_details'" :row-selected="rowSelected"
                :columns="filterDetailsColumns()" />

            <BaseTable v-if="actionSelected === 'view_novedades_contrato'" :table="'novedades_contrato'"
                :row-selected="rowSelected" :icons-view="[]" :show-search="false" />

            <BaseForm v-if="actionSelected === 'download_document_contract'" :type-form="'documentoContrato'"
                :action-selected="actionSelected" :row-selected="rowSelected" @update-row="updateRowTable"
                @close-modal="closeActionModal" />

            <BaseForm v-if="actionSelected === 'approve_reject_permission'" :type-form="'aprobarRechazarPermiso'"
                :action-selected="actionSelected" :row-selected="rowSelected" @update-row="updateRowTable"
                @close-modal="closeActionModal" />

            <BaseForm v-if="actionSelected === 'approve_reject_vacation'" :type-form="'aprobarRechazarVacacion'"
                :action-selected="actionSelected" :row-selected="rowSelected" @update-row="updateRowTable"
                @close-modal="closeActionModal" />

            <BaseForm v-if="actionSelected === 'report_hours'" :type-form="'reportarHoras'"
                :action-selected="actionSelected" :row-selected="rowSelected" @update-row="updateRowTable"
                @close-modal="closeActionModal" />

            <BaseForm v-if="actionSelected === 'assign_responsabilitites'" :type-form="'actividadesOrdenEtap'"
                :action-selected="actionSelected" :row-selected="rowSelected" @update-row="updateRowTable"
                @close-modal="closeActionModal" />

            <BaseForm v-if="actionSelected === 'add_email_survey'" :type-form="'agregarEmailEncuesta'"
                :action-selected="actionSelected" :row-selected="rowSelected" @update-row="updateRowTable"
                @close-modal="closeActionModal" />
        </template>
    </Modal>

    <!-- Modal Free Dates-->
    <Modal :is-modal-open="isModalFreeDatesOpen" @close-modal="closeFreeDatesModal" max-height="max-entity-height"
        :max-width="'max-w-md'">
        <template #icon>
            <component :is="iconsForm['IconCalendar']" class="text-identity-dark dark:text-gray-300 w-10 h-10" />
        </template>
        <template #title>
            <div class="text-lg font-semibold text-center text-identity-dark dark:text-gray-300">
                <p>Días Libres de:</p>
                <hr>
                <p class="py-4 font-extrabold">{{ employeeSelected.nombre_completo }}</p>
                <hr>
                <p>Entre:</p>
                <p>{{ formatPrettyDate(dateStartFreeDates) }} y {{ formatPrettyDate(dateEndFreeDates) }}</p>
            </div>
        </template>
        <template #content>
            <div class="flex flex-col items-center justify-center">
                <div v-if="freeDates.length > 0" class="w-full">
                    <div v-for="(freeDate, index) in freeDates" :key="index"
                        class="flex flex-row justify-center items-center"
                        :class="['m-1 p-2 rounded-md shadow-xl', 'bg-cyan-100 border border-cyan-600', 'custom-shadow']">
                        <div class="my-1 p-2">
                            <span class="text-identity-dark font-semibold dark:text-gray-300">
                                {{ formatFullPrettyDate(freeDate) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
        </template>
    </Modal>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed, markRaw, watch, defineAsyncComponent, nextTick, defineEmits, defineExpose } from "vue";
import { defineProps } from "vue";
import { storeToRefs } from "pinia";
import { useMainStore } from "@/stores/main";
import { useMomentStore } from "@/stores/moment";
import { useAuthStore } from "@/stores/auth";
import { useIconStore } from "@/stores/icons";
import { useBusinessStore } from "@/stores/business";
import { useRouter } from "vue-router";
import AppLoader from "../loader/AppLoader.vue";
import Modal from "@/components/helpers/Modal.vue"
import BaseForm from "@/components/forms/BaseForm.vue";
import ViewDetails from "@/components/tables/ViewDetails.vue";
import { HttpError, showErrorMessage } from "@/helpers/errors";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { eventBus, sendDataViaEventBus } from "@/helpers/eventBus";
import { useFeatureFlagsStore } from "@/stores/featureFlags";

const { isDarkMode, isMobile } = storeToRefs(useMainStore())
const { backendUrlFC } = useMainStore()
const { formatStoreDate, formatPrettyDate, compareRangeDates, parseStoreDate, formatStoreTime, parseStoreTime, formatFullPrettyDate } = useMomentStore()
const { token } = storeToRefs(useAuthStore())
const { userAuth } = storeToRefs(useAuthStore())

const { formatHours, formatStringHours, findFreeDates, sendInvitationSatisfationSurvey, generateCategorizacionEmployees } = useBusinessStore()
const { setFeatureFlag } = useFeatureFlagsStore()
const router = useRouter()

const props = defineProps({
    table: {
        type: String,
        required: true
    },
    iconsView: {
        type: Array,
        required: true
    },
    rowSelected: {
        type: Object,
        required: false,
        default: null
    },
    showSearch: {
        type: Boolean,
        required: false,
        default: true
    },
    selectRowsBy: {
        type: Object,
        required: false,
        default: null
    },
    barActions: {
        type: Array,
        required: false,
        default: () => []
    }
});
const emit = defineEmits(["selectedRows", "dynamicEvent"]);

const sendRows = () => {
    return filterTable()
}

defineExpose({
    sendRows
});

const formIconNames = ref(['IconSearch', 'IconCalendar', 'IconX', 'IconStep', 'IconPeople', 'IconArrowDown', 'IconArrowUp'])
const { iconsForm, loadFormIcons } = useIconStore();

const user = JSON.parse(userAuth.value)

let eventBusWatch;

onMounted(async () => {
    try {
        setLoadingApp(true)
        await loadTableData()
        verifyHideActionsByTypeTableForm()
        setLoadingApp(false, 1000)
    } catch (error) {
        showErrorMessage(error)
    }
})

onUnmounted(() => {
    eventBusWatch();
});

eventBusWatch = watch(() => eventBus.data, async (newEventBusData) => {
    if (newEventBusData) {
        if (newEventBusData.actionSelected === 'update_rows_orden_etapas') {
            const newRows = newEventBusData.newRows[props.rowSelected.id]

            // Crear un mapa de newRows donde la clave es el id y el valor es la fila nueva
            const newRowsMap = new Map(newRows.map(newRow => [newRow.id, newRow]));

            // Iterar sobre cada fila del resultado de filterTable()
            filterTable().forEach((row) => {
                // Buscar la fila nueva en el mapa usando el id de la fila actual
                const newRow = newRowsMap.get(row.id);

                // Si se encuentra una coincidencia, actualizar la fila actual con los datos de la fila nueva
                if (newRow) {
                    Object.assign(row, newRow);
                }
            });
            //Este enfoque reduce la complejidad de la búsqueda de O(n) a O(1) para cada fila, mejorando significativamente el rendimiento cuando newRows es grande.
            selectAll.value = false
            selectOrUnSelectAll(false)
        }
    }
}, { immediate: false });

const loadTableData = async () => {
    await fetchDataTable(dataTable.value.current_page)
    await loadFormIcons(formIconNames.value)
    await loadViewIcons(props.iconsView)
}

const typeTableForm = computed(() => {
    return props.table.slice(0, -1)
})

const isLoadingApp = ref(false)
const dataTable = ref({
    data: {
        columns: [],
        rows: []
    },
    current_page: 1,
    total: 0,
    per_page: 10,
    last_page: 1
})
const selectAll = ref(false)

const selectRow = (row) => {
    row['selected'] = !row['selected']
}

const rowClass = computed(() => (row, index_row) => {
    return {
        'cursor-pointer': row['selectable'],
        'bg-orange-400': row['selected'],
        'bg-gray-100 dark:bg-gray-700': !row['selected'] && index_row % 2 === 0,
        '': !row['selected'] && index_row % 2 !== 0
    }
})

const columnClass = (column) => {
    return {
        'column-60': column === 'ocupacion'
    }
}

const canClikOnColumn = (row, column) => {
    return column.key !== 'actions' && row['selectable']
}

const getClassProgress = (value) => {
    return {
        'bg-green-200': value < 105,
        'bg-orange-200': value > 105 && value < 120,
        'bg-red-200': value > 120
    }
}

const getClassProgressText = (value) => {
    return {
        'text-green-800': value < 105,
        'text-orange-800': value > 105 && value < 120,
        'text-red-800': value > 120
    }
}

const viewIcons = ref({})
const search = ref('')
const showTooltip = ref(null)

const loadViewIcons = async (iconsName) => {
    try {
        const promises = iconsName.map(iconName => import(`@/components/icons/${iconName}.vue`));
        const loadedIcons = await Promise.all(promises);

        iconsName.forEach((iconName, index) => {
            viewIcons.value[iconName] = markRaw(loadedIcons[index].default);
        });
    } catch (error) {
        throw new Error('Failed to load icons')
    }
}
//Actions
const actionsIconMap = {
    view_details: 'IconEye',
    edit: 'IconEdit',
    delete: 'IconTrash',
    view_novedades_contrato: 'IconList',
    download_document_contract: 'IconPdf',
    cancel_contract: 'IconX',
    download_novedad_contrato: 'IconDownload',
    approve_reject_permission: 'IconHandUp',
    approve_reject_vacation: 'IconHandUp',
    cancel_vacation: 'IconX',
    view_structures: 'IconStructure',
    view_orders: 'IconWorkOrder',
    anulate_structure: 'IconX',
    send_invitation_satisfation_survey: 'IconSend',
    anulate_order: 'IconX',
    report_hours: 'IconClock',
    assign_responsabilitites: 'IconPeople',
    download_categorization_results: 'IconDownload',
    add_email_survey: 'IconPlus',
    download_answer_survey: 'IconDownload',
    unblock_user: 'IconLockOpen',
    generate_categorization: 'IconArrowRounded',
};
const actionsIcon = (action) => {
    const iconName = getActionIcon(action)
    return defineAsyncComponent(() => import(`@/components/icons/${iconName}.vue`));
}
const getActionIcon = (action) => {
    return actionsIconMap[action] || 'IconWarning'
}
const actionIconClass = (action) => ({
    'bg-yellow-100 border border-yellow-600': action === 'view_details',
    'bg-sky-100 border border-sky-600': action === 'edit',
    'bg-cyan-100 border border-cyan-600': action === 'view_novedades_contrato' || action === 'send_invitation_satisfation_survey' || action === 'generate_categorization',
    'bg-green-100 border border-green-600': action === 'download_document_contract' || action === 'download_novedad_contrato' || action === 'approve_reject_permission' || action === 'approve_reject_vacation' || action === 'assign_responsabilitites' || action === 'download_categorization_results' || action === 'add_email_survey' || action === 'download_answer_survey',
    'bg-red-100 border border-red-600': action === 'cancel_contract' || action === 'delete' || action === 'cancel_vacation' || action === 'anulate_structure' || action === 'anulate_order',
    'bg-orange-100 border border-orange-600': action === 'view_structures' || action === 'view_orders' || action === 'report_hours' || action === 'unblock_user',
    'bg-gray-100 border border-gray-600': action === null
});
const actionIconText = (action) => ({
    'text-yellow-800': action === 'view_details',
    'text-sky-800': action === 'edit',
    'text-cyan-800': action === 'view_novedades_contrato' || action === 'send_invitation_satisfation_survey' || action === 'generate_categorization',
    'text-green-800': action === 'download_document_contract' || action === 'download_novedad_contrato' || action === 'approve_reject_permission' || action === 'approve_reject_vacation' || action === 'assign_responsabilitites' || action === 'download_categorization_results' || action === 'add_email_survey' || action === 'download_answer_survey',
    'text-red-800': action === 'cancel_contract' || action === 'delete' || action === 'cancel_vacation' || action === 'anulate_structure' || action === 'anulate_order',
    'text-orange-800': action === 'view_structures' || action === 'view_orders' || action === 'report_hours' || action === 'unblock_user',
})

const getClassAreaResponsable = (value) => {
    return {
        'bg-orange-100 border border-orange-600': value === 'INGENIERIA',
        'bg-gray-100 border border-gray-600': value === 'DIBUJO',
        'bg-white border border-gray-200': value === 'CANTIDADES',
    }
}

const getTextClassAreaResponsable = (value) => {
    return {
        'text-orange-800': value === 'INGENIERIA',
        'text-gray-800': value === 'DIBUJO' || value === 'CANTIDADES',
    }
}

//Extra Data.
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
//Actions Table
const actionSelected = ref(null)
const rowSelected = ref(null)

const otherActionToShow = {
    cancel_contract: async () => {
        await showSwal({
            actionName: 'cancelContract',
            data: {
                estado: 'CANCELADO'
            },
            title: '¿Estás seguro de cancelar el contrato?',
            text: 'Una vez cancelado, no se podrá revertir.',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Sí, cancelar contrato',
            cancelButtonText: 'Cancelar',
            timer: null,
            position: 'center',
        })
        clearSelection()
    },
    download_novedad_contrato: async () => {
        const url = `${backendUrlFC}/api/download/novedad-contrato/${rowSelected.value.id}`;
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
                throw new HttpError(errorData.message, response.status);
            }
            const contentType = response.headers.get('content-type');

            const contentTypeToExtension = {
                'application/pdf': 'pdf',
            };
            const fileExtension = contentTypeToExtension[contentType] || 'txt';

            let fileName = `Novedad Contrato - ${rowSelected.value.persona.nombre_completo} - ${formatPrettyDate(new Date())}.${fileExtension}`;

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
    },
    approve_reject_vacation: async () => {
        await verifyTypeOfApproverVacation();
    },
    cancel_vacation: async () => {
        await showSwal({
            actionName: 'editForm',
            data: {
                estado_solicitud: 'CANCELADA'
            },
            title: '¿Estás seguro de cancelar la solicitud de vacaciones?',
            text: 'Una vez cancelada, no se podrá revertir.',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Sí, cancelar solicitud',
            cancelButtonText: 'Cancelar',
            timer: null,
            position: 'center',
        })
        clearSelection()
    },
    view_structures: () => {
        sendDataViaEventBus({
            actionSelected: actionSelected.value,
            rowSelected: rowSelected.value
        });
        router.push(`/estructuras/${rowSelected.value.id}`);
    },
    view_orders: () => {
        sendDataViaEventBus({
            actionSelected: actionSelected.value,
            rowSelected: rowSelected.value
        });
        router.push(`/ordenes/${rowSelected.value.id}`);
    },
    anulate_structure: async () => {
        await showSwal({
            actionName: 'editForm',
            data: {
                estado: 'ANULADA'
            },
            title: '¿Estás seguro de anular la estructura?',
            text: 'Una vez anulada, no se podrá revertir.',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Sí, anular estructura',
            cancelButtonText: 'Cancelar',
            timer: null,
            position: 'center',
        })
    },
    send_invitation_satisfation_survey: async () => {
        await showSwal({
            actionName: 'sendInvitationSatisfationSurvey',
            title: '¿Estás seguro de enviar la encuesta?',
            text: 'Una vez enviada, no se podrá revertir.',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Sí, enviar encuesta',
            cancelButtonText: 'Cancelar',
            timer: null,
            position: 'center',
        })
        clearSelection()
    },
    anulate_order: async () => {
        await showSwal({
            actionName: 'editForm',
            data: {
                estado: 'ANULADA'
            },
            title: '¿Estás seguro de anular la orden?',
            text: 'Una vez anulada, no se podrá revertir.',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Sí, anular orden',
            cancelButtonText: 'Cancelar',
            timer: null,
            position: 'center',
        })
    },
    download_categorization_results: async () => {
        const url = `${backendUrlFC}/api/download/categorization-results/${rowSelected.value.id}`;
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
                throw new HttpError(errorData.message, response.status);
            }
            const contentType = response.headers.get('content-type');

            const contentTypeToExtension = {
                'application/pdf': 'pdf',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
                'application/msword': 'doc',
                'application/vnd.ms-excel': 'xls',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
            };
            const fileExtension = contentTypeToExtension[contentType] || 'txt';

            let fileName = `Resultados de Categorización - ${rowSelected.value.id} - ${formatPrettyDate(new Date())}.${fileExtension}`;

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
    },
    download_answer_survey: async () => {
        const url = `${backendUrlFC}/api/download/respuesta-encuesta/${rowSelected.value.id ? rowSelected.value.id : ""}`;
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
                throw new HttpError(errorData.message, response.status);
            }
            const contentType = response.headers.get('content-type');

            const contentTypeToExtension = {
                'application/pdf': 'pdf',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
                'application/msword': 'doc',
                'application/vnd.ms-excel': 'xls',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
            };
            const fileExtension = contentTypeToExtension[contentType] || 'txt';

            let fileName = `Respuestas Encuesta - ${rowSelected.value.id} - ${formatPrettyDate(new Date())}.${fileExtension}`;

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
    },
    unblock_user: async () => {
        await showSwal({
            actionName: 'editForm',
            data: {
                estado: 'DESBLOQUEADO'
            },
            title: '¿Estás seguro de desbloquear al usuario?',
            text: 'Una vez desbloqueado, podrá acceder nuevamente.',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Sí, desbloquear usuario',
            cancelButtonText: 'Cancelar',
            timer: null,
            position: 'center',
        })
    },
    generate_categorization: async () => {
        await showSwal({
            actionName: 'generateCategorizacion',
            title: '¿Estás seguro de generar la categorización?',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Sí, generar categorización',
            cancelButtonText: 'Cancelar',
            timer: null,
            position: 'center',
        })
    }
}
const generateCategorizacion = async (employeeId, employeeName) => {
    const response = await generateCategorizacionEmployees(employeeId);

    if (response.status === 'success') {
        Swal.fire({
            title: 'Categorización Generada para ' + employeeName,
            text: response.message,
            icon: 'success',
            confirmButtonColor: '#EC7522',
        });
    }
}
const verifyTypeOfApproverVacation = async () => {
    const { jefe_area, jefe_gerente } = rowSelected.value;
    const userId = user.user.model.id;

    if (jefe_area.id === userId && jefe_gerente.id === userId) {
        await showSwalVacations({
            actionName: 'approve_reject_vacation',
            title: '¿Bajo que rol deseas aprobar/rechazar las vacaciones?',
            text: 'Una vez aprobada/rechazada, no se podrá revertir.',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Rol como Gerente',
            cancelButtonText: 'Rol como Jefe de Área',
            timer: null,
            position: 'center',
        });
    } else if (jefe_area.id === userId) {
        sendDataViaEventBus({
            actionSelected: actionSelected.value,
            rowSelected: rowSelected.value,
            approvedBy: 'jefe_area'
        });
        isActionModalOpen.value = true;
    } else if (jefe_gerente.id === userId) {
        sendDataViaEventBus({
            actionSelected: actionSelected.value,
            rowSelected: rowSelected.value,
            approvedBy: 'jefe_gerente'
        });
        isActionModalOpen.value = true;
    }
};
const editForm = async (dataForm) => {
    try {
        const response = await fetch(`${backendUrlFC}/api/edit/form/${typeTableForm.value}/${rowSelected.value.id}`, {
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
            updateRowTable(rowSelected.value.id, data.newRow);
            verifyHideActionsByTypeTableForm();
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
        throw error;
    }
};

const verifyHideActionsByTypeTableForm = () => {
    if (typeTableForm.value === 'contrato') {
        dataTable.value.data.rows.map(row => {
            hideActionsByTypeTableForm(typeTableForm.value, 'cancel_contract', row);
        });
    }
    if (typeTableForm.value === 'permiso' || typeTableForm.value === 'historialPermiso') {
        dataTable.value.data.rows.map(row => {
            hideActionsByTypeTableForm(typeTableForm.value, 'approve_reject_permission', row);
        });
    }

    if (typeTableForm.value === 'vacacione' || typeTableForm.value === 'historialVacacione') {
        dataTable.value.data.rows.map(row => {
            hideActionsByTypeTableForm(typeTableForm.value, 'approve_reject_vacation', row);
        });
    }

    if (typeTableForm.value === 'estructura') {
        dataTable.value.data.rows.map(row => {
            hideActionsByTypeTableForm(typeTableForm.value, 'anulate_structure', row);
        });
    }

    if (typeTableForm.value === 'ordenTrabajo') {
        dataTable.value.data.rows.map(row => {
            hideActionsByTypeTableForm(typeTableForm.value, 'anulate_order', row);
        });
    }

    if (typeTableForm.value === 'usuariosBloqueado') {
        dataTable.value.data.rows.map(row => {
            hideActionsByTypeTableForm(typeTableForm.value, 'unblock_user', row);
        });
    }
}
const hideActionsByTypeTableForm = (typeTableForm, actionSelected, row) => {
    if (typeTableForm === 'contrato' && actionSelected === 'cancel_contract' && row.estado.estado === 'CANCELADO') {
        row['actions'] = row['actions'].filter(action => action.key === 'view_details' || action.key === 'view_novedades_contrato' || action.key === 'download_document_contract');
    }

    if ((typeTableForm === 'permiso' || typeTableForm === 'historialPermiso') && actionSelected === 'approve_reject_permission') {
        // Oculta la acción de aprobar/rechazar permiso si el usuario autenticado no es el jefe de área
        row['actions'] = row.jefe_area.id === user.user.model.id && row.estado_jefe.estado === 'PENDIENTE' ? row['actions'] : row['actions'].filter(action => action.key === 'view_details');
    }

    if (typeTableForm === 'estructura' && actionSelected === 'anulate_structure' && row.estado.estado === 'ANULADA') {
        row['actions'] = row['actions'].filter(action => action.key !== 'anulate_structure' && action.key !== 'edit');
    }

    if (typeTableForm === 'ordenTrabajo' && actionSelected === 'anulate_order' && row.estado.estado !== 'ACTIVA') {
        row['actions'] = row['actions'].filter(action => action.key === 'view_details');
    }

    if ((typeTableForm === 'vacacione' || typeTableForm === 'historialVacacione') && actionSelected === 'approve_reject_vacation') {
        const isAreaHead = row.jefe_area.id === user.user.model.id;
        const isManager = row.jefe_gerente.id === user.user.model.id;
        const isPendingArea = row.estado_area.estado === 'PENDIENTE';
        const isPendingManager = row.estado_gerente.estado === 'PENDIENTE';
        const isActiveRequest = row.estado_solicitud.estado === 'ACTIVA';
        const isRequester = row.persona.id === user.user.model.id;

        const canApproveReject = (isAreaHead && isPendingArea) || (isManager && isPendingManager);

        row['actions'] = row['actions'].filter(action => {
            if (action.key === 'view_details') return true;

            if (action.key === 'edit' || action.key === 'cancel_vacation') {
                return isRequester && isPendingArea && isPendingManager && isActiveRequest;
            }

            return canApproveReject && isActiveRequest;
        });
    }

    if (typeTableForm === 'usuariosBloqueado' && actionSelected === 'unblock_user' && row.estado.estado === 'DESBLOQUEADO') {
        row['actions'] = row['actions'].filter(action => action.key !== 'unblock_user');
    }
}
//Structure Data
const handlersStructureJsonData = {
    hora: value => value ? formatStoreTime(value.hours, value.minutes, value.seconds) : null,
    fecha: value => value && !isNaN(Date.parse(value)) ? formatStoreDate(value) : null,
    object: value => ('id' in value) ? value.id : value,
    default: value => value
};
const getHandlerKey = (key, value) => {
    return key.startsWith('hora') ? 'hora' :
        key.startsWith('fecha') ? 'fecha' :
            value === null ? 'default' :
                typeof value === 'object' ? 'object' :
                    'default';
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
//Data Form
const jsonToDataForm = (json) => {
    const dataForm = new FormData();
    Object.entries(json).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            appendArrayToFormData(dataForm, key, value);
        } else if (typeof value === 'object' && value !== null) {
            appendObjectToFormData(dataForm, key, value);
        } else if (typeof value === 'boolean') {
            dataForm.append(key, value);
        } else if (value) {
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

// Show Swal
const showSwal = (options) => {
    return Swal.fire({
        position: options.position || 'center',
        title: options.title || null,
        text: options.text || null,
        icon: options.icon || 'warning',
        title: options.title || null,
        showCancelButton: options.showCancelButton,
        cancelButtonColor: options.cancelButtonColor || 'gray',
        cancelButtonText: options.cancelButtonText || 'Cancelar',
        showConfirmButton: options.showConfirmButton,
        confirmButtonColor: options.confirmButtonColor || '#EC7522',
        confirmButtonText: options.confirmButtonText || 'Aceptar',
        timer: options.timer || null,
        allowOutsideClick: false,
        showCloseButton: true,
    }).then(async (result) => {
        if (result.isConfirmed) {

            if (options.actionName && options.actionName === 'editForm') {
                const structureData = structureJsonData(options.data);
                const dataForm = jsonToDataForm(structureData);
                await editForm(dataForm)
            }

            if (options.actionName && options.actionName === 'cancelContract') {

                await Swal.fire({
                    title: '¿Desea asignar una fecha de finalización del contrato?',
                    text: 'Si no asigna una fecha, se asignará la fecha actual.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, asignar',
                    cancelButtonText: 'No, continuar',
                    confirmButtonColor: '#EC7522',
                    cancelButtonColor: '#6B7280'
                }).then(async (result) => {
                    let fechaFinalizacionContrato;

                    if (result.isConfirmed) {
                        const { value: fecha } = await Swal.fire({
                            title: 'Selecciona la fecha',
                            html: `<input type="date" id="fechaInput" class="swal2-input" required>`,
                            focusConfirm: false,
                            showCancelButton: true,
                            confirmButtonText: 'Guardar',
                            cancelButtonText: 'Cancelar',
                            confirmButtonColor: '#EC7522',
                            cancelButtonColor: '#6B7280',
                            preConfirm: () => {
                                return document.getElementById('fechaInput').value;
                            },
                            inputValidator: (value) => {
                                if (!value) return '¡Debes seleccionar una fecha!';
                            }
                        });

                        if (fecha) {
                            fechaFinalizacionContrato = formatStoreDate(fecha);
                        }
                    }

                    if (result.isDismissed) {
                        fechaFinalizacionContrato = formatStoreDate(new Date());
                    }

                    const data = {
                        ...options.data,
                        fecha_finalizacion: fechaFinalizacionContrato,
                    };
                    const structureData = structureJsonData(data);
                    const dataForm = jsonToDataForm(structureData);
                    await editForm(dataForm);
                });
            }

            if (options.actionName && options.actionName === 'sendInvitationSatisfationSurvey') {
                const response = await sendInvitationSatisfationSurvey(rowSelected.value.id);

                return Swal.fire({
                    position: "center",
                    icon: "success",
                    title: response.message,
                    showConfirmButton: true,
                });
            }

            if (options.actionName && options.actionName === 'generateCategorizacion') {
                await generateCategorizacion(rowSelected.value.empleado_id, rowSelected.value.empleado);
            }
        }
        if (result.isDismissed) {
            clearSelection()
        }
    })
}

const showSwalVacations = (options) => {
    return Swal.fire({
        position: options.position || 'center',
        title: options.title || null,
        text: options.text || null,
        icon: options.icon || 'warning',
        showCancelButton: false,
        showConfirmButton: false,
        allowOutsideClick: false,
        showCloseButton: true,
        html: getHtmlVacationsContent(options),
        didOpen: () => {
            if (rowSelected.value.estado_gerente.estado === 'PENDIENTE') {
                actAsVacationApprover('#approveAsManager', 'jefe_gerente');
            }
            if (rowSelected.value.estado_area.estado === 'PENDIENTE') {
                actAsVacationApprover('#approveAsAreaChief', 'jefe_area');
            }
        },
    });
};
const actAsVacationApprover = (selector, approvedBy) => {
    const approveButton = Swal.getPopup().querySelector(selector);
    approveButton.addEventListener('click', async () => {
        Swal.close();
        if (actionSelected.value === 'approve_reject_vacation') {
            sendDataViaEventBus({
                actionSelected: actionSelected.value,
                rowSelected: rowSelected.value,
                approvedBy: approvedBy
            });
            isActionModalOpen.value = true;
        }
    });
}
const getHtmlVacationsContent = (options) => {
    let htmlContent = `<p class="mb-2">${options.text || ''}</p>`;
    if (rowSelected.value.estado_area.estado === 'PENDIENTE') {
        htmlContent += `<button id="approveAsAreaChief" class="swal2-deny swal2-styled" style="background-color: gray;">Rol como Jefe de Área</button>`;
    }
    if (rowSelected.value.estado_gerente.estado === 'PENDIENTE') {
        htmlContent += `<button id="approveAsManager" class="swal2-confirm swal2-styled" style="background-color: #EC7522;">Rol como Gerente</button>`;
    }
    return htmlContent;
}
//Click Action
const clickAction = (action, row) => {
    actionSelected.value = action
    rowSelected.value = row
    modalActionTitle.value = modalActionTitlesMap[action]
    otherActionToShow[action] ? otherActionToShow[action]() : isActionModalOpen.value = true
}
const modalActionTitlesMap = {
    view_details: 'Detalles',
    edit: 'Editar',
    delete: 'Eliminar',
    view_novedades_contrato: 'Novedades Contrato',
    download_document_contract: 'Descargar Documentos',
    cancel_contract: 'Cancelar Contrato',
    download_novedad_contrato: 'Descargar Novedad Contrato',
    approve_reject_permission: 'Aprobar/Rechazar Permiso',
    approve_reject_vacation: 'Aprobar/Rechazar Vacaciones',
    report_hours: 'Reportar Horas',
    assign_responsabilitites: 'Asignar Responsabilidades',
    download_categorization_results: 'Descargar Resultados de Categorización',
    add_email_survey: 'Agregar Email Encuesta',
    download_answer_survey: 'Descargar Respuesta Encuesta',
}
const modalActionTitle = ref('')
const isActionModalOpen = ref(false)

const closeActionModal = () => {
    isActionModalOpen.value = false
    clearSelection()
}
const clearSelection = () => {
    actionSelected.value = null
    rowSelected.value = null
}
//Status
const colorsIconMap = {
    green: 'IconCheck',
    red: 'IconX',
    yellow: 'IconWarning',
    neutro: 'IconRefound'
};
const statusIcon = (color) => {
    const iconName = getStatusIconName(color)
    return defineAsyncComponent(() => import(`@/components/icons/${iconName}.vue`));
}
const getStatusIconName = (color) => {
    return colorsIconMap[color] || 'IconWarning'
};
const statusClass = (color) => ({
    'text-red-500 bg-red-100/60 border border-red-500': color === 'red',
    'text-emerald-500 bg-emerald-100/60 border border-emerald-500': color === 'green',
    'text-yellow-600 bg-yellow-100/60 border border-yellow-500': color === 'yellow',
    'text-identity-dark bg-gray-100/60 border border-gray-500': color === 'neutro'
});
//Search Date Range
const searchDateRange = ref([])

const isSearchDateRangeDisabled = computed(() => {
    return searchDateRange.value?.length > 0 && applyNowRange.value
})
const vueDatePicker = ref(null)
const isRangeModalOpen = ref(false)
const applyNowRange = ref(false)

const applyDateRange = () => {
    applyNowRange.value = true

    if (searchDateRange.value.length === 0) return

    searchDateRange.value[0] = formatStoreDate(searchDateRange.value[0])
    searchDateRange.value[1] = formatStoreDate(searchDateRange.value[1])
    search.value = formatSearchDateRange(searchDateRange.value)
    closeRangeModal()
}
const closeRangeModal = () => {
    isRangeModalOpen.value = false
}
const showDateRangePicker = () => {
    clearSearchDateRange()
    isRangeModalOpen.value = !isRangeModalOpen.value
}
const clearSearchDateRange = () => {
    search.value = ''
    applyNowRange.value = false
    searchDateRange.value = []
}
const formatSearchDateRange = (dates) => {
    const startDate = formatPrettyDate(dates[0])
    const endDate = formatPrettyDate(dates[1])
    return `${startDate} - ${endDate}`
}

const excludColumnsMap = {
    vacacione: ['id', 'jefe_area', 'obs_area', 'jefe_gerente', 'obs_gerente'],
    proyecto: ['id'],
    estructura: ['id', 'revit', 'proyecto', 'horas_ingenieria_estimadas', 'horas_dibujo_estimadas', 'horas_totales_estimadas', 'velocidad_ingenieria', 'velocidad_dibujo', 'horas_cimentacion_estimadas', 'horas_superestructura_estimadas'],
    actividadesOrdenEtap: ['id', 'tipo_estructura', 'orden_id', 'etapa', 'ordenEtapa'],
    actividadesResponsableOrdenEtap: ['id', 'tipo_estructura', 'orden_id', 'etapa', 'ordenEtapa'],
    ordenTrabajo: ['id'],
    ingeniero: ['fechas_no_disponibles', 'id'],
    delineante: ['fechas_no_disponibles', 'id'],
    cantidadesObr: ['fechas_no_disponibles', 'id'],
    practicantesIngenieri: ['fechas_no_disponibles', 'id'],
    practicantesDibuj: ['fechas_no_disponibles', 'id'],
    equipo: ['show_data', 'id'],
    resultadosCategorizacio: ['id'],
    relacionCategorizacionEmpleado: ['id', 'empleado_id'],
    respuestasEncuestaSatisfaccio: ['id'],
    usuariosBloqueado: ['id'],
    resultadosCategorizacionIntern: ['id'],
    resultadosCategorizacionExtern: ['id'],
    misReporte: ['id'],
    configuracionCategorizacio: ['id'],
    categorizacionEducacio: ['id'],
    categorizacionFormacio: ['id'],
    categorizacionExperienci: ['id'],
    salariosBas: ['id'],
    featureFlag: ['id'],
    misReporte: ['id', 'actividad_id'],
    misReportesGeneralesProyecto: ['id'],
    misReportesGenerale: ['id'],
    incapacidade: ['id'],
    licencia: ['id'],
}

//Filter Table
const filterDetailsColumns = () => {
    if (dataTable.value.data.columns.length === 0) return []

    if (excludColumnsMap[typeTableForm.value]) {
        return isMobile.value ? dataTable.value.data.columns.filter(column => !excludColumnsMap[typeTableForm.value].includes(column.key) && column.key !== 'actions' && column.key !== 'selectable') :
            dataTable.value.data.columns.filter(column => !excludColumnsMap[typeTableForm.value].includes(column.key) && column.key !== 'actions' && column.key !== 'selectable')
    }

    return dataTable.value.data.columns.filter(column => column.key !== "actions" && column.key !== "id" && column.key !== "selectable");
}
const filterHeaders = () => {
    if (dataTable.value.data.columns.length === 0) return []

    if (isMobile.value) {
        return dataTable.value.data.columns.filter((column, index) => index <= 1 || column.key === "actions")
    }
    if (excludColumnsMap[typeTableForm.value]) {
        return dataTable.value.data.columns.filter(column => !excludColumnsMap[typeTableForm.value].includes(column.key))
    }

    return dataTable.value.data.columns
}

const filteredRows = ref([])
const filterTable = () => {
    if (searchDateRange.value?.length > 0 && applyNowRange.value) {

        filteredRows.value = dataTable.value.data.rows.filter(row => {
            const dateKey = Object.keys(row).find(key => key.startsWith('fecha'))
            return dateKey ? compareRangeDates(row[dateKey], searchDateRange.value[0], searchDateRange.value[1]) : false
        })
        return filteredRows.value
    }

    if (!search.value && searchDateRange.value?.length === 0) {
        filteredRows.value = dataTable.value.data.rows
        return filteredRows.value
    }

    const searchValue = search.value.trim().toString().toLowerCase();

    filteredRows.value = dataTable.value.data.rows.filter(row => {
        return Object.keys(row).some(key => {
            if (key === "actions" || key.startsWith('fecha')) return false;

            if (key.startsWith('estado')) {
                return row[key].estado.toLowerCase().includes(searchValue);
            }
            if (key.startsWith('persona') || key.startsWith('jefe')) {
                return row[key].nombre_completo.toLowerCase().includes(searchValue);
            }

            return row[key]?.toString().toLowerCase().includes(searchValue);
        });
    });
    return filteredRows.value
};

const selectOrUnSelectAll = (value) => {
    filterTable().forEach(row => row['selected'] = value)
}

watch(() => filterTable(), (newValue) => {
    const selectedRows = newValue.filter(row => row['selected'])
    emit('selectedRows', selectedRows)
}, { deep: true, immediate: false })

watch(() => selectAll.value, (newValue) => {
    selectOrUnSelectAll(newValue)
})

watch(() => props.selectRowsBy, async (newValue) => {
    if (newValue && newValue['key']) {

        if (newValue['key'] === 'all') {
            selectAll.value = newValue['value']
            return;
        }
        selectAll.value = false;

        await nextTick();

        if (['REVISION (DE)', 'REVISION (DI)'].includes(newValue['value'])) {
            const areaResponsable = newValue['value'] === 'REVISION (DE)' ? 'INGENIERIA' : 'DIBUJO';

            filterTable().forEach(row => {
                const isRevision = row[newValue['key']] && isRevisionActivity('REVISION', row['titulo_actividad']);
                row['selected'] = isRevision && row['area_responsable'] === areaResponsable;
            });

            return;
        }

        filterTable().forEach(row => {
            if (row[newValue['key']] && newValue['value'] === row[newValue['key']] && !isRevisionActivity('REVISION', row['titulo_actividad'])) {
                row['selected'] = true;
            } else {
                row['selected'] = false;
            }
        });
    }
}, { immediate: false })

const isRevisionActivity = (value, titulo_actividad) => {
    const titulo = titulo_actividad
        .normalize('NFD') // Normaliza el string a la forma de descomposición canónica
        .replace(/[\u0300-\u036f]/g, '') // Elimina los caracteres diacríticos (acentos)
        .toUpperCase(); // Convierte a mayúsculas
    return titulo.includes(value);
}

const filterColumns = () => {
    if (dataTable.value.data.columns.length === 0) return []

    if (isMobile.value) {
        return dataTable.value.data.columns.filter((column, index) => index <= 1 || column.key === "actions")
    }
    if (excludColumnsMap[typeTableForm.value]) {
        return dataTable.value.data.columns.filter(column => !excludColumnsMap[typeTableForm.value].includes(column.key))
    }
    return dataTable.value.data.columns
}
//Get Data Table
const fetchDataTable = async (page) => {
    const url = `${backendUrlFC}/api/data/table/${props.table}/${props.rowSelected?.id}?page=${page}`

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token.value}`,
            'Content-Type': 'application/json',
            Accept: "application/json",
        },
        mode: 'cors',
    })

    const data = await response.json()

    if (!response.ok) {
        throw new HttpError(data.message, response.status)
    }

    dataTable.value = data
}
//Update Row Table
const updateRowTable = (id, newRow) => {
    const index = dataTable.value.data.rows.findIndex(row => row.id === id);
    Object.assign(dataTable.value.data.rows[index], newRow);
    verifyHideActionsByTypeTableForm()
    executeActionAfterUpdateRowTableByTypeTableForm(typeTableForm.value, newRow);
};

const executeActionAfterUpdateRowTableByTypeTableForm = (typeTableForm, newRow) => {
    if (typeTableForm === 'featureFlag') {
        setFeatureFlag(newRow.nombre, newRow.is_active);
    }
}

// const refreshCurrentPage = async () => {
//     setLoadingApp(true)
//     await fetchDataTable(dataTable.value.current_page);
//     setTimeout(() => {
//         setLoadingApp(false)
//     }, 1000);
// };

const prevPage = () => {
    setLoadingApp(true)
    if (dataTable.value.current_page > 1) {
        fetchDataTable(dataTable.value.current_page - 1)
    }
    setLoadingApp(false)
}

const isDisabledPrevPage = computed(() => {
    return dataTable.value.current_page === 1
})

const nextPage = () => {
    setLoadingApp(true)
    if (dataTable.value.current_page < dataTable.value.last_page) {
        fetchDataTable(dataTable.value.current_page + 1)
    }
    setLoadingApp(false)
}

const setLoadingApp = (value, delay = 0) => {
    return setTimeout(() => {
        isLoadingApp.value = value;
    }, delay);
}

const isDisabledNextPage = computed(() => {
    return dataTable.value.current_page === dataTable.value.last_page
})

const isOcupacionCollapsed = ref({})
const isSpecificOcupacionCollapsed = ref({})

const toggleOcupacionCollapse = (index) => {
    isOcupacionCollapsed.value[index] = !isOcupacionCollapsed.value[index]
}

const specificOcupacionClass = (index) => {
    return {
        'bg-cyan-200': index === 'proyectos',
        'bg-emerald-200': index === 'permisos',
        'bg-amber-200': index === 'vacaciones',
        'bg-red-200': index === 'incapacidades',
        'bg-orange-200': index === 'licencias',
    }
}

const toggleSpecificOcupacionCollapse = (index) => {
    isSpecificOcupacionCollapsed.value[index] = !isSpecificOcupacionCollapsed.value[index]
}

const titleOcupacionMap = {
    proyectos: 'Proyectos',
    permisos: 'Permisos',
    vacaciones: 'Vacaciones',
    licencias: 'Licencias',
    incapacidades: 'Incapacidades',
}

const getTitleOcupacion = (index) => {
    return titleOcupacionMap[index]
}

const isModalFreeDatesOpen = ref(false)

const freeDates = ref([])
const dateStartFreeDates = ref(null)
const dateEndFreeDates = ref(null)
const employeeSelected = ref(null)

const clickToFindFreeDates = (employee, startDate, endDate, fechasNoDisponibles) => {
    const freeDates = findFreeDates(startDate, endDate, fechasNoDisponibles)

    if (freeDates.length === 0) {
        Swal.fire({
            position: 'center',
            icon: 'info',
            title: 'No hay fechas libres',
            showConfirmButton: true,
            confirmButtonColor: '#EC7522',
        })
        return
    }

    setFreeDatesData(employee, startDate, endDate, freeDates)
    openFreeDatesModal()
}

const setFreeDatesData = (employee, startDate, endDate, datesFree) => {
    employeeSelected.value = employee
    dateStartFreeDates.value = startDate
    dateEndFreeDates.value = endDate
    freeDates.value = datesFree
}

const openFreeDatesModal = () => {
    isModalFreeDatesOpen.value = true
}

const closeFreeDatesModal = () => {
    isModalFreeDatesOpen.value = false
}

const payloadsMap = {
    'generateCategorizacion': { typeTableForm: typeTableForm.value },
}
</script>
<style>
.custom-shadow {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2),
        0 8px 24px rgba(0, 0, 0, 0.2);
}
</style>
<style scoped>
/* Animaciones para la transición */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0s ease;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active en versiones anteriores a 2.1.8 */
    {
    opacity: 0;
}

.table-fixed {
    table-layout: fixed;
    width: 100%;
}

/* .table-fixed th:nth-child(1) {
    width: 3.125rem;
} */

.table-fixed th.column-60 {
    width: 60%;
}

.custom-shadow {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2),
        0 8px 24px rgba(0, 0, 0, 0.2);
    /* Ajusta los valores según tus necesidades */
}
</style>