import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface ChatBubbleProps {
    message: string;
    isSent: boolean;
    from: 'left' | 'right';
  }
  
  const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isSent, from }) => {
    const bubbleStyle = isSent ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black';
    const positionStyle = from === 'left' ? 'self-start' : 'self-end';
  
    return (
      <div className={`p-3 rounded-lg max-w-xs break-words my-2 ${bubbleStyle} ${positionStyle}`}>
        {message}
      </div>
    );
  };
const Conversation = () => {
  return (
    <>
    <div>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
    <div className="flex flex-col">
    <ChatBubble message="Hellw are you?" isSent={true}  from="left"/>
    <ChatBubble message="Hello, how are you?" isSent={false}  from="right"/>
    </div>
    </>
  );
};

export default Conversation;
