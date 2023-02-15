import { Fragment } from "react";

type Props = {
  /**
   * TODO: update with gen types
   */
  newsData: any | undefined;

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

const PUBLIC_STORAGE_URL =
  "https://nvpoxnhyhnoxikpasiwv.supabase.co/storage/v1/object/public/washington-post-screenshots";

const dateFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "short",
  day: "numeric",
};

const NewsList = ({
  newsData,
  newsTitle,
  newsSource,
  onArticleClick,
}: Props) => {
  return (
    <Fragment>
      <h3 className="font-bold mb-8">{newsTitle}</h3>
      {/* TODO: type news  */}
      {newsData?.map((news: any) => {
        const createdAt = new Date(news.created_at).toLocaleDateString(
          "en-us",
          {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            timeZone: "EST",
          }
        );

        return (
          <div className="mb-3" key={news.id}>
            <div
              className="underline cursor-pointer"
              onClick={() => onArticleClick(news.title)}
            >
              {news.title}
            </div>
            <div className="text-gray-400">{createdAt} EST</div>
            <img src={`${PUBLIC_STORAGE_URL}/${newsSource}/${news.id}.jpeg`} />
          </div>
        );
      })}
    </Fragment>
  );
};

export default NewsList;
