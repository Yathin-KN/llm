"use client";
import { Input } from "@/components/ui/input";
import Conversation from "./components/Conversation";
import { InputField } from "./components/input";
import { SendHorizontal, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";

interface ChatBubbleProps {
  message: string;
  isSent: boolean;
  from: "left" | "right";
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isSent, from }) => {
  const bubbleStyle = isSent
    ? "bg-blue-500 text-white"
    : "bg-gray-200 text-black";
  const positionStyle = from === "left" ? "self-start" : "self-end";

  return (
    <div
      className={`p-3 rounded-lg max-w-xs break-words my-2 ${bubbleStyle} ${positionStyle}`}
    >
      {message}
    </div>
  );
};
type check = "left" | "right";
const ChatSkeleton = ({
  bubbleStyle,
  positionStyle,
}: {
  bubbleStyle: boolean;
  positionStyle: check;
}) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Skeleton
      className={`rounded-lg max-w-xs break-words my-2 p-2 ${bubbleStyle} ${positionStyle}`}
    >
      <div className="text-black aspect-square rounded-full w-8 h-8 border-[1.5px] border-blue-500 flex justify-center items-center">
        <p className="text-xs text-blue-900">{timer}</p>
      </div>
    </Skeleton>
  );
};

interface ChatData {
  text: string;
  user: "llm" | "user";
}
const dummyChatData: ChatData[] = [
  // { text: "Hello!", user: "user" },
  // { text: "Hi there!", user: "llm" },
  // { text: "How are you?", user: "user" },
  // { text: "I'm doing well, thanks!", user: "llm" },
  // { text: "What are you up to?", user: "user" },
  // { text: "Just working on a project.", user: "llm" },
  // { text: "That sounds interesting!", user: "user" },
  // { text: "Yes, it's quite exciting.", user: "llm" },
  // { text: "Nice! Best of luck with it.", user: "user" },
];

const Rating = () => {
  const m = [
    { value: 0, status: false },
    { value: 1, status: false },
    { value: 2, status: false },
    { value: 3, status: false },
    { value: 4, status: false },
  ];
  const [rating, setRating] = useState(m);

  const handle = (ind: number) => {
    const updatedRating = rating.map((star, index) => ({
      value: star.value,
      status: index <= ind,
    }));
    setRating(updatedRating);
  };

  return (
    <div className="flex gap-2 p-3">
      {rating.map((star, index) => (
        <Star
          className={`cursor-pointer w-8 h-8  rounded-full ${
            star.status
              ? "fill-yellow-500 stroke-transparent"
              : "fill-white stroke-transparent"
          }`}
          key={index}
          onClick={() => handle(index)}
        ></Star>
      ))}
    </div>
  );
};

export default function Home() {
  const [conversations, setConversation] = useState<ChatData[]>(dummyChatData);
  const [value, setValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSubmit = async () => {
    setValue("")
    setConversation((prev: ChatData[]) => {
        return [
          ...prev,
          {
            text: value,
            user: "user",
          },
        ];
      });
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://5734-2405-201-d006-1123-76e8-86e0-3fdb-b23e.ngrok-free.app/public/chat",
        {
          query: value,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      
      console.log("-", response.data.answer);
      setConversation((prev: ChatData[]) => {
        return [
          ...prev,
          {
            text: response.data.answer.toString().split(`<|user|>`)[0]+"",
            user: "llm",
          },
        ];
      });
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }

    console.log({
      user: "user",
      text: value,
    });
  };

  return (
    <div className="text-white h-screen relative">
      <>
        <div className="flex flex-col  pb-20">
          {conversations?.map((conversation,index) => {
            return (
              <>
                {(conversation.user==="llm") && <div>
                  <Avatar className="justify-center items-center">
                    <AvatarImage src="https://github.com/shadcn.png" className="w-8 h-8 aspect-square rounded-full object-cover"/>
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>}
                <ChatBubble
                  message={conversation.text}
                  isSent={conversation.user === "llm"}
                  from={conversation.user === "llm" ? "left" : "right"}
                />
                {(!isLoading && conversation.user === "llm" && index==(conversations.length-1) ) && <ChatBubble
                  message={"For further inquires contact the number 9880359071"}
                  isSent={conversation.user === "llm"}
                  from={conversation.user === "llm" ? "left" : "right"}
                />}
              </>
            );
          })}
          {isLoading && (
            <ChatSkeleton bubbleStyle={false} positionStyle={"left"} />
          )}
          {(conversations.length && !isLoading) ?<Rating />:<></>}
        </div>
      </>
      <form className=" text-black  px-2 py-3 fixed left-0 right-0 bottom-0 flex gap-3 focus:outline-none justify-center items-center">
        <Input
          className=""
          placeholder="Enter text"
          value={value}
          onChange={(e: any) => setValue(e.target.value)}
        />
        <div
          className="bg-[rgba(25,195,125)] text-white  aspect-square p-0 top-0 flex justify-center items-center px-2 rounded-sm"
          onClick={() => handleSubmit()}
        >
          <SendHorizontal size={24} />
        </div>
      </form>
    </div>
  );
}
