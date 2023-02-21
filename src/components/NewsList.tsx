import { Button } from "antd";
import { Fragment, useState } from "react";
import { UpOutlined } from "@ant-design/icons";
import classnames from "classnames";
import type {
  HomepageDateData,
  HomepageNewsRow,
} from "../hooks/useHomepageNews";

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

  /**
   * URL address of wordmark logo for news source
   */
  newsTitleMedia: string;
};

const NewsStack = ({
  newsHour,
  onArticleClick,
  createdAt,
  newsSource,
}: NewsStackProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  console.log("newsHour", newsHour);

  return (
    <Fragment>
      {newsHour
        .slice(0, isExpanded ? newsHour.length : 3)
        .map((news: any, index: number) => {
          return (
            <div
              className={classnames(
                "mb-3 max-h-96 overflow-hidden p-2 rounded-md border-2 bg-white border-gray-500",
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
   * URL address of wordmark logo for news source
   */
  newsTitleMedia: string;

  /**
   * title of news source
   */
  newsTitle: string;

  /**
   * source id of news source
   */
  newsSource: string;

  /**
   * setter function for updating the search value
   */
  onArticleClick: (value: string) => void;
};

const NewsList = ({
  newsData,
  newsTitle,
  newsTitleMedia,
  newsSource,
  onArticleClick,
}: NewsListProps) => {
  return (
    <Fragment>
      <img
        alt={newsTitle}
        src={newsTitleMedia}
        className="object-contain h-24 container mx-auto"
      />
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
                newsTitleMedia={newsTitleMedia}
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
};

export default NewsList;
