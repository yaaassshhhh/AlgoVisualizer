import { BsFillPauseCircleFill, BsFillPlayFill } from "react-icons/bs";
import { twMerge } from "tailwind-merge";

const PlayPauseBtn = ({
  onClick,
  isPlaying,
}: {
  onClick: () => void;
  isPlaying: boolean;
}) => {
  return (
    <button
      className={twMerge(
        "transition ease-in flex items-center justify-center h-8 w-8 rounded-full shadow-md",
        isPlaying
          ? "bg-gray-700 hover:bg-gray-800"
          : "bg-green-500 hover:bg-green-700"
      )}
      onClick={onClick}
    >
      {isPlaying ? (
        <BsFillPauseCircleFill className="h-6 w-6" />
      ) : (
        <BsFillPlayFill className="h-6 w-6" />
      )}
    </button>
  );
};

export default PlayPauseBtn;
