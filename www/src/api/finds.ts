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
    GetFindsWithUsersQueryVariables, GetUserFinds, GetUserFindsQuery, GetUserFindsQueryVariables,
} from "../../generated/graphql";

export function useGetFinds() {
    const [result] = useQuery<GetFindsQuery, GetFindsQueryVariables>({
        query: GetFinds
    })

    return result
}

export function useGetFindsByUser(id: string) {
    const [result] = useQuery<GetUserFindsQuery, GetUserFindsQueryVariables>({
        query: GetUserFinds,
        variables: {userId: id}
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
