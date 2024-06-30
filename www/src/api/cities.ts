import {useQuery} from "urql";
import {GetCities, GetCitiesQuery, GetCitiesQueryVariables} from "../../generated/graphql";

export function useGetCities() {
    const [result] = useQuery<GetCitiesQuery, GetCitiesQueryVariables>({
        query: GetCities
    })

    return result
}
