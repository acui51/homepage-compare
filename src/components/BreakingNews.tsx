import { useState } from "react";
import { useSpring, animated } from "react-spring";

type Props = {
  news: any;
};

const BreakingNews = ({ news }: Props) => {
  const [key, setKey] = useState(1);

  const scrolling = useSpring({
    from: { transform: "translate(60%,0)" },
    to: { transform: "translate(-100%,0)" },
    config: { duration: 60 * 1000 },
    reset: true,
    onRest: () => {
      setKey(key + 1);
    },
    loop: true,
  });

  return (
    <div className="bg-[#FFF1EF] text-red-500 w-screen py-2 truncate" key={key}>
      <animated.div style={scrolling}>
        {news.map((article: any, index: number) => {
          return (
            <span key={index} className="text-sm">
              {article.title} |{" "}
            </span>
          );
        })}
      </animated.div>
    </div>
  );
};

export default BreakingNews;
