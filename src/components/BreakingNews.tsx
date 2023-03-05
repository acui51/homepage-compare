import { useState, memo } from "react";
import { useSpring, animated } from "react-spring";

type Props = {
  news: any;

  onClick: (value: string) => void;
};

const BreakingNews = ({ news, onClick }: Props) => {
  const [key, setKey] = useState(1);

  const scrolling = useSpring({
    from: { transform: "translate(60%,0)" },
    to: { transform: "translate(-550%,0)" },
    config: { duration: 120 * 1000 },
    reset: true,
    onRest: () => {
      setKey(key + 1);
    },
    loop: true,
  });

  const splitNews = news.choices[0].message.content.trim().split("\n");
  return (
    <div className="bg-[#FFF1EF] text-red-500 w-screen py-2 truncate" key={key}>
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
            >
              <span key={index} className="text-sm pr-2">
                {strippedTitle}
              </span>
              {index !== splitNews.length - 1 && <span>|</span>}
            </span>
          );
        })}
      </animated.div>
    </div>
  );
};

export default memo(BreakingNews);
