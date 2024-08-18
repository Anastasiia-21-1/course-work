import {useMutation, useQuery,} from "urql";
import {
    GetUserById,
    GetUserByIdQuery,
    GetUserByIdQueryVariables,
    GetUsers,
    GetUsersQuery,
    GetUsersQueryVariables,
    UpdateUser,
    UpdateUserMutation,
    UpdateUserMutationVariables
} from "../../generated/graphql";
import {client} from "@/utils/client";

export function useGetUsers() {
    return useQuery<GetUsersQuery, GetUsersQueryVariables>({
        query: GetUsers
    })[0]
}

export function useGetUserById(id: string) {
    return useQuery<GetUserByIdQuery, GetUserByIdQueryVariables>({
        query: GetUserById,
        variables: {userId: id}
    })[0]
}

export function getUserByIdRequest(id: string) {
    return client.query(GetUserById, {userId: id}).toPromise()
}

export function useUpdateUser() {
    return useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUser)[1]
}
