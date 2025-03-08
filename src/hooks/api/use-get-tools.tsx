import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllToolsQueryFn } from "@/lib/api";
import { AllToolsPayloadType } from "@/types/api.type";

const useGetToolsQuery = ({
  pageSize = 10,
  pageNumber = 1,
  keyword = "",
  department = "",
  skip = false,
}: AllToolsPayloadType) => {
  const query = useQuery({
    queryKey: ["tools", pageNumber, pageSize, keyword, department],
    queryFn: () =>
      getAllToolsQueryFn({
        pageSize,
        pageNumber,
        keyword,
        department,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: skip ? undefined : keepPreviousData,
    enabled: !skip,
  })

  return query
}

export default useGetToolsQuery;
