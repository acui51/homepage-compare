import { Button } from "antd";
import { Fragment, useState } from "react";
import { UpOutlined } from "@ant-design/icons";
import classnames from "classnames";
import type {
  HomepageDateData,
  HomepageNewsRow,
} from "../hooks/useHomepageNews";
import Image from "next/image";
import WapoLogo from "../../public/wapo_logo.png";
import WSJLogo from "../../public/wsj_logo.png";
import FoxNewsLogo from "../../public/fox_news_logo.svg";
import NewsPreview from "./NewsPreview";

const PUBLIC_STORAGE_URL =
  "https://nvpoxnhyhnoxikpasiwv.supabase.co/storage/v1/object/public/washington-post-screenshots";

type NewsStackProps = {
  /**
   * TODO: type
   * array of news articles
   */
  newsHour: HomepageNewsRow[];

  /**
   * on click handler for article title
   */
  onArticleClick: (value: string) => void;

  /**
   * when article was scraped
   */
  createdAt: string;

  /**
   * source id of news website scraped from
   */
  newsSource: string;
};

const NewsStack = ({
  newsHour,
  onArticleClick,
  createdAt,
  newsSource,
}: NewsStackProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Fragment>
      {newsHour
        .slice(0, isExpanded ? newsHour.length : 3)
        .map((news: any, index: number) => {
          return (
            <div
              className={classnames(
                "mb-3 max-h-96 overflow-hidden p-2 rounded-md border-2 bg-white border-gray-500 hover:border-[#1677ff]",
                { "grayscale hover:grayscale-0": !isExpanded }
              )}
              key={news.id}
              style={
                !isExpanded
                  ? {
                      position: `${index > 0 ? "absolute" : "static"}`,
                      top: `${24 + 5 * index}px`,
                      left: `${12 + 5 * index}px`,
                      zIndex: `${-index}`,
                    }
                  : {}
              }
              onClick={handleOnClick}
            >
              <div
                className="cursor-pointer font-bold hover:underline"
                onClick={(event) => {
                  event.stopPropagation();
                  onArticleClick(news.title);
                }}
              >
                {news.title.toUpperCase()}
              </div>
              <div className="text-gray-400 text-sm">{createdAt} EST</div>
              <img
                src={`${PUBLIC_STORAGE_URL}/${newsSource}/${news.id}.jpeg`}
              />
            </div>
          );
        })}
      {isExpanded && (
        <Button
          className="flex items-center"
          onClick={() => setIsExpanded(false)}
        >
          <UpOutlined /> Close
        </Button>
      )}
    </Fragment>
  );

  function handleOnClick() {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  }
};

type NewsListProps = {
  /**
   * News data
   */
  newsData: HomepageDateData;

  /**
   * title of news source
   */
  newsTitle: string;

  /**
   * source id of news source
   */
  newsSource: string;

  /**
   * data for radar preview
   */
  radarData: any;

  /**
   * setter function for updating the search value
   */
  onArticleClick: (value: string) => void;
};

const NewsList = ({
  newsData,
  newsTitle,
  newsSource,
  radarData,
  onArticleClick,
}: NewsListProps) => {
  return (
    <Fragment>
      <Image
        alt={newsTitle}
        src={getNewsTitleMedia(newsSource)}
        className="object-contain h-24 container mx-auto w-2/3"
      />
      {radarData?.length >= 10 && <NewsPreview radarData={radarData} />}
      {newsData ? (
        Object.keys(newsData).map((date: any, index: number) => {
          const createdAt = new Date(date).toLocaleDateString("en-us", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            timeZone: "EST",
          });

          return (
            <div className="relative mb-12 cursor-pointer" key={index}>
              <div className="text-gray-500">{createdAt} EST</div>
              <NewsStack
                newsHour={newsData[date]}
                createdAt={createdAt}
                newsSource={newsSource}
                onArticleClick={onArticleClick}
              />
            </div>
          );
        })
      ) : (
        <div>No results found...</div>
      )}
    </Fragment>
  );

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
};

export default NewsList;
