import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {SendHorizontal} from "lucide-react"
export function InputField(){
    return( <div className=" text-black  px-2 py-3 fixed left-0 right-0 bottom-0 flex gap-3 focus:outline-none justify-center items-center">
        <Input className="" placeholder="Enter text"/>
          <div className="bg-[rgba(25,195,125)] text-white  aspect-square p-0 top-0 flex justify-center items-center px-2 rounded-sm">
           <SendHorizontal size={24}  />
          </div>
    </div>)
}