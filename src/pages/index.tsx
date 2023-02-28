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

type DateRange = {
  lowerBoundDate: string;
  upperBoundDate: string;
};

export default function Home() {
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
    <main className="flex flex-col items-center px-24 py-10 min-h-screen">
      <div className="max-w-7xl flex flex-col items-center">
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
                  <div className="w-1/3">
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
                <Fragment>
                  <div className=" text-neutral-500 text-xl mb-4 sticky top-20 z-50 bg-white">
                    {formatDateString(datum.date)} EST
                    <Divider />
                  </div>
                  <div className="flex gap-4 w-full">
                    {newsSources.map(({ sourceId }) => {
                      return (
                        <div className="w-1/3">
                          <NewsList
                            newsData={datum.articles[sourceId]}
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
