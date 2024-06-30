import {useQuery} from "urql";
import {
    GetFinds,
    GetFindsQuery,
    GetFindsQueryVariables, GetFindsWithUsers, GetFindsWithUsersQuery, GetFindsWithUsersQueryVariables,
} from "../../generated/graphql";

export function useGetFinds() {
    const [result] = useQuery<GetFindsQuery, GetFindsQueryVariables>({
        query: GetFinds
    })

    return result
}

export function useGetFindsWithUsers() {
    const [result] = useQuery<GetFindsWithUsersQuery, GetFindsWithUsersQueryVariables>({
        query: GetFindsWithUsers
    })

    return result
}
