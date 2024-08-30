import {PropsWithChildren} from "react";
import {Text} from "@mantine/core";

interface Props extends PropsWithChildren {
    title?: string | null
}

export function AppContainer({children, title}: Props) {
    return (
        <div className="p-4 max-w-screen-lg mx-auto sm:px-6 lg:px-8">
            {title && (
                <Text size='xl' className="font-medium bg-blue-400 text-white px-8 w-max rounded-full mb-5">{title}</Text>
            )}
            {children}
        </div>
    )
}
