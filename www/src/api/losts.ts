import {useQuery} from "urql";
import {
    GetLosts,
    GetLostsQuery,
    GetLostsQueryVariables, GetLostsWithUsers, GetLostsWithUsersQuery, GetLostsWithUsersQueryVariables,
} from "../../generated/graphql";

export function useGetLosts() {
    const [result] = useQuery<GetLostsQuery, GetLostsQueryVariables>({
        query: GetLosts
    })

    return result
}

export function useGetLostsWithUsers() {
    const [result] = useQuery<GetLostsWithUsersQuery, GetLostsWithUsersQueryVariables>({
        query: GetLostsWithUsers
    })

    return result
}
