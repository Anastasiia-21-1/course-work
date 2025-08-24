'use client'
import {
    Box,
    Burger,
    Button,
    Center,
    Collapse,
    Divider,
    Drawer,
    Group,
    HoverCard,
    rem,
    ScrollArea,
    SimpleGrid,
    Text,
    ThemeIcon,
    UnstyledButton,
    useMantineTheme,
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {
    IconArrowDownLeftCircle,
    IconArrowDownRightCircle,
    IconArrowUpLeftCircle,
    IconArrowUpRightCircle,
    IconChevronDown,
} from '@tabler/icons-react';
import classes from '@/style/Header.module.css';
import {useSession} from "next-auth/react";
import {UserMenu} from "@/components/layout/UserMenu";
import Link from "next/link";

const allLinks = [
    {
        icon: IconArrowDownRightCircle,
        title: 'Втрати',
        description: 'Побачити всі втрати',
        href: '/lost'
    },
    {
        icon: IconArrowDownLeftCircle,
        title: 'Мої втрати',
        description: 'Побачити свої втрати',
        href: '/lost/my'
    },
    {
        icon: IconArrowUpRightCircle,
        title: 'Знахідки',
        description: 'Побачити всі знахідки',
        href: '/find'
    },
    {
        icon: IconArrowUpLeftCircle,
        title: 'Мої знахідки',
        description: 'Побачити свої знахідки',
        href: '/find/my'
    },
] as const;


function GuestMenu() {
    return (
        <>
            <Link href="/api/auth/signin">
                <Button variant="default">Увійти</Button>
            </Link>
            <Link href="/register">
                <Button variant="default">Зареєструватись</Button>
            </Link>
        </>
    )
}


export function Header() {
    const [drawerOpened, {toggle: toggleDrawer, close: closeDrawer}] = useDisclosure(false);
    const [linksOpened, {toggle: toggleLinks}] = useDisclosure(false);
    const theme = useMantineTheme();

    const {data: session, status} = useSession()

    const links = allLinks.map((item, index) => (
        <Link href={item.href} key={index}>
            <UnstyledButton className={classes.subLink} key={item.title}>
                <Group wrap="nowrap" align="flex-start">
                    <ThemeIcon size={34} variant="default" radius="md">
                        <item.icon style={{width: rem(22), height: rem(22)}} color={theme.colors.blue[6]}/>
                    </ThemeIcon>
                    <span>
                        <Text size="sm" fw={500}>
                            {item.title}
                        </Text>
                        <Text size="xs" c="dimmed">
                            {item.description}
                        </Text>
                    </span>
                </Group>
            </UnstyledButton>
        </Link>
    ));

    return (
        <Box>
            <header className={classes.header}>
                <Group justify="space-between" h="100%">
                    <Group h="100%" gap={0} visibleFrom="sm">
                        <a href="/" className={classes.link}>
                            Головна
                        </a>
                        <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
                            <HoverCard.Target>
                                <a href="#" className={classes.link}>
                                    <Center inline>
                                        <Box component="span" mr={5}>
                                            Категорії
                                        </Box>
                                        <IconChevronDown
                                            style={{width: rem(16), height: rem(16)}}
                                            color={theme.colors.blue[6]}
                                        />
                                    </Center>
                                </a>
                            </HoverCard.Target>

                            <HoverCard.Dropdown style={{overflow: 'hidden'}}>
                                <SimpleGrid cols={2} spacing={0}>
                                    {links}
                                </SimpleGrid>
                            </HoverCard.Dropdown>
                        </HoverCard>
                        <Link href="/find/create" className={classes.link}>
                            Я знайшов річ
                        </Link>
                        <Link href="/lost/create" className={classes.link}>
                            Я втратив річ
                        </Link>
                    </Group>

                    <Group visibleFrom="sm">
                        {session ? <UserMenu session={session}/> : <GuestMenu/>}
                    </Group>

                    <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm"/>
                </Group>
            </header>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Navigation"
                hiddenFrom="sm"
                zIndex={1000000}
            >
                <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
                    <Divider my="sm"/>

                    <a href="#" className={classes.link}>
                        Home
                    </a>
                    <UnstyledButton className={classes.link} onClick={toggleLinks}>
                        <Center inline>
                            <Box component="span" mr={5}>
                                Категорії
                            </Box>
                            <IconChevronDown
                                style={{width: rem(16), height: rem(16)}}
                                color={theme.colors.blue[6]}
                            />
                        </Center>
                    </UnstyledButton>
                    <Collapse in={linksOpened}>{links}</Collapse>
                    <Link href="/lost/create" className={classes.link}>
                        Я знайшов річ
                    </Link>
                    <Link href="/find/create" className={classes.link}>
                        Я втратив річ
                    </Link>

                    <Divider my="sm"/>

                    <Group justify="center" grow pb="xl" px="md">
                        {session ? <UserMenu session={session}/> : <GuestMenu/>}
                    </Group>
                </ScrollArea>
            </Drawer>
        </Box>
    );
}
