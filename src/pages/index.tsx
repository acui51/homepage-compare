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

  if (error) {
    return <div>Error...</div>;
  }

  return (
    <main className="flex flex-col items-center p-24 min-h-screen">
      <h3 className="font-bold">Search:</h3>
      <Input.Search
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onSearch={(value) => (value === "" ? refetch(false) : refetch(true))}
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
      {loading ? (
        <Spin />
      ) : (
        <div className="flex gap-4 w-full">
          <div className="w-1/3">
            <NewsList
              newsData={data["the-washington-post"]}
              newsTitle="The Washington Post"
              newsSource="the-washington-post"
            />
          </div>
          <div className="w-1/3 ">
            <NewsList
              newsData={data["wsj"]}
              newsTitle="The Wall Street Journal"
              newsSource="wsj"
            />
          </div>
          <div className="w-1/3 ">
            <NewsList
              newsData={data["fox-news"]}
              newsTitle="Fox News"
              newsSource="fox-news"
            />
          </div>
        </div>
      )}
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
