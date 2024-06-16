import {client} from "@/utils/client";
import {GetUsers, GetUsersQuery, GetUsersQueryVariables} from "../../generated/graphql";

export default async function Home() {

    const {data} = await client.query<GetUsersQuery, GetUsersQueryVariables>(GetUsers).toPromise()


    return (
        <div>
            App
            {JSON.stringify(data)}
        </div>
    );
}
