import { useHomepageNews, usePublicationPreviews } from "@/hooks";
import { useState } from "react";
import { Input, Spin, DatePicker } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import { NewsList } from "@/components";
import dayjs from "dayjs";

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
          <div className="flex gap-4 w-full">
            <div className="w-1/3">
              <NewsList
                newsData={data["the-washington-post"]}
                newsTitle="The Washington Post"
                newsSource="the-washington-post"
                radarData={publicationPreviews?.["the-washington-post"]}
                onArticleClick={handleArticleClick}
              />
            </div>
            <div className="w-1/3">
              <NewsList
                newsData={data["wsj"]}
                newsTitle="The Wall Street Journal"
                newsSource="wsj"
                radarData={publicationPreviews?.["wsj"]}
                onArticleClick={handleArticleClick}
              />
            </div>
            <div className="w-1/3">
              <NewsList
                newsData={data["fox-news"]}
                newsTitle="Fox News"
                newsSource="fox-news"
                radarData={publicationPreviews?.["fox-news"]}
                onArticleClick={handleArticleClick}
              />
            </div>
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
}
