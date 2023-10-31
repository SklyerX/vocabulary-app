import { AddWordToListCredentials } from "@/lib/validators/add-word-to-list";
import { useRefetchStore } from "@/states/refetch";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export default function DeleteWord() {
  const { setRefetch } = useRefetchStore();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { data } = await axios.delete(`/api/words/${id}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Successfully deleted word");
      setRefetch(true);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 404)
          return toast.error(
            "This world has already been deleted or does not exist"
          );

        if (err.response && typeof err.response.data === "string")
          return toast.error(err.response.data);

        return toast.error("Something went wrong while deleting the word!");
      }

      toast.error(
        "Something went wrong while deleting the word! Please try again later."
      );
    },
  });
}
