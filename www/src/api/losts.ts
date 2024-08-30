import {useMutation, useQuery} from "urql";
import {
    AddLost,
    AddLostMutation,
    AddLostMutationVariables,
    GetLostById,
    GetLostByIdQuery,
    GetLostByIdQueryVariables,
    GetLosts,
    GetLostsQuery,
    GetLostsQueryVariables,
    GetLostsWithUsers,
    GetLostsWithUsersQuery,
    GetLostsWithUsersQueryVariables,
    GetUserLosts,
    GetUserLostsQuery,
    GetUserLostsQueryVariables,
} from "../../generated/graphql";

export function useGetLosts() {
    return useQuery<GetLostsQuery, GetLostsQueryVariables>({
        query: GetLosts
    })[0]
}

export function useGetLostById(id: string) {
    return useQuery<GetLostByIdQuery, GetLostByIdQueryVariables>({
        query: GetLostById,
        variables: {id}
    })[0]
}

export function useGetLostsWithUsers() {
    return useQuery<GetLostsWithUsersQuery, GetLostsWithUsersQueryVariables>({
        query: GetLostsWithUsers
    })[0]
}

export function useGetLostsByUser(id: string) {
    return useQuery<GetUserLostsQuery, GetUserLostsQueryVariables>({
        query: GetUserLosts,
        variables: {userId: id}
    })[0]
}

export function useInsertLost() {
    return useMutation<AddLostMutation, AddLostMutationVariables>(AddLost)[1]
}
