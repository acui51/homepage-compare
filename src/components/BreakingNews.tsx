import { useState, memo, useEffect } from "react";
import { useSpring, animated } from "react-spring";

type Props = {
  news: any;

  onClick: (value: string) => void;
};

const BreakingNews = ({ news, onClick }: Props) => {
  const [key, setKey] = useState(1);
  const [error, setError] = useState("");
  const [splitNews, setSplitNews] = useState([]);

  const scrolling = useSpring({
    from: { transform: "translate(60%,0)" },
    to: { transform: "translate(-300%,0)" },
    config: { duration: 120 * 1000 },
    reset: true,
    onRest: () => {
      setKey(key + 1);
    },
    loop: true,
  });

  useEffect(() => {
    if (Object.keys(news).length === 0) {
      return;
    }
    try {
      setSplitNews(JSON.parse(news.choices[0].message.content));
    } catch (error: any) {
      console.log("error", error);
      setError(error.message);
    }
  }, [news]);

  return (
    <div className="bg-[#FFF1EF] text-red-500 w-screen py-2 truncate" key={key}>
      {error ? (
        <span>Error fetching breaking news</span>
      ) : (
        <animated.div style={scrolling}>
          {splitNews.map((articleTitle: any, index: number) => {
            if (
              articleTitle.length === 0 ||
              articleTitle === "[" ||
              articleTitle === "]"
            ) {
              return null;
            }

            const strippedTitle = articleTitle
              .replaceAll(",", "")
              .replaceAll('"', "")
              .trim();

            return (
              <span
                className="mr-2 cursor-pointer hover:underline"
                onClick={() => onClick(strippedTitle)}
                key={index}
              >
                <span key={index} className="text-sm pr-2">
                  {strippedTitle}
                </span>
                {index !== splitNews.length - 1 && <span>|</span>}
              </span>
            );
          })}
        </animated.div>
      )}
    </div>
  );
};

export default memo(BreakingNews);
