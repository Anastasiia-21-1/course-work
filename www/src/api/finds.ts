import {useMutation, useQuery} from "urql";
import {
    AddFind,
    AddFindMutation,
    AddFindMutationVariables,
    GetFinds,
    GetFindsQuery,
    GetFindsQueryVariables,
    GetFindsWithUsers,
    GetFindsWithUsersQuery,
    GetFindsWithUsersQueryVariables,
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

export function useInsertFind() {
    const [, mutate] = useMutation<AddFindMutation, AddFindMutationVariables>(AddFind)

    return mutate
}
