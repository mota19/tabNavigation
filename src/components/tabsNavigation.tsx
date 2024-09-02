import TabItem from "./tabItem";
import { tabItemObj } from "./typesTabNavigation";
import DashboarImg from "../pictures/fi-rs-apps.png";
import BankImg from "../pictures/fi-rs-bank.png";
import BrowserImg from "../pictures/fi-rs-browser.png";
import CubeImg from "../pictures/fi-rs-cube.png";
import ListIng from "../pictures/fi-rs-list.png";
import PhoneCallimg from "../pictures/fi-rs-phone-call.png";
import ShoppingCartImg from "../pictures/fi-rs-shopping-cart-check.png";
import SettingImg from "../pictures/fi-rs-settings.png";
import ChartPieImg from "../pictures/fi-rs-chart-pie.png";
import AccountImg from "../pictures/fi-rs-user-add.png";
import HelpImg from "../pictures/fi-rs-book-alt.png";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";

import { useState } from "react";
import {
  DndContext,
  useDroppable,
  DragEndEvent,
  closestCorners,
} from "@dnd-kit/core";

const tabItems: tabItemObj[] = [
  { id: 1, name: "Dashboard", image: DashboarImg, isPinned: false },
  { id: 2, name: "Banking", image: BankImg, isPinned: false },
  { id: 3, name: "Telefonie", image: PhoneCallimg, isPinned: false },
  { id: 4, name: "Accounting", image: AccountImg, isPinned: false },
  { id: 5, name: "Verkouf", image: ShoppingCartImg, isPinned: false },
  { id: 6, name: "Statistik", image: ChartPieImg, isPinned: false },
  { id: 7, name: "Post Office", image: CubeImg, isPinned: false },
  { id: 8, name: "Administration", image: SettingImg, isPinned: false },
  { id: 9, name: "Help", image: HelpImg, isPinned: false },
  { id: 10, name: "Auswahllisten", image: ListIng, isPinned: false },
  { id: 11, name: "Rechn", image: BrowserImg, isPinned: false },
];

const TabsNavigation: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [items, setItems] = useState(tabItems);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const toNumber = (id: string | number): number => {
    return typeof id === "number" ? id : parseInt(id, 10);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log(event);
    console.log("Active:", active);
    console.log("Over:", over);

    if (!over) {
      console.log("No valid drop target detected.");
      return;
    }

    const activeId = toNumber(active.id);
    const overId = toNumber(over.id);

    if (activeId === overId) return; // Ensure we're not moving to the same spot

    const oldIndex = items.findIndex((item) => item.id === activeId);
    const newIndex = items.findIndex((item) => item.id === overId);

    if (oldIndex === -1 || newIndex === -1) return; // Ensure indexes are valid

    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(oldIndex, 1);
    updatedItems.splice(newIndex, 0, movedItem);

    setItems(updatedItems);
  };

  const { setNodeRef } = useDroppable({
    id: "droppable-container", // Unique ID for the droppable area
  });

  return (
    <div className="grid grid-cols-[90px_1fr] grid-rows-[70px_50px_1fr] h-screen w-full">
      <div className="col-span-1 row-span-3 bg-white"></div>
      <div className="col-span-1 row-span-1 bg-white border-solid border-l-[1px] border-b-[1px] border-[#AEB6CE33]"></div>
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div
          ref={setNodeRef}
          className="col-span-1 row-span-1 flex bg-white border-2 border-solid border-gray-400"
        >
          <SortableContext
            items={items}
            strategy={horizontalListSortingStrategy}
          >
            {items.map((item, index) => (
              <TabItem
                key={item.id}
                id={item.id}
                name={item.name}
                image={item.image}
                className={
                  activeIndex === index
                    ? "bg-[#F1F5F8] border-[#4690E2] border-t-[2px] text-black"
                    : "hover:bg-slate-50"
                }
                handleClick={() => handleClick(index)}
                isPinned={item.isPinned}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
      <div className="col-span-1 row-span-1 bg-white m-4"></div>
    </div>
  );
};

export default TabsNavigation;
