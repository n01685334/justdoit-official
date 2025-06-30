import { type DependencyList, useEffect, useState } from "react";
import type { ApiError, ApiResponse } from "@/types/api";

export const useFetch = <T>(path: string, deps: DependencyList = []) => {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setLoading(true);
		setError(null);
		const abortController = new AbortController();

		const fetchData = async () => {
			try {
				const response = await fetch(path, {
					signal: abortController.signal,
				});

				if (!response.ok) {
					const err: ApiError = await response.json();
					setError(err.error);
					return;
				}

				const { data: result }: ApiResponse<T> = await response.json();

				if (!result) {
					throw new Error(`Request failed: ${path}`);
				}

				setData(result);
			} catch (err) {
				setError(err?.toString() || `Error fetching data: ${path}`);
			} finally {
				setLoading(false);
			}
		};

		fetchData();

		return () => {
			abortController.abort();
		};
	}, [path, ...deps]);

	return {
		data,
		loading,
		error,
	};
};
