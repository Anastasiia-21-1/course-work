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
    GetUserFinds,
    GetUserFindsQuery,
    GetUserFindsQueryVariables,
} from "../../generated/graphql";

export function useGetFinds() {
    return useQuery<GetFindsQuery, GetFindsQueryVariables>({
        query: GetFinds
    })[0]
}

export function useGetFindsByUser(id: string) {
    return useQuery<GetUserFindsQuery, GetUserFindsQueryVariables>({
        query: GetUserFinds,
        variables: {userId: id}
    })[0]
}

export function useGetFindsWithUsers() {
    return useQuery<GetFindsWithUsersQuery, GetFindsWithUsersQueryVariables>({
        query: GetFindsWithUsers
    })[0]
}

export function useInsertFind() {
    return useMutation<AddFindMutation, AddFindMutationVariables>(AddFind)[1]
}
