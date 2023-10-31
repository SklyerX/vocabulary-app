"use client";

import { Session } from "next-auth";
import { Toaster, toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRefetchStore } from "@/states/refetch";
import { useWordsStore } from "@/states/words";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Ghost, Search, Sliders } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import HandleWord from "./HandleWord";
import UserDropdown from "./UserDropdown";
import NewWordModel from "./models/NewWord";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import clsx from "clsx";

interface Props {
  session: Session;
}

type SearchByOptions = "word" | "description" | "found";

interface ISearch {
  by: SearchByOptions;
  query: string;
}

const getData = async (page: number, increment = true) => {
  const { data } = await axios.get(
    `/api/words?page=${page + (increment ? 1 : 0)}&per_page=200`
  );
  return data;
};

export default function DashboardPage({ session }: Props) {
  const [page, setPage] = useState<number>(0);
  const { words, setWords } = useWordsStore();
  const { refetch: refetchData, setRefetch } = useRefetchStore();

  const [search, setSearch] = useState<ISearch>({
    by: "word",
    query: "",
  });

  const {
    isPending,
    isError,
    error: err,
    isSuccess,
    data,
    refetch,
  } = useQuery({
    queryKey: ["words"],
    queryFn: async () => {
      setPage(page + 1);
      const data = await getData(page, true);
      return data;
    },
  });

  const filteredWords = useMemo(() => {
    return words?.filter((item) => {
      return item[search.by]
        ?.toLowerCase()
        .includes(search.query.toLowerCase());
    });
  }, [words, search.query]);

  useEffect(() => {
    if (isSuccess) {
      setWords(data?.words);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (refetchData) {
      getData(1, false).then(async (res) => {
        setWords([...res.words]);
      });
      setRefetch(false);
    }
  }, [refetchData]);

  useEffect(() => {
    const handleError = () => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) return toast.error("Invalid word");

        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while fetching word!");
      }

      toast.error(
        "Something went wrong while fetching word! Please try again later."
      );
    };
    if (isError) handleError();
  }, [isError]);

  const SearchComponent = ({ isMobile }: { isMobile: boolean }) => (
    <div
      className={clsx(
        "relative",
        isMobile ? "md:hidden mt-4" : "hidden md:block"
      )}
    >
      <Input
        className={clsx(isMobile ? "w-full" : "w-96")}
        autoFocus
        value={search.query}
        onChange={({ target }) =>
          setSearch((prev) => ({ ...prev, query: target.value }))
        }
        placeholder={`Search by ${search.by}`}
      />
      <div className="absolute right-2 top-2">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Sliders className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={search.by}
              onValueChange={(e) =>
                setSearch((prev) => ({
                  ...prev,
                  by: e as SearchByOptions,
                }))
              }
            >
              <DropdownMenuRadioItem value="word">Word</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="description">
                Description
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="found">Found</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="p-5">
      <Toaster />
      <div className="flex flex-row items-center justify-between">
        <div className="md:hidden flex gap-2">
          <Sheet>
            <SheetTrigger>
              <Search className="w-4 h-4" />
            </SheetTrigger>
            <SheetContent className="min-h-[150px]" side="bottom">
              <SearchComponent isMobile={true} />
            </SheetContent>
          </Sheet>
          <NewWordModel />
        </div>
        <div className="relative hidden md:flex items-center gap-2">
          <SearchComponent isMobile={false} />
          <NewWordModel />
        </div>
        <UserDropdown
          email={session.user?.email}
          image={session.user?.image}
          name={session.user?.name}
        />
      </div>
      <>
        {words?.length !== 0 ? (
          <>
            <Toaster position="bottom-right" />
            <Table className="mt-5">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Word</TableHead>
                  <TableHead>Description (custom)</TableHead>
                  <TableHead>Found</TableHead>
                  <TableHead className="text-right">Options</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWords?.map((word, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{word.word}</TableCell>
                    <TableCell>{word.description}</TableCell>
                    <TableCell>{word.found || "Not Specified"}</TableCell>
                    <TableCell align="right">
                      <HandleWord
                        id={word.id}
                        onChange={() =>
                          refetch().then(async (res) => {
                            setWords([...(words || []), ...res.data?.words]);
                          })
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <div className="w-full h-96 mt-4 rounded-md border border-dashed flex items-center justify-center flex-col">
            <Ghost className="w-6 h-6" />
            <h3 className="text-xl font-medium mt-2">
              Pretty empty around here
            </h3>
            <p className="text-sm">Let's a word to your list!</p>
          </div>
        )}
        {words && !isPending && words?.length !== 0 ? (
          <div className="w-full h-auto my-5 grid place-items-center">
            <Button
              variant="outline"
              isLoading={isPending}
              onClick={() => {
                refetch().then(async (res) => {
                  setWords([...words, ...res.data?.words]);
                });
              }}
              disabled={
                data && (data?.totalPages === page || words?.length === 0)
              }
            >
              Load More
            </Button>
          </div>
        ) : null}
      </>
    </div>
  );
}
