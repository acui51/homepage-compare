import { useHomepageNews, usePublicationPreviews } from "@/hooks";
import { Fragment, useCallback, useState } from "react";
import { Input, Spin, DatePicker, Divider } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import { NewsList, NewsPreview } from "@/components";
import dayjs from "dayjs";
import { formatDateString } from "@/utils/formatISOstring";
import Image from "next/image";
import WapoLogo from "../../public/wapo_logo.png";
import WSJLogo from "../../public/wsj_logo.png";
import FoxNewsLogo from "../../public/fox_news_logo.svg";
import { HomepageNewsRow } from "@/hooks/useHomepageNews";
import BreakingNews from "@/components/BreakingNews";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import type { SearchType } from "@/hooks/useHomepageNews";

type DateRange = {
  lowerBoundDate: string;
  upperBoundDate: string;
};

type Props = {
  breakingNews: any;
};

export default function Home({ breakingNews }: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    lowerBoundDate: getInitialLowerBoundDate(),
    upperBoundDate: getInitialUpperBoundDate(),
  });
  const [newsSources, setNewsSources] = useState([
    {
      sourceId: "the-washington-post",
      sourceName: "The Washington Post",
    },
    {
      sourceId: "wsj",
      sourceName: "The Wall Street Journal",
    },
    {
      sourceId: "fox-news",
      sourceName: "Fox News",
    },
  ]);
  const [page, setPage] = useState(0);
  const [lastElement, setLastElement] = useState(null);

  const { data, loading, error, hasNextPage, refetch, resetHasNextPage } =
    useHomepageNews({
      lowerBoundDate: dateRange.lowerBoundDate,
      upperBoundDate: dateRange.upperBoundDate,
      searchValue,
      page,
    });

  const { data: publicationPreviews } = usePublicationPreviews({
    lowerBoundDate: dateRange.lowerBoundDate,
    upperBoundDate: dateRange.upperBoundDate,
  });

  useIntersectionObserver({
    observedElement: lastElement,
    callback: (entries: IntersectionObserverEntry[]) => {
      if (!hasNextPage) return;
      const first = entries[0];
      if (first.isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    },
  });

  const handleSearchFill = useCallback(
    (value: string, searchType: SearchType) => {
      setSearchValue(value);
      setPage(0);
      refetch({ query: value, searchType: searchType, page: 0 });
    },
    []
  );

  return (
    <main className="flex flex-col items-center px-24 min-h-screen">
      <BreakingNews
        news={breakingNews}
        onClick={(value) => handleSearchFill(value, "search")}
      />
      <div className="max-w-7xl flex flex-col items-center py-10">
        <h3 className="text-stone-700 w-2/5 font-bold text-center text-3xl mb-4">
          Get the real story by tracing how coverage compares and evolves
        </h3>
        <Input.Search
          size="large"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={(value) => handleSearchFill(value, "search")}
          placeholder="Search for anything within the date range"
          className="w-3/5 mb-16"
        />
        <DatePicker.RangePicker
          defaultValue={[
            dayjs(dateRange.lowerBoundDate),
            dayjs(dateRange.upperBoundDate),
          ]}
          showTime={{ format: "HH:mm" }}
          format="YYYY-MM-DD HH:mm"
          onOk={onOk}
          className="w-84 self-start"
        />
        {loading && page === 0 ? (
          <div className="flex-col flex">
            <Spin />
            {error && <span className="text-gray-400">{error}</span>}
          </div>
        ) : (
          <div>
            <div className="flex gap-4 w-full sticky top-0 z-50 bg-white">
              {newsSources.map(({ sourceId, sourceName }) => {
                return (
                  <div className="w-1/3" key={sourceId}>
                    <Image
                      alt={sourceName}
                      src={getNewsTitleMedia(sourceId)}
                      className="object-contain h-24 container mx-auto w-2/3"
                    />
                  </div>
                );
              })}
            </div>
            {data.length === 0 && <div>No results found...</div>}
            {data.map((datum, index) => {
              return (
                <Fragment key={datum.date}>
                  <div className="text-neutral-500 text-xl pb-2 sticky top-20 z-50 bg-white">
                    <Divider>
                      <span className="text-neutral-500 text-xl font-medium">
                        {formatDateString(datum.date)} EST
                      </span>
                    </Divider>
                  </div>
                  <div className="px-2 flex gap-4 w-full">
                    {newsSources.map(({ sourceId }) => {{
                      return index === 0 && publicationPreviews?.[sourceId]?.length >= 10 && Date.parse(dateRange.upperBoundDate) - Date.parse(dateRange.lowerBoundDate) >= 86400000 && (
                        <NewsPreview radarData={publicationPreviews?.[sourceId]} />
                      )}
                    })}
                  </div>
                  <div className="px-2 flex gap-4 w-full">
                    {newsSources.map(({ sourceId }, index) => {
                      return (
                        <div
                          className="w-1/3"
                          key={index}
                          // @ts-ignore
                          ref={
                            index === newsSources.length - 1
                              ? setLastElement
                              : undefined
                          }
                        >
                          <NewsList
                            newsData={datum.articles[sourceId]?.sort(
                              (a: HomepageNewsRow, b: HomepageNewsRow) =>
                                +new Date(a.created_at!) -
                                +new Date(b.created_at!)
                            )}
                            newsSource={sourceId}
                            radarData={publicationPreviews?.[sourceId]}
                            onArticleClick={(value) =>
                              handleSearchFill(value, "similarity")
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </Fragment>
              );
            })}
          </div>
        )}
        {loading && page > 0 && <Spin />}
      </div>
    </main>
  );

  function onOk(value: RangePickerProps["value"]) {
    if (!value) {
      return;
    }
    const [lowerBoundTime, upperBoundTime] = value;
    if (lowerBoundTime && upperBoundTime) {
      setDateRange({
        lowerBoundDate: lowerBoundTime.toISOString(),
        upperBoundDate: upperBoundTime.toISOString(),
      });
      setPage(0);
      resetHasNextPage();
    }
  }

  function getInitialLowerBoundDate() {
    const currentDate: Date = new Date();
    currentDate.setHours(currentDate.getHours() - 1);
    return currentDate.toISOString();
  }

  function getInitialUpperBoundDate() {
    const currentDate: Date = new Date();
    return currentDate.toISOString();
  }

  function getNewsTitleMedia(newsSource: string) {
    switch (newsSource) {
      case "wsj":
        return WSJLogo;
      case "the-washington-post":
        return WapoLogo;
      case "fox-news":
        return FoxNewsLogo;
      // TODO: change default news logo
      default:
        return WSJLogo;
    }
  }
}

export async function getStaticProps() {
  const { Configuration, OpenAIApi } = require("openai");

  // ISR on breaking news
  const THIRTY_MINUTES = 30 * 1000 * 60;
  const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`;
  try {
    const topHeadlines = await fetch(NEWS_API_URL);
    const { articles, status } = await topHeadlines.json();
    if (status !== "ok" || articles.length === 0) {
      return { notFound: true };
    }

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const prompt = `
        Given a list of headlines, write a search query for each headline
        that users would commonly use to search for similar news stories on the same topic.
        Each query may contain words that are not in the original headline,
        but are relevant to the overall topic. For example, based on the input
        "U.S. analysis keeps covid 'lab leak' theory in play, Balloon Incident Reveals More Than Spying as Competition With China Intensifies", the output would be
        something like ["COVID origin theory", "Chinese balloon spying incident"] in JSON array format.
        Now, given this comma delimited list of headlines, output only a JSON array of
        queries for them: ${articles
          .map((article: any) => article.title)
          .join(", ")} . And don't add the word "Answer".
    `;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    return {
      props: {
        breakingNews: response.data,
      },
      revalidate: THIRTY_MINUTES,
    };
  } catch (error) {
    return { notFound: true };
  }
}
