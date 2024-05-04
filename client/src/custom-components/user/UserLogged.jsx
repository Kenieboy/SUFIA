// shadcn components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function UserLogged() {
  return (
    <div className="flex items-center justify-center gap-2">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-[10px]">
          Hi <span className="font-bold">Ken,</span> Good morning!
        </p>
      </div>
    </div>
  );
}

export default UserLogged;
