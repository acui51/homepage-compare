import React, { useEffect, useState } from "react"

export const usePublicationPreviews = ({ lowerBoundDate, upperBoundDate }: {lowerBoundDate: string, upperBoundDate: string }) => {
  const [data, setData] = useState<any>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchPublicationPreviews() {
    // Fetch radar data from Flask API endpoint.
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:8000/radar?from=${lowerBoundDate}&to=${upperBoundDate}`);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPublicationPreviews();
  }, [lowerBoundDate, upperBoundDate]);

  return { data, error, loading };
};
