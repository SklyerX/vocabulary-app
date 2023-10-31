import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import SearchDictionary from "@/react-query/search-dictionary";
import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { Input } from "../ui/input";
import AddWordToListModel from "./AddWordToList";

export default function NewWordModel() {
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce<string>(value, 1000);

  const { mutate, isPending, isSuccess, data, reset } = SearchDictionary();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const wipe_data = () => {
    reset();
    setValue("");
  };

  useEffect(() => {
    if (debouncedValue !== "") {
      mutate({ word: value });
    }
  }, [debouncedValue]);

  return (
    <Dialog onOpenChange={wipe_data}>
      <DialogTrigger>
        <Plus className="w-4 h-4" />
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[800px] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Add a new word</DialogTitle>
          <DialogDescription>
            You can also search up the definition of a word (you do not need to
            save it)
          </DialogDescription>
        </DialogHeader>
        <div>
          <Input onChange={handleChange} />
          {data
            ? Array.isArray(data) &&
              data.map((diction: any, index: number) => (
                <div className="flex flex-col mt-3" key={index}>
                  <strong className="mt-2">Pronunciation(s)</strong>
                  {diction.phonetics.length !== 0 &&
                    diction.phonetics
                      .filter((phonetic: any) => phonetic.audio !== "")
                      .map((phonetic: any, index: number) => (
                        <audio
                          controls
                          className="mt-1"
                          src={phonetic.audio}
                          key={index}
                        ></audio>
                      ))}
                  {diction.meanings.length !== 0 &&
                    diction.meanings.map((meaning: any, index: number) => (
                      <div className="mt-3" key={index}>
                        <strong>{meaning.partOfSpeech}</strong>
                        <div>
                          {meaning.definitions.length !== 0 &&
                            meaning.definitions.map(
                              (definition: any, index: number) => (
                                <div key={index}>{definition.definition}</div>
                              )
                            )}
                        </div>
                      </div>
                    ))}
                </div>
              ))
            : null}
        </div>
        <DialogFooter>
          <AddWordToListModel
            word={value}
            disabled={value.length === 0 || Array.isArray(data) === false}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
