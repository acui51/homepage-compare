import { useHomepageNews, usePublicationPreviews } from "@/hooks";
import { Fragment, useState } from "react";
import { Input, Spin, DatePicker, Divider } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import { NewsList } from "@/components";
import dayjs from "dayjs";
import { formatDateString } from "@/utils/formatISOstring";
import Image from "next/image";
import WapoLogo from "../../public/wapo_logo.png";
import WSJLogo from "../../public/wsj_logo.png";
import FoxNewsLogo from "../../public/fox_news_logo.svg";
import { HomepageNewsRow } from "@/hooks/useHomepageNews";
import BreakingNews from "@/components/BreakingNews";

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

  const { data, loading, error, refetch } = useHomepageNews({
    lowerBoundDate: dateRange.lowerBoundDate,
    upperBoundDate: dateRange.upperBoundDate,
    searchValue,
  });

  const { data: publicationPreviews } = usePublicationPreviews({
    lowerBoundDate: dateRange.lowerBoundDate,
    upperBoundDate: dateRange.upperBoundDate,
  });

  const handleArticleClick = (value: string) => {
    setSearchValue(value);
    refetch({ query: value, searchType: "similarity" });
  };

  if (error) {
    return <div>Error...</div>;
  }

  return (
    <main className="flex flex-col items-center px-24 min-h-screen">
      <BreakingNews news={breakingNews} />
      <div className="max-w-7xl flex flex-col items-center py-10">
        <h3 className="text-stone-700 w-2/5 font-bold text-center text-3xl mb-4">
          Get the real story by tracing how coverage compares and evolves
        </h3>
        <Input.Search
          size="large"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={(value) => refetch({ query: value, searchType: "search" })}
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
        {loading || !data ? (
          <Spin />
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
            {data.map((datum) => {
              return (
                <Fragment key={datum.date}>
                  <div className="text-neutral-500 text-xl pb-2 sticky top-20 z-50 bg-white">
                    <Divider>
                      <span className="text-neutral-500 text-xl font-medium">
                        {formatDateString(datum.date)} EST
                      </span>
                    </Divider>
                  </div>
                  <div className="flex gap-4 w-full">
                    {newsSources.map(({ sourceId }, index) => {
                      return (
                        <div className="w-1/3" key={index}>
                          <NewsList
                            newsData={datum.articles[sourceId]?.sort(
                              (a: HomepageNewsRow, b: HomepageNewsRow) =>
                                +new Date(a.created_at!) -
                                +new Date(b.created_at!)
                            )}
                            newsSource={sourceId}
                            radarData={publicationPreviews?.[sourceId]}
                            onArticleClick={handleArticleClick}
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
  // ISR on breaking news
  const THIRTY_MINUTES = 30 * 1000 * 60;
  const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`;

  try {
    const topHeadlines = await fetch(NEWS_API_URL);
    const { articles, status } = await topHeadlines.json();
    if (status !== "ok" || articles.length === 0) {
      return { notFound: true };
    }
    return {
      props: {
        breakingNews: articles,
      },
      revalidate: THIRTY_MINUTES,
    };
  } catch (error) {
    return { notFound: true };
  }
}
