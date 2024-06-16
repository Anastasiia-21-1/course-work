import {
    cacheExchange,
    dedupExchange,
    errorExchange,
    ExchangeInput,
    fetchExchange,
    subscriptionExchange,
} from "@urql/core";
import {createClient as createWSClient} from "graphql-ws";
import {createClient, ExchangeIO} from "urql";

const isServerSide = typeof window === "undefined";

const wsClient = () =>
    createWSClient({
        url: (process.env.NEXT_PUBLIC_HASURA_PROJECT_ENDPOINT as string).replace(
            "http",
            "ws"
        ),
        connectionParams: async () => {
            const token = ""
            return isServerSide
                ? {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
                : {};
        },
    });

const noopExchange = ({ forward }: ExchangeInput): ExchangeIO => {
    return (operations$) => forward(operations$);
};

const subscribeOrNoopExchange = () =>
    isServerSide
        ? noopExchange
        : subscriptionExchange({
            forwardSubscription: (operation) => {
                return {
                    subscribe: (sink) => ({
                        unsubscribe: wsClient().subscribe(operation, sink),
                    }),
                };
            },
        });

const clientConfig = {
    url: process.env.NEXT_PUBLIC_HASURA_PROJECT_ENDPOINT!,
    fetchOptions: () => {
        // const token = () => useStore.getState().user.token;
        const token = "123"

        return !isServerSide && token
            ? {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            : {};
    },
    exchanges: [
        dedupExchange,
        cacheExchange,
        errorExchange({
            onError: (error) => {
                const isAuthError = error.graphQLErrors.some((e) => {
                    return e.extensions?.code === "validation-failed";
                });
                // if (isAuthError) {
                //     logout();
                // }
            },
        }),
        fetchExchange,
        subscribeOrNoopExchange(),
    ],
};

export const client = createClient(clientConfig);
