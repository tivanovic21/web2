import { ref } from 'vue';

export function useSubjectBooks(subjectKey) {
    const books = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const apiUrl = `https://openlibrary.org/subjects/${subjectKey}.json?limit=10`;

    const fetchBooks = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`API error! status: ${response.status}`);
            }

            const data = await response.json();
            books.value = data.works || [];
        } catch (err) {
            console.error("error fetching books:", err);
            error.value = err;
        } finally {
            loading.value = false;
        }
    }
    return { books, loading, error, fetchBooks };
}