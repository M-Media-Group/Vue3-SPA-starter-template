<script setup lang="ts">
import { computed, ref, shallowRef } from "vue";
import { debounce } from "@/helpers/debounce";
import DropdownSelect from "@/components/DropdownSelect.vue";
import PaginationNav from "@/components/PaginationNav.vue";
import CardElement from "@/components/CardElement.vue";

export interface Root {
  data?: Daum[];
  links?: Links;
  meta?: Meta;
}

export interface Daum {
  slug: string;
  title?: string;
  description: string;
  privacy: string;
  users_can_create_markers: string;
  options?: Options;
  uuid: string;
  created_at: string;
  updated_at: string;
  markers_count: number;
  is_linked_to_user: boolean;
  user: any;
}

export interface Options {
  links: any;
  default_expiration_time: any;
  limit_to_geographical_body_type: any;
}

export interface Links {
  first: string;
  last: string;
  prev: any;
  next: string;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: Link[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface Link {
  url?: string;
  label: string;
  active: boolean;
}

const searchStringValue = ref("Map");

const data = shallowRef({} as Root | null);
const currentPage = ref(1);
const isLoading = ref(false);
const isLoadingCategories = ref(false);

// Populate the data by calling https://cartes.io/api/maps
const getData = async (page = 1, searchTerm = "Map", categories?: string[]) => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  const response = await fetch(
    `https://cartes.io/api/maps?a=a${
      searchTerm ? `query=title~${searchTerm}ORdescription~${searchTerm}` : ""
    }&page=${page}${
      categories && categories?.length > 0
        ? `&category_ids[]=${categories.join("&category_ids[]=")}`
        : ""
    }
    `,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  const json = await response.json();
  data.value = json as Root | null;

  // Set the current page
  currentPage.value = json.meta?.current_page ?? 1;

  isLoading.value = false;
};

const getDataDebounced = debounce(getData);

getData(currentPage.value);

const showableData = computed(() => {
  if (!data.value?.data) {
    return [];
  }
  // Just return an array of titles, slugs and descriptions
  return data.value.data.map((item) => {
    return {
      title: item.title,
      slug: item.slug,
      description: item.description,
    };
  });
});

const activeFilters = shallowRef([] as string[]);

const filters = shallowRef();

const searchTerm = ref("");

const getCategoriesFromAPI = async () => {
  isLoadingCategories.value = true;
  // Make FETCH request to get the categories
  // Set the filters
  const response = await fetch("https://cartes.io/api/categories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  isLoadingCategories.value = false;

  const json = await response.json();
  filters.value = json.map((item: any) => {
    return {
      id: item.id,
      render: item.name,
    };
  });

  return json;
};

getCategoriesFromAPI();

const currentInfiniteScrollPage = ref(1);

const handleReachInfinitePoint = async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  const response = await fetch(
    `https://cartes.io/api/maps?page=${currentInfiniteScrollPage.value}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  const json = await response.json();

  isLoading.value = false;

  if (!json.data) {
    return;
  }

  data.value = {
    ...data.value,
    data: [...(data.value?.data ?? []), ...json.data],
  };

  // Set the current page
  currentPage.value = json.meta?.current_page ?? 1;

  currentInfiniteScrollPage.value = json.meta?.current_page + 1;

  // If there is no more data, remove the event listener
  if (json.meta?.current_page === json.meta?.last_page) {
    window.removeEventListener("reached-end-of-list", handleReachInfinitePoint);
  }
};

const computedMapDropdownData = computed(() => {
  return showableData.value.map((item) => {
    return {
      id: item.slug,
      render: item.title ?? item.slug,
    };
  });
});
</script>
<template>
  <section id="liveApiSearch">
    <h2>Cartes.io search</h2>
    <p>
      This is a demo of a live search with a dropdown. The dropdown is populated
      with map names from the API. The search is debounced and triggers a new
      API call.
    </p>
    <div role="group">
      <input
        type="search"
        v-model="searchStringValue"
        aria-label="Search"
        @input="
          getDataDebounced(
            1,
            ($event.target as HTMLInputElement).value,
            activeFilters
          )
        "
        :aria-busy="isLoading"
      />

      <!-- Filters dropdown -->
      <dropdown-select
        v-if="filters"
        v-model="activeFilters"
        :options="filters"
        multiple
        searchable
        showSelectedFirst
        :selectAll="false"
        placeholder="Categories"
        v-model:search="searchTerm"
        @update:modelValue="getData(1, searchStringValue, activeFilters)"
        :ariaBusy="isLoadingCategories"
      />
    </div>
    <pagination-nav
      v-if="data"
      :totalItems="data?.meta?.total || 0"
      :currentPage="currentPage"
      :lastPage="data?.meta?.last_page || 0"
      :resultsPerPage="data?.meta?.per_page"
      @update:currentPage="getData($event, searchStringValue, activeFilters)"
    />

    <template v-if="isLoading">
      <!-- 20 fake random <card-element -->
      <card-element
        v-for="item in Array.from(
          { length: data?.meta?.per_page ?? 15 },
          (_, i) => i
        )"
        :key="item"
        :title="`Loading...`"
        :subtitle="`Loading...`"
        :loading="true"
        :images="[
          {
            src: `https://cartes.io/api/maps/images/static`,
            alt: 'Minimal landscape',
          },
        ]"
      >
      </card-element>
    </template>
    <template v-else>
      <card-element
        v-for="item in showableData"
        :key="item.slug"
        :title="item.title"
        :subtitle="item.slug"
        :images="[
          {
            src: `https://cartes.io/api/maps/${item.slug}/images/static`,
            alt: 'Minimal landscape',
          },
        ]"
      >
        {{ item.description }}
        <template #footer>
          <small>Created at: {{ item.slug }}</small>
        </template>
      </card-element>
    </template>
    <pagination-nav
      v-if="data"
      :totalItems="data?.meta?.total || 0"
      :currentPage="currentPage"
      :lastPage="data?.meta?.last_page || 0"
      :resultsPerPage="data?.meta?.per_page"
      @update:currentPage="getData($event, searchStringValue, activeFilters)"
    />
  </section>
  <section id="demoForLiveSearchDropdown">
    <h3>Cartes.io infinite scroll search</h3>
    <p>
      This is a demo of a live search with a dropdown. The dropdown is populated
      with map names from the API. The search is debounced and triggers a new
      API call.
    </p>
    <dropdown-select
      :ariaBusy="isLoading"
      @reached-end-of-list="handleReachInfinitePoint"
      v-if="computedMapDropdownData"
      v-model="activeFilters"
      :options="computedMapDropdownData"
      :visible-limit="computedMapDropdownData.length + 1"
      v-model:search="searchTerm"
      searchable
      showSelectedFirst
    />
  </section>
</template>
