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

import { MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";

import { useState, useEffect, useRef } from "react";
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
  { id: 12, name: "Administration", image: SettingImg, isPinned: false },
  { id: 13, name: "Help", image: HelpImg, isPinned: false },
  { id: 14, name: "Auswahllisten", image: ListIng, isPinned: false },
  { id: 15, name: "Rechn", image: BrowserImg, isPinned: false },
  { id: 16, name: "Administration", image: SettingImg, isPinned: false },
  { id: 17, name: "Help", image: HelpImg, isPinned: false },
  { id: 18, name: "Auswahllisten", image: ListIng, isPinned: false },
  { id: 19, name: "Rechn", image: BrowserImg, isPinned: false },
];

const TabsNavigation: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [items, setItems] = useState<tabItemObj[]>(() => {
    const savedItems = localStorage.getItem("tabItems");
    if (savedItems) {
      return JSON.parse(savedItems);
    }
    return tabItems;
  });
  const [dropdownItems, setDropdownItems] = useState<tabItemObj[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    localStorage.setItem("tabItems", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const savedItems = localStorage.getItem("tabItems");
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }
  }, [items]);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      console.log(containerWidth);
      let totalWidth = 0;
      const visibleItems: tabItemObj[] = [];
      const hiddenItems: tabItemObj[] = [];

      items.forEach((item) => {
        totalWidth += 100; // Припустимо, що ширина кожного елемента 100px
        if (totalWidth > containerWidth) {
          hiddenItems.push(item);
        } else {
          visibleItems.push(item);
        }
      });
      setDropdownItems(hiddenItems);
      setIsDropdownOpen(hiddenItems.length > 0);
    }
  }, [items, containerWidth]);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 5 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 2000, tolerance: 5 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const toNumber = (id: string | number): number => {
    return typeof id === "number" ? id : parseInt(id, 10);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = toNumber(active.id);
    const overId = toNumber(over.id);

    const activeItem = items.find((item) => item.id === activeId);
    const overItem = items.find((item) => item.id === overId);

    if (activeItem?.isPinned || overItem?.isPinned) return;
    if (activeId === overId) return;

    const oldIndex = items.findIndex((item) => item.id === activeId);
    const newIndex = items.findIndex((item) => item.id === overId);

    if (oldIndex === -1 || newIndex === -1) return;
    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(oldIndex, 1);
    updatedItems.splice(newIndex, 0, movedItem);
    setItems(updatedItems);
  };

  const togglePin = (id: number) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === id ? { ...item, isPinned: !item.isPinned } : item
      );
      return updatedItems;
    });
  };

  const { setNodeRef } = useDroppable({ id: "droppable-container" });

  return (
    <div className="grid grid-cols-[90px_1fr] grid-rows-[70px_50px_1fr] h-screen w-screen">
      <div className="col-span-1 row-span-3 bg-white"></div>
      <div className="col-span-1 row-span-1 bg-white border-solid border-l-[1px] border-b-[1px] border-[#AEB6CE33]"></div>
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div
          ref={(node) => {
            setNodeRef(node);
            containerRef.current = node;
          }}
          className="col-span-1 row-span-1 flex bg-white border-2 border-solid border-gray-400 relative w-screen"
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
                togglePin={() => togglePin(item.id)}
              />
            ))}
          </SortableContext>
          <button
            className="absolute bottom-0 right-20 w-[100px] z-10 bg-blue-400"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Open Dropdown
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mr-20 bg-white border border-gray-300 shadow-lg rounded-md ">
              {dropdownItems.map((item) => (
                <div key={item.id} className="p-2 hover:bg-gray-100">
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </DndContext>
      <div className="col-span-1 row-span-1 bg-white m-4"></div>
    </div>
  );
};

export default TabsNavigation;
