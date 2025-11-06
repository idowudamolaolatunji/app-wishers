import { firestore } from "@/config/firebase";
import { collection, onSnapshot, query, QueryConstraint } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function useFetchData<T>(collectionName: string, constrains: QueryConstraint[] = []) {
	const [data, setData] = useState<T[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(function () {
		if (!collectionName) return;
		setLoading(true);
		const collectionRef = collection(firestore, collectionName);
		const q = query(collectionRef, ...constrains);

		const unsub = onSnapshot(
			q,
			(snapshot) => {
				const fetchedData = snapshot.docs.map((doc) => {
					return {
						id: doc.id,
						...doc.data(),
					};
				}) as T[];
				// console.log(fetchedData);
				setData(fetchedData);
				setLoading(false);
			},
			(err) => {
				console.log("Error fetching data: ", err);
				setError(err.message);
				setLoading(false);
			},
		);

		return () => unsub();
	}, []);

	return { data, loading, error };
}
