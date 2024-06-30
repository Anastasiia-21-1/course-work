import {Button} from "@mantine/core";
import Link from "next/link";

export default async function HomePage() {
    return (
        <div>
            <Button component={Link} href="/lost">
                Знайти втрату
            </Button>
            <Button component={Link} href="/find">
                Заявити про знахідку
            </Button>
        </div>
    );
}
