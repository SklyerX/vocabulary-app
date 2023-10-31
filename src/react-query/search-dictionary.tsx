import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export default function SearchDictionary() {
  return useMutation({
    mutationFn: async ({ word }: { word: string }) => {
      const { data } = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404) return toast.error("Invalid word");

        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while fetching word!");
      }

      toast.error(
        "Something went wrong while fetching word! Please try again later."
      );
    },
  });
}
