<script setup lang="ts">
import { computed } from "vue";
import BaseButton from "./BaseButton.vue";
import i18n from "@/locales/i18n";

const emit = defineEmits([
  /** The page the user has navigated to, either by clicking directly on a page or by using the previous and next buttons */
  "update:currentPage",
]);

const props = defineProps({
  /** The count of total items */
  totalItems: {
    type: Number,
    required: true,
    validator: (value: number) => value >= 0,
  },
  /** The current page. Note that this is the same as the emit, so when using this component, you can just use a v-model:currentPage for two-way binding */
  currentPage: {
    type: Number,
    required: false,
    default: 1,
  },
  /** The results to show per page */
  resultsPerPage: {
    type: Number,
    required: false,
    default: 5,
  },
  /** The maximum amount of pages to show before truncating. Basically, it will be: [min-page] ... [x amount of pages around and including the current page, determined by this prop] ... [max-page] */
  maxPages: {
    type: Number,
    required: false,
    default: 5,
    validator: (value: number) => value >= 3,
  },
  /** Show the previous and next buttons */
  showPrevNext: {
    type: Boolean,
    required: false,
    default: true,
  },
  /** An optional lastPage parameter to override the calculated last page. If this value is set and less than the calculated last page, then the pagination will show the last page as this value */
  lastPage: {
    type: Number,
    required: false,
  },
  /** The text to use in the separator */
  separatorText: {
    type: String,
    required: false,
    default: "...",
  },
  /** Go to page input */
  goToPage: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const totalPages = computed(() => {
  const computedTotal = Math.ceil(props.totalItems / props.resultsPerPage);
  return props.lastPage
    ? Math.min(computedTotal, props.lastPage)
    : computedTotal;
});

type Page = {
  pageNumber: number;
  text: string;
  clickable: boolean;
  selected?: boolean;
};

const formatNumer = (number: number) => {
  return new Intl.NumberFormat(i18n.global.locale.value).format(number);
};

const getSeparators = (
  currentPage: number,
  totalPages: number,
  maxPages: number
) => {
  const halfMaxPages = Math.floor((props.maxPages - 1) / 2);

  const showFirstSeparator =
    currentPage > halfMaxPages &&
    // Or if we already will show the page in the second part, (e.g. to prevent 1 ... 1 2 3 4 5 ... 10)
    currentPage > halfMaxPages + 1 &&
    totalPages > maxPages;

  const showLastSeparator =
    currentPage < totalPages - halfMaxPages &&
    // Or if we already will show the page in the second part, (e.g. to prevent 1 ... 1 2 3 4 5 ... 10)
    currentPage < totalPages - halfMaxPages - 1 &&
    totalPages > maxPages;

  return [showFirstSeparator, showLastSeparator];
};

/** An array of pages to show. We show x-1, then a separator, then the last page,. The first part length is the maxPages - 1 */
const pages = computed(() => {
  const pages: Page[] = [];
  const maxPages = props.maxPages - 1;
  const currentPage = props.currentPage;
  const newTotalPages = totalPages.value;
  const halfMaxPages = Math.floor(maxPages / 2);

  // If the maxPages + 2 (the first and last page) is greater than the total pages, then we just show all the pages
  if (newTotalPages <= maxPages + 2) {
    for (let i = 1; i <= newTotalPages; i++) {
      pages.push({ pageNumber: i, text: formatNumer(i), clickable: true });
    }
    return pages;
  }

  const [showFirstSeparator, showLastSeparator] = getSeparators(
    currentPage,
    newTotalPages,
    maxPages
  );

  const firstPageToShow = showFirstSeparator ? currentPage - halfMaxPages : 1;
  const lastPageToShow = showLastSeparator
    ? currentPage + halfMaxPages
    : newTotalPages;
  if (showFirstSeparator) {
    pages.push({ pageNumber: 1, text: formatNumer(1), clickable: true });
    pages.push({ pageNumber: 0, text: props.separatorText, clickable: false });
  }
  for (let i = firstPageToShow; i <= lastPageToShow; i++) {
    pages.push({ pageNumber: i, text: formatNumer(i), clickable: true });
  }
  if (showLastSeparator) {
    pages.push({ pageNumber: 0, text: props.separatorText, clickable: false });
    pages.push({
      pageNumber: newTotalPages,
      text: formatNumer(newTotalPages),
      clickable: true,
    });
  }
  return pages;
});

const handleInput = (value: string) => {
  const number = parseInt(value, 10);
  if (number > 0 && number <= totalPages.value) {
    emit("update:currentPage", number);
  }
};
</script>
<template>
  <nav aria-label="Pagination">
    <template v-if="showPrevNext">
      <base-button
        @click="emit('update:currentPage', currentPage - 1)"
        aria-label="Previous page"
        class="prev"
        :disabled="currentPage <= 1"
      >
        <span aria-hidden="true">&laquo;</span>
      </base-button>
    </template>
    <template v-for="page in pages" :key="page.pageNumber">
      <base-button
        v-if="page.clickable"
        @click="emit('update:currentPage', page.pageNumber)"
        :aria-label="`Go to page ${page.pageNumber}`"
        :disabled="page.pageNumber === currentPage"
        class="outline contrast"
      >
        {{ page.text }}
      </base-button>
      <button v-else disabled class="outline secondary" type="button">
        {{ page.text }}
      </button>
    </template>
    <template v-if="goToPage">
      <input
        type="number"
        min="1"
        :max="totalPages"
        :value="currentPage"
        @input="handleInput(($event.target as HTMLInputElement).value)"
        aria-label="Go to page"
        class="go-to-page"
      />
    </template>
    <template v-if="showPrevNext">
      <base-button
        @click="emit('update:currentPage', currentPage + 1)"
        aria-label="Next page"
        class="next"
        :disabled="currentPage >= totalPages"
      >
        <span aria-hidden="true">&raquo;</span>
      </base-button>
    </template>
  </nav>
</template>
