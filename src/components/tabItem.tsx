import { tabItemObj } from "./typesTabNavigation";
import PinImg from "../pictures/fi-rs-thumbtack.png";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";

interface TabItemProps extends Pick<tabItemObj, "name" | "image" | "isPinned"> {
  className?: string;
  handleClick: () => void;
  togglePin: () => void;
  id: number;
}

const TabItem: React.FC<TabItemProps> = ({
  name,
  image,
  className,
  handleClick,
  togglePin,
  id,
  isPinned,
}) => {
  const [isHover, setIsHovered] = useState<boolean>(false);
  const { attributes, listeners, setNodeRef, transform } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
      className={`relative flex items-center p-4 cursor-pointer ${className} ${
        isPinned ? "bg-[#F1F5F8] text-black" : "text-[#7F858D]"
      }`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={image} alt={name} className="w-[16px] h-[16px] object-cover" />
      <p className="ml-2">{name}</p>
      {isHover && (
        <div
          className="absolute top-full left-10 px-4 bg-white flex items-center justify-center whitespace-nowrap rounded-md shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            togglePin();
          }}
        >
          <img
            src={PinImg}
            alt="Pin"
            className="w-[16px] h-[16px] object-cover"
          />
          <p className="m-2">{isPinned ? "Unpin Tab" : "Pin Tab"}</p>
        </div>
      )}
    </div>
  );
};

export default TabItem;
