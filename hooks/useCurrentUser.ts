import { useQuery } from "@tanstack/react-query";
import apiRouter from "@/api/router";

export const currentUserQueryKey = ["currentUser"] as const;

export const useCurrentUser = () => {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: apiRouter.auth.getCurrentUser,
    retry: false,
  });
};
