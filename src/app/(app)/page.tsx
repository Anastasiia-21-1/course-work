import {Button, Text} from "@mantine/core";
import Link from "next/link";

export default async function HomePage() {
    return (
        <div className="w-full h-[calc(100vh-60px)] flex items-center justify-center">
            <div className="flex flex-col">
                <div>
                    <Text fz="h1" fw="normal" h={50}>
                        Знайшли загублену річ або щось загубили?
                    </Text>
                    <Text fz="h3" fw="normal">
                        Тоді ви в правильному місці
                    </Text>
                </div>
                <div className="flex gap-8 w-full justify-center pt-5">
                    <Button w={300} component={Link} href="/lost">
                        Знайти втрату
                    </Button>
                    <Button w={300} component={Link} href="/find">
                        Заявити про знахідку
                    </Button>
                </div>
            </div>
        </div>
    );
}
