import {PropsWithChildren} from "react";

interface Props extends PropsWithChildren {}

export function ItemsContainer({children}: Props) {
    return (
        <div className="flex justify-center flex-wrap gap-5">
            {children}
        </div>
    )
}
