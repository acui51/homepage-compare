import { useHomepageNews } from "@/hooks/useHomepageNews";
import { useState } from "react";
import { Input, Spin, DatePicker } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import { NewsList } from "@/components";
import dayjs from "dayjs";

type DateRange = {
  lowerBoundDate: string;
  upperBoundDate: string;
};

const LOGO_ASSETS = {
  "the-washington-post": "/wapo_logo.png",
  wsj: "/wsj_logo.png",
  "fox-news": "/fox_news_logo.svg",
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

  const handleArticleClick = (value: string) => {
    setSearchValue(value);
    refetch(value);
  };

  if (error) {
    return <div>Error...</div>;
  }

  return (
    <main className="flex flex-col items-center px-24 py-12 min-h-screen">
      <div className="max-w-7xl flex flex-col items-center">
        <h3 className="font-bold text-2xl mb-8">Homepage Compare</h3>
        <h3 className="font-bold">Search:</h3>
        <Input.Search
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={(value) => refetch(value)}
          placeholder="Enter an article headline or full sentence..."
          className="w-96 mb-8"
        />
        <h3 className="font-bold">Dates:</h3>
        <DatePicker.RangePicker
          defaultValue={[
            dayjs(dateRange.lowerBoundDate),
            dayjs(dateRange.upperBoundDate),
          ]}
          showTime={{ format: "HH:mm" }}
          format="YYYY-MM-DD HH:mm"
          onOk={onOk}
          className="w-96 mb-8"
        />
        {loading || !data ? (
          <Spin />
        ) : (
          <div className="flex gap-4 w-full">
            <div className="w-1/3">
              <NewsList
                newsTitleMedia={LOGO_ASSETS["the-washington-post"]}
                newsData={data["the-washington-post"]}
                newsTitle="The Washington Post"
                newsSource="the-washington-post"
                onArticleClick={handleArticleClick}
              />
            </div>
            <div className="w-1/3">
              <NewsList
                newsTitleMedia={LOGO_ASSETS["wsj"]}
                newsData={data["wsj"]}
                newsTitle="The Wall Street Journal"
                newsSource="wsj"
                onArticleClick={handleArticleClick}
              />
            </div>
            <div className="w-1/3">
              <NewsList
                newsTitleMedia={LOGO_ASSETS["fox-news"]}
                newsData={data["fox-news"]}
                newsTitle="Fox News"
                newsSource="fox-news"
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
