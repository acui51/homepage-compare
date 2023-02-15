import { groupBy } from "@/utils/groupBy";
import { useEffect, useState } from "react";
import { supabase } from "supabase";

const SIMILARITY_THRESHOLD = 0.5;

export const useHomepageNews = ({
  lowerBoundDate,
  upperBoundDate,
  searchValue,
}: {
  lowerBoundDate: string;
  upperBoundDate: string;
  searchValue: string;
}) => {
  const [data, setData] = useState<any>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchHomepageNews = async (query: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("homepage-news")
        .select("*")
        .lt("created_at", upperBoundDate)
        .gt("created_at", lowerBoundDate);
      if (error) {
        throw error.message;
      }

      const reqBody = {
        inputs: {
          source_sentence: query,
          sentences: data.map((datum) => {
            let text = datum.title;
            if (datum.description) text += ` ${datum.description}`;
            return text;
          }),
        },
      };

      if (!!query) {
        const res = await fetch("/api/similarSentences", {
          method: "POST",
          body: JSON.stringify(reqBody),
        });
        const { data: similarityScores } = await res.json();

        let clusteredData = [];
        for (let i = 0; i < similarityScores.length; i++) {
          if (similarityScores[i] > SIMILARITY_THRESHOLD) {
            clusteredData.push(data[i]);
          }
        }
        setData(
          groupBy(
            clusteredData.sort((a, b) => a.id - b.id),
            "source_id"
          )
        );
      } else {
        setData(
          groupBy(
            data.sort((a, b) => a.id - b.id),
            "source_id"
          )
        );
      }
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepageNews(searchValue);
  }, [lowerBoundDate, upperBoundDate]);

  return { data, loading, error, refetch: fetchHomepageNews };
};
