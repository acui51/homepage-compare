import { Database } from "@/schema";
import { zeroISOString } from "@/utils/zeroISOString";
import { useEffect, useState } from "react";
import { supabase } from "supabase";

const SIMILARITY_THRESHOLD = 0.5;

export type HomepageNewsRow =
  Database["public"]["Tables"]["homepage-news"]["Row"];

type SearchType = "search" | "similarity";

type DateToArticlesObjType = {
  [date: string]: {
    articles: {
      [source: string]: HomepageNewsRow[];
    };
  };
};

type TransformedDateToArticlesType = {
  date: string;
  articles: {
    [source: string]: HomepageNewsRow[];
  };
};

const transformHomepageNewsData = (data: HomepageNewsRow[]) => {
  const dateToArticlesObj: DateToArticlesObjType = {};

  for (const datum of data) {
    const zerodIsoString = zeroISOString(datum.created_at!);
    if (!dateToArticlesObj[zerodIsoString]) {
      dateToArticlesObj[zerodIsoString] = {
        articles: {},
      };
    }

    if (!dateToArticlesObj[zerodIsoString].articles[datum.source_id!]) {
      dateToArticlesObj[zerodIsoString].articles[datum.source_id!] = [];
    }

    dateToArticlesObj[zerodIsoString].articles[datum.source_id!].push(datum);
  }

  // Transform dateToArticlesObj to be array
  const res: TransformedDateToArticlesType[] = [];
  for (const key of Object.keys(dateToArticlesObj)) {
    res.push({
      date: key,
      articles: dateToArticlesObj[key].articles,
    });
  }

  return res.sort((a, b) => +new Date(b.date) - +new Date(a.date));
};

export const useHomepageNews = ({
  lowerBoundDate,
  upperBoundDate,
  searchValue,
}: {
  lowerBoundDate: string;
  upperBoundDate: string;
  searchValue: string;
}) => {
  const [data, setData] = useState<
    {
      date: string;
      articles: { [key: string]: any };
    }[]
  >();
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
        setData(transformHomepageNewsData(clusteredData));
      } else {
        setData(transformHomepageNewsData(data));
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
