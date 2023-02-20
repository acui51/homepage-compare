import React, { useEffect, useState } from "react"

export const usePublicationPreviews = () => {
    const [data, setData] = useState<any>();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
  
    async function fetchPublicationPreviews() {
      // fetch from Flask API endpoint /radar
      const response = await fetch("http://127.0.0.1:8000/radar");
      const data = await response.json();
      setData(data);
      setLoading(false);
    }

    useEffect(() => {
      fetchPublicationPreviews();
    }, []);

    return { data, error, loading };
  };
