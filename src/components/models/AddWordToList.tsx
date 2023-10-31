import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";

import {
  AddWordToListCredentials,
  AddWordToListValidator,
} from "@/lib/validators/add-word-to-list";
import SaveWord from "@/react-query/save-word";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { useEffect } from "react";

interface Props {
  word: string;
  disabled: boolean;
}

// TODO: EMIT AN EVENT TO REFETCH DATA

export default function AddWordToListModel({ word, disabled }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddWordToListCredentials>({
    resolver: zodResolver(AddWordToListValidator),
    defaultValues: {
      word: word,
    },
  });

  useEffect(() => {
    if (word !== "") {
      setValue("word", word);
    }
  }, [word]);

  const { mutate, isPending } = SaveWord();

  return (
    <Dialog>
      <DialogTrigger>
        <Button disabled={disabled}>Add word</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add <strong>{word}</strong> to list
          </DialogTitle>
          <DialogDescription>
            Fill in the information below and save your word to the database!
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-1"
          onSubmit={handleSubmit((data) => mutate(data))}
        >
          <div className="space-y-1">
            <span className="text-xs">Word</span>
            <Input {...register("word")} />
            {errors.word && (
              <span className="text-xs text-red-500">
                {errors.word.message}
              </span>
            )}
          </div>
          <div className="space-y-1">
            <span className="text-xs">Description</span>
            <Input {...register("customDescription")} />
            {errors.customDescription && (
              <span className="text-xs text-red-500">
                {errors.customDescription.message}
              </span>
            )}
          </div>
          <div className="space-y-1">
            <span className="text-xs">Found</span>
            <Input {...register("found")} />
            {errors.found && (
              <span className="text-xs text-red-500">
                {errors.found.message}
              </span>
            )}
          </div>
          <DialogFooter className="!mt-4">
            <Button isLoading={isPending} type="submit">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
