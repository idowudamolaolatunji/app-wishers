import { firestore, handleFirebaseError } from "@/config/firebase";
import { collection, DocumentSnapshot, getDocs, limit, onSnapshot, orderBy, query, QueryConstraint, startAfter, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

export default function useFetchPaginatedData<T>(collectionName: string, constrains: QueryConstraint[] = [], perPage: number = 15) {
	const [data, setData] = useState<T[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
	const [hasMore, setHasMore] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const [searchTerm, setSearchTerm] = useState("");
	const [searching, setSearching] = useState(false);
	const searchTimeoutRef = useRef<NodeJS.Timeout | number | null>(null);
	const currentConstraints = useRef(constrains);

	const fetchInitialData = async function (isSearch = false) {
		if (!collectionName) return;

		if (isSearch) {
			setSearching(true);
		} else {
			setLoading(true);
		}
		setError(null);

		// try {
		const collectionRef = collection(firestore, collectionName);
		const q = query(collectionRef, ...currentConstraints.current, limit(perPage));
		// const snapshot = await getDocs(q);

		const unsub = onSnapshot(
					q,
					(snapshot) => {
			const fetchedData = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as T[];

			setData(fetchedData);
			setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
			setHasMore(snapshot.docs.length === perPage);
			setLoading(false);
			setSearching(false);

		}, (err: any) => {
			const message = handleFirebaseError(err);
			setError(message || "Oops Error!");
			setLoading(false);
			setSearching(false);
		},
		// } catch (err: any) {
		// 	const message = handleFirebaseError(err);
		// 	setError(message || "Oops Error!");
		// } finally {
		// 	setLoading(false);
		// 	setSearching(false);
		// }
	)
		return () => unsub();
	}

	useEffect(
		function () {
			currentConstraints.current = constrains;
			fetchInitialData();
		},
		[collectionName, JSON.stringify(constrains), perPage],
	);

	// Load more function
	const loadMore = async () => {
		if (!hasMore || loadingMore || !lastDoc || loading) return;

		setLoadingMore(true);
		setError(null);

		try {
			const collectionRef = collection(firestore, collectionName);
			// const q = query(collectionRef, ...constrains, startAfter(lastDoc), limit(perPage));
			const q = query(collectionRef, ...currentConstraints.current, startAfter(lastDoc), limit(perPage));

			const snapshot = await getDocs(q);

			const newData = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as T[];

			setData((prev) => [...prev, ...newData]);
			setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
			setHasMore(snapshot.docs.length === perPage);
		} catch (err: any) {
			const message = handleFirebaseError(err);
			setError(message || "Error loading more");
		} finally {
			setLoadingMore(false);
		}
	};

	// Debounced search (Firebase query)
	const search = (term: string, searchField: string) => {
		setSearchTerm(term);

		// Clear previous timeout
		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}

		// If empty, reset to original constraints
		if (!term.trim()) {
			currentConstraints.current = constrains;
			fetchInitialData();
			return;
		}

		// Set new timeout (2 seconds debounce)
		searchTimeoutRef.current = setTimeout(() => {
			// Firebase search using where clause
			// Note: Firebase only supports prefix search
			const searchConstraints = [...constrains, where(searchField, ">=", term), where(searchField, "<=", term + "\uf8ff"), orderBy(searchField)];

			currentConstraints.current = searchConstraints;
			fetchInitialData(true);
		}, 200);
	};

	// Clear search
	const clearSearch = () => {
		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}
		setSearchTerm("");
		currentConstraints.current = constrains;
		fetchInitialData();
	};

	// // Refresh (pull to refresh)
	// const refresh = async () => {
	// 	setRefreshing(true);
	// 	setData([]);
	// 	setLastDoc(null);
	// 	setHasMore(true);
	// 	await fetchInitialData();
	// 	setRefreshing(false);
	// };

	// Refresh
	const refresh = async () => {
		setRefreshing(true);
		setSearchTerm("");
		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}
		currentConstraints.current = constrains;
		setData([]);
		setLastDoc(null);
		setHasMore(true);
		await fetchInitialData();
		setRefreshing(false);
	};

	// Cleanup
	useEffect(() => {
		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, []);

	return {
		data,
		loading,
		loadingMore,
		searching,
		refreshing,
		error,
		hasMore,
		searchTerm,
		loadMore,
		refresh,
		search,
		clearSearch,
	};
}
