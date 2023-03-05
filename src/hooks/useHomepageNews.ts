import { Database } from "@/schema";
import { zeroISOString } from "@/utils/zeroISOString";
import { useEffect, useState } from "react";
import { supabase } from "supabase";

const SIMILARITY_THRESHOLD = 0.3;

export type HomepageNewsRow =
  Database["public"]["Tables"]["homepage-news"]["Row"];

export type SearchType = "search" | "similarity";

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

function getPagination(page: number, size = 180) {
  const limit = size ? +size : 3;
  const from = page ? page * limit : 0;
  const to = page ? from + size - 1 : size - 1;

  return { from, to };
}

function transformHomepageNewsData(data: HomepageNewsRow[]) {
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
}

export const useHomepageNews = ({
  lowerBoundDate,
  upperBoundDate,
  searchValue,
  page,
}: {
  lowerBoundDate: string;
  upperBoundDate: string;
  searchValue: string;
  page: number;
}) => {
  const [data, setData] = useState<
    {
      date: string;
      articles: { [key: string]: any };
    }[]
  >([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTypeState, setSearchTypeState] =
    useState<SearchType>("similarity");
  const [hasNextPage, setHasNextPage] = useState(true);

  const resetHasNextPage = () => {
    setHasNextPage(true);
  };

  const fetchHomepageNews = async ({
    query,
    searchType,
    page,
  }: {
    query: string;
    searchType?: SearchType;
    page: number;
  }) => {
    setLoading(true);
    setError("");
    setSearchTypeState((prevSearchType: SearchType) =>
      searchType ? searchType : prevSearchType
    );

    try {
      const { from, to } = getPagination(page);
      const { data, error } = await supabase
        .from("homepage-news")
        .select("*")
        .lt("created_at", upperBoundDate)
        .gt("created_at", lowerBoundDate)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        throw error.message;
      }

      if (data.length === 0) {
        setHasNextPage(false);
        setLoading(false);
        return;
      }

      const reqBody = {
        inputs: {
          source_sentence: query,
          sentences: data.map((datum) => {
            let text = datum.title;
            if (!text) {
              return "";
            }
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

        if (similarityScores.estimated_time) {
          // Refetch
          setTimeout(
            () => fetchHomepageNews({ query, searchType, page }),
            similarityScores.estimated_time * 1000
          );

          throw Error(
            `Model is loading. Refetching in ${similarityScores.estimated_time} seconds`
          );
        }

        let clusteredData: HomepageNewsRow[] = [];

        for (let i = 0; i < similarityScores.length; i++) {
          if (similarityScores[i] > SIMILARITY_THRESHOLD) {
            clusteredData.push(data[i]);
          }
        }

        page === 0
          ? setData(transformHomepageNewsData(clusteredData))
          : setData((prevData) => [
              ...prevData,
              ...transformHomepageNewsData(clusteredData),
            ]);
      } else {
        page === 0
          ? setData(transformHomepageNewsData(data))
          : setData((prevData) => [
              ...prevData,
              ...transformHomepageNewsData(data),
            ]);
      }
      setLoading(false);
    } catch (error: any) {
      setError(error.message as string);
    }
  };

  useEffect(() => {
    fetchHomepageNews({ query: searchValue, page: page });
  }, [lowerBoundDate, upperBoundDate, page]);

  return {
    data,
    loading,
    error,
    hasNextPage,
    refetch: fetchHomepageNews,
    resetHasNextPage,
  };
};
