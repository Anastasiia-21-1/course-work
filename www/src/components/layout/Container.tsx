import {PropsWithChildren} from "react";

interface Props extends PropsWithChildren {}

export function Container({children}: Props) {
    return (
        <div className="pt-12 px-4 max-w-screen-lg mx-auto sm:px-6 lg:px-8">
            {children}
        </div>
    )
}
