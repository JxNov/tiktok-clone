<template>
  <div>
    <input
      :id="`input-${placeholder}`"
      :placeholder="placeholder"
      class="block w-full bg-[#F1F1F2] text-gray-800 border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none"
      :type="inputType"
      v-model="inputComputed"
      autocomplete="off"
      :maxlength="max"
      :class="{ 'border-red-500': error }"
    />

    <span v-if="error" class="text-red-500 text-[14px] font-semibold">
      {{ error }}
    </span>
  </div>
</template>

<script setup>
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: String,
  placeholder: String,
  inputType: String,
  max: Number,
  autoFocus: Boolean,
  error: String,
});
const { modelValue, placeholder, inputType, max, autoFocus, error } =
  toRefs(props);

onMounted(() => {
  if (autoFocus.value) {
    document.getElementById(`input-${placeholder.value}`).focus();
  }
});

const inputComputed = computed({
  get: () => modelValue.value,
  set: (val) => emit("update:modelValue", val),
});
</script>
