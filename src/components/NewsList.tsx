import { Button } from "antd";
import { Fragment, useState } from "react";
import { UpOutlined } from "@ant-design/icons";
import classnames from "classnames";
import type { HomepageNewsRow } from "../hooks/useHomepageNews";
import NewsPreview from "./NewsPreview";

const PUBLIC_STORAGE_URL =
  "https://nvpoxnhyhnoxikpasiwv.supabase.co/storage/v1/object/public/washington-post-screenshots";

type NewsStackProps = {
  /**
   * TODO: type
   * array of news articles
   */
  articles: HomepageNewsRow[];

  /**
   * on click handler for article title
   */
  onArticleClick: (value: string) => void;

  /**
   * source id of news website scraped from
   */
  newsSource: string;
};

const NewsStack = ({
  articles,
  onArticleClick,
  newsSource,
}: NewsStackProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Fragment>
      {articles
        .slice(0, isExpanded ? articles.length : 3)
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
                      top: `${+3 * index}px`,
                      left: `${2 + 3 * index}px`,
                      right: `-${2 + 3 * index}px`,
                      zIndex: `${-index}`,
                    }
                  : {}
              }
              onClick={handleOnClick}
            >
              <div
                className="line-clamp-2 cursor-pointer font-bold hover:underline mb-2"
                onClick={(event) => {
                  event.stopPropagation();
                  onArticleClick(news.title);
                }}
              >
                {news.title}
              </div>
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
  newsData: HomepageNewsRow[];

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
  newsSource,
  radarData,
  onArticleClick,
}: NewsListProps) => {
  return (
    <Fragment>
      {radarData?.length >= 10 && <NewsPreview radarData={radarData} />}
      {newsData ? (
        <div className="relative mb-12 cursor-pointer">
          <NewsStack
            articles={newsData}
            newsSource={newsSource}
            onArticleClick={onArticleClick}
          />
        </div>
      ) : (
        <div className="flex w-full h-full justify-center">
          No results found...
        </div>
      )}
    </Fragment>
  );
};

export default NewsList;
