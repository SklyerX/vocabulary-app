import { Check, Loader2, MoreVertical, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import DeleteWord from "@/react-query/delete-word";

interface Props {
  onChange: () => void;
  id: string;
}

export default function HandleWord({ onChange, id }: Props) {
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const { mutate, isPending } = DeleteWord();

  return (
    <DropdownMenu
      open={isOpened}
      onOpenChange={(e) => {
        if (!e) setIsDeleteMode(false);
        setIsOpened(e);
      }}
    >
      <DropdownMenuTrigger>
        <MoreVertical className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          disabled={isPending}
          onSelect={(e) => {
            e.preventDefault();
            setIsDeleteMode(true);
          }}
        >
          {isDeleteMode ? (
            <div className="flex w-full items-center justify-between">
              Sure?
              <div className="flex gap-1">
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </>
                ) : (
                  <>
                    <button onClick={() => mutate({ id })}>
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsDeleteMode(false);
                        setIsOpened(false);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <>Remove Word</>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
