import {useMutation, useQuery} from "urql";
import {
    AddCategory,
    AddCategoryMutationVariables,
    GetCategories,
    GetCategoriesQuery,
    GetCategoriesQueryVariables
} from "../../generated/graphql";

export function useGetCategories() {
    const [result] = useQuery<GetCategoriesQuery, GetCategoriesQueryVariables>({
        query: GetCategories
    })

    return result
}

export function useInsertCategory() {
    const [, mutate] = useMutation<AddCategoryMutationVariables>(AddCategory)

    return mutate
}
