import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Image from "next/image";

interface Props {
  image?: string | null;
  name?: string | null;
  email?: string | null;
}

export default function UserDropdown({ email, image, name }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Image
          src={image || "https://via.placeholder.com/1000"}
          alt="User Profile Picture"
          width={40}
          height={40}
          className="rounded-full"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {name && <p className="font-medium">{name}</p>}
            {email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            signOut({ redirect: true, callbackUrl: "/" });
          }}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
