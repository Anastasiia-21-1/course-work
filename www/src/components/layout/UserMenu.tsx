import {Avatar, Divider, Group, Menu, rem, Text, UnstyledButton, useMantineTheme} from "@mantine/core";
import {useState} from "react"
import cx from "clsx";
import classes from "@/style/UserMenu.module.css";
import {IconChevronDown, IconHeart, IconLogout, IconSettings, IconStar} from "@tabler/icons-react";
import {Session} from "next-auth";
import {signOut} from "next-auth/react";
import {useRouter} from "next/navigation";

interface Props {
    session: Session;
}

export function UserMenu({session}: Props) {
    const theme = useMantineTheme();
    const [userMenuOpened, setUserMenuOpened] = useState<boolean>(false);
    const router = useRouter()

    const logoutHandle = async () => {
        await signOut()
    }

    return (
        <Menu
            width={260}
            position="bottom-end"
            transitionProps={{transition: 'pop-top-right'}}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
        >
            <Menu.Target>
                <UnstyledButton
                    className={cx(classes.user, {[classes.userActive]: userMenuOpened})}
                >
                    <Group gap={7}>
                        <Avatar src={session.user?.image} alt={session.user?.name ?? ''} radius="xl" size={20}/>
                        <Text fw={500} size="sm" lh={1} mr={3}>
                            {session.user?.name}
                        </Text>
                        <IconChevronDown style={{width: rem(12), height: rem(12)}} stroke={1.5}/>
                    </Group>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item
                    leftSection={
                        <IconHeart
                            style={{width: rem(16), height: rem(16)}}
                            color={theme.colors.red[6]}
                            stroke={1.5}
                        />
                    }
                    onClick={() => router.push("/find/my")}
                >
                    Your finds
                </Menu.Item>
                <Menu.Item
                    leftSection={
                        <IconStar
                            style={{width: rem(16), height: rem(16)}}
                            color={theme.colors.yellow[6]}
                            stroke={1.5}
                        />
                    }
                    onClick={() => router.push("/lost/my")}
                >
                    Your losts
                </Menu.Item>

                <Divider/>

                <Menu.Label>Settings</Menu.Label>
                <Menu.Item
                    leftSection={
                        <IconSettings style={{width: rem(16), height: rem(16)}} stroke={1.5}/>
                    }
                    onClick={() => router.push("/settings")}
                >
                    Account settings
                </Menu.Item>
                <Menu.Item
                    leftSection={
                        <IconLogout style={{width: rem(16), height: rem(16)}} stroke={1.5}/>
                    }
                    onClick={logoutHandle}
                >
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}
