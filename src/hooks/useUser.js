import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { getUserDetails } from "../api";

const useUser = () => {
  const { data, isLoading, isError, refetch } = useQuery(
    "user",
    async () => {
      try {
        const userDetails = await getUserDetails();
        return userDetails;
      } catch (err) {
        if (!err.message.includes("not authenticated")) {
          toast.err("Something went wrong......");
        }
      }
    },
    { refetchOnWindowFocus: false }
  );

  return { data, isLoading, isError, refetch };
};

export default useUser;
