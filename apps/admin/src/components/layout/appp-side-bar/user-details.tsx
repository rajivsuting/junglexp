import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentUser } from "@clerk/nextjs/server";

const UserDetails = async () => {
  const user = await currentUser();

  if (!user) return null;
  return (
    <>
      <Avatar className="h-8 w-8 rounded-lg grayscale">
        <AvatarImage alt={user.fullName ?? ""} />
        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{user.fullName}</span>
        <span className="text-muted-foreground truncate text-xs">
          {user.emailAddresses[0]!.emailAddress}
        </span>
      </div>
    </>
  );
};

export default UserDetails;
