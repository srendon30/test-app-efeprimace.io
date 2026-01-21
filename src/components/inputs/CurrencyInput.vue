<template>
    <input ref="inputRef" type="text" placeholder="Valor" :disabled="disabled"
        :class="disabled ? 'bg-gray-400' : 'bg-white'"
        class="block w-full rounded-lg px-5 py-2.5 placeholder-gray-400/70 text-gray-700 border border-gray-200 dark:border-gray-600 focus:border-indigo-600 dark:focus:border-indigo-300 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
        :value="displayValue" @change="onChange" />
</template>

<script>
import { watch, ref } from "vue";
import { useCurrencyInput } from "vue-currency-input";

export default {
    name: "CurrencyInput",
    props: {
        options: Object,
        disabled: Boolean,
        modelValue: Number,
    },
    setup(props, { emit }) {
        const { formattedValue, setValue, inputRef } = useCurrencyInput(props.options)

        const displayValue = ref(formattedValue.value);

        watch(formattedValue, (newVal) => {
            displayValue.value = newVal;
        });

        watch(() => props.modelValue, (newVal) => {
            setValue(newVal);
            if (newVal === null || newVal === '') {
                displayValue.value = '';
            }
        });

        const onChange = (event) => {
            const parsedValue = parseFloat(event.target.value.replace(/,/g, ''));
            if (!isNaN(parsedValue)) {
                emit('update:modelValue', parsedValue);
            } else if (event.target.value === '') {
                emit('update:modelValue', null);
            }
        };

        return { inputRef, displayValue, onChange };
    },
};
</script>
<!-- ------------------------------------------------------------------------------------------------------------------------ -->
<!-- <script>
import { watch, ref } from "vue";
import { useCurrencyInput } from "vue-currency-input";

export default {
    name: "CurrencyInput",
    props: {
        options: Object,
        disabled: Boolean,
        modelValue: Number,
    },
    setup(props, { emit }) {
        const { formattedValue, inputRef } = useCurrencyInput(props.options)

        const internalValue = ref(props.modelValue);

        watch(formattedValue, (newVal) => {
            const parsedValue = parseFloat(newVal);
            if (!isNaN(parsedValue)) {
                emit('update:modelValue', parsedValue);
            }
        });

        watch(() => props.modelValue, (newVal) => {
            if (newVal === null || newVal === '') {
                internalValue.value = '';
            } else {
                internalValue.value = newVal;
            }
        });

        return { inputRef, formattedValue: internalValue };
    },
};
</script> -->
<!-- ------------------------------ -->
<!-- <script>
import { watch } from "vue";
import { useCurrencyInput } from "vue-currency-input";
export default {
    name: "CurrencyInput",
    props: {
        options: Object,
        disabled: Boolean,
        modelValue: Number,
    },
    setup(props, { emit }) {
        const { formattedValue, inputRef } = useCurrencyInput(props.options)

        watch(formattedValue, (newVal) => {
            emit('update:modelValue', parseFloat(newVal));
        });

        return { inputRef, formattedValue };
    },
};
</script> -->
<!-- <template>
    <input ref="inputRef" type="text" placeholder="Valor" :disabled="disabled"
        :class="disabled ? 'bg-gray-400' : 'bg-white'"
        class="block w-full rounded-lg px-5 py-2.5 placeholder-gray-400/70 text-gray-700 border border-gray-200 dark:border-gray-600 focus:border-indigo-600 dark:focus:border-indigo-300 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40"
        :value="modelValue" @input="onInput" />
</template>
--------------------------------------------------------------------------------------------------------------------------------------------------------------
<script>
import { useCurrencyInput } from "vue-currency-input";

export default {
    name: "CurrencyInput",
    props: {
        options: Object,
        disabled: Boolean,
        modelValue: Number,
    },
    setup(props, { emit }) {
        const { inputRef } = useCurrencyInput(props.options);
        // Emitir un evento 'update:modelValue' cuando el valor del input cambiar
        const onInput = event => {
            emit('update:modelValue', parseFloat(event.target.value));
        };
        return { inputRef, onInput };
    },
};
</script> -->
<!-- ------------------------------------------------------------------------------------------------------------------------ -->
<!-- <template>
    <input ref="inputRef" type="text" placeholder="Valor" :disabled="disabled"
        :class="disabled ? 'bg-gray-400' : 'bg-white'"
        class="block w-full rounded-lg px-5 py-2.5 placeholder-gray-400/70 text-gray-700 border border-gray-200 dark:border-gray-600 focus:border-indigo-600 dark:focus:border-indigo-300 focus:ring-indigo-300 focus:outline-none focus:ring focus:ring-opacity-40" />
</template>

<script>
import { useCurrencyInput } from "vue-currency-input";

export default {
    name: "CurrencyInput",
    props: {
        options: Object,
        disabled: Boolean,
        modelValue: Number,
    },
    setup(props) {
        const { inputRef } = useCurrencyInput(props.options);
        return { inputRef };
    },
};
</script> -->