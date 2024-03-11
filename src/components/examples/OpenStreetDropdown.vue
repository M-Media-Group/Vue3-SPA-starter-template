<script setup lang="ts">
import { computed, ref, shallowRef } from "vue";
import { debounce } from "@/helpers/debounce";
import DropdownSelect from "@/components/DropdownSelect.vue";
import BaseForm from "@/forms/BaseForm.vue";

const currentGeoResults = shallowRef([]);
const isLoadingGeoResults = ref(false);
const isOpen = ref(false);

const getGeolocationData = async (query: string) => {
  if (isLoadingGeoResults.value) {
    return;
  }
  isLoadingGeoResults.value = true;
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search.php?q=${query}&format=jsonv2`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  const json = await response.json();

  if (json.error) {
    isLoadingGeoResults.value = false;
    return;
  }
  currentGeoResults.value = json;
  isLoadingGeoResults.value = false;
  return json;
};

const selectedGeoResult = ref({} as any);
const selectedGeoResultId = ref([] as string[]);
const geoSearchTerm = ref("");

const selectResult = (result: string[]) => {
  selectedGeoResultId.value = result;
  // Close the dropdown
  isOpen.value = false;
  // Set the selected result

  selectedGeoResult.value = currentGeoResults.value.find(
    // @ts-ignore
    (item) => item.place_id == result
  );

  console.log(
    "result",
    result,
    "found",
    selectedGeoResult.value,
    "all",
    currentGeoResults.value
  );
};

const optionsToShow = computed(() => {
  return currentGeoResults.value?.map((item) => {
    return {
      // @ts-ignore
      id: item.place_id,
      // @ts-ignore
      render: item.display_name,
      raw: item,
    };
  });
});

// We need to make sure that the optionsToShow also includes the selectedGeoResult
const optionsToShowWithSelected = computed(() => {
  if (
    selectedGeoResult.value?.place_id &&
    // And doesnt already exist in the optionsToShow
    !optionsToShow.value.find(
      (item) => item.id == selectedGeoResult.value.place_id
    )
  ) {
    // Use a set to remove duplicates
    const allData = [
      {
        id: selectedGeoResult.value.place_id,
        render: selectedGeoResult.value.display_name,
        raw: selectedGeoResult.value,
      },
      ...optionsToShow.value,
    ];

    return Array.from(new Set(allData));
  }
  return optionsToShow.value;
});

const debounceGetGeolocationData = debounce(getGeolocationData);
</script>

<template>
  <main>
    <section>
      <h2>Live search with dropdown for geolocation</h2>
      <p>
        This is a demo of a live search with a dropdown. The dropdown is
        populated with geolocation names from the API. The search is debounced
        and triggers a new API call.
      </p>
      <base-form :disabled="selectedGeoResultId.length === 0">
        <dropdown-select
          :ariaBusy="isLoadingGeoResults"
          @update:modelValue="selectResult"
          :modelValue="selectedGeoResultId"
          :options="optionsToShowWithSelected"
          v-model:search="geoSearchTerm"
          @update:search="debounceGetGeolocationData($event)"
          searchable
          autofocus
          required
          v-model:isOpen="isOpen"
          :searchLocally="false"
        >
          <template #optionSlot="{ option, updateModelValue }">
            <label>
              <input
                type="checkbox"
                :value="option.id"
                :checked="selectedGeoResultId.includes(option.id)"
                @click="updateModelValue"
              />
              <span>{{ option.render }}</span>
              <small> - {{ option.raw.addresstype }}</small>
            </label>
          </template>
        </dropdown-select>
      </base-form>
      <details>
        <summary>Selected result</summary>
        <pre>{{ selectedGeoResult }}</pre>
      </details>
    </section>
  </main>
</template>
