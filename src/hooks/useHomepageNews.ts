import { Database } from "@/schema";
import { groupByDate, groupByKey } from "@/utils/groupBy";
import { useEffect, useState } from "react";
import { supabase } from "supabase";

const SIMILARITY_THRESHOLD = 0.5;

export type HomepageNewsRow =
  Database["public"]["Tables"]["homepage-news"]["Row"];

// [date]:
export type HomepageDateData = {
  [key: string]: HomepageNewsRow[];
};

// [news_source]:
type HomepageData = {
  [key: string]: HomepageDateData;
};

type SearchType = "search" | "similarity";

export const useHomepageNews = ({
  lowerBoundDate,
  upperBoundDate,
  searchValue,
}: {
  lowerBoundDate: string;
  upperBoundDate: string;
  searchValue: string;
}) => {
  const [data, setData] = useState<HomepageData>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTypeState, setSearchTypeState] =
    useState<SearchType>("similarity");

  const fetchHomepageNews = async ({
    query,
    searchType,
  }: {
    query: string;
    searchType?: SearchType;
  }) => {
    console.log("query", query);
    setLoading(true);
    setSearchTypeState((prevSearchType: SearchType) =>
      searchType ? searchType : prevSearchType
    );
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

      console.log("reqBody", reqBody);

      if (!!query) {
        const type = searchType ? searchType : searchTypeState;

        const endpoint =
          type === "search" ? "/api/searchSentences" : "/api/similarSentences";

        const res = await fetch(endpoint, {
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

        const dataGroupedBySource = groupByKey(
          clusteredData.sort(
            (a, b) =>
              new Date(b.created_at).getHours() -
                new Date(a.created_at).getHours() || a.id - b.id
          ),
          "source_id"
        );
        setData(groupByDate(dataGroupedBySource));
      } else {
        const dataGroupedBySource = groupByKey(
          data.sort(
            (a, b) =>
              new Date(b.created_at).getHours() -
                new Date(a.created_at).getHours() || a.id - b.id
          ),
          "source_id"
        );
        setData(groupByDate(dataGroupedBySource));
      }
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepageNews({ query: searchValue });
  }, [lowerBoundDate, upperBoundDate]);

  return { data, loading, error, refetch: fetchHomepageNews };
};
