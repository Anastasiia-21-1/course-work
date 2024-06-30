import {useQuery} from "urql";
import {GetUsers, GetUsersQuery, GetUsersQueryVariables} from "../../generated/graphql";

export function useGetUsers() {
    const [result] = useQuery<GetUsersQuery, GetUsersQueryVariables>({
        query: GetUsers
    })

    return result
}

