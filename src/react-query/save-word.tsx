import { AddWordToListCredentials } from "@/lib/validators/add-word-to-list";
import { useRefetchStore } from "@/states/refetch";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export default function SaveWord() {
  const { setRefetch } = useRefetchStore();

  return useMutation({
    mutationFn: async ({ ...fields }: AddWordToListCredentials) => {
      const { data } = await axios.post(`/api/words`, { ...fields });
      return data;
    },
    onSuccess: () => {
      toast.success("Successfully added a word");
      setRefetch(true);
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
