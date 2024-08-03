import {Button, Card, Center, Group, Image, Text} from '@mantine/core';
import {IconBuilding, IconClock, IconMap} from '@tabler/icons-react';
import classes from './LostCard.module.css';

interface Props {
    title?: string | null
    photo?: string | null
    description?: string | null
    location?: string | null
    time?: string | null,
    City?: {
        name?: string | null
    } | null
}

export function LostCard({title, photo, description, location, time, City}: Props) {
    const badges = [
        {label: time, icon: IconClock},
        {label: location, icon: IconMap},
        {label: City?.name, icon: IconBuilding},
    ] as const;

    const features = badges.map((feature) => {
        if (!feature.label) {
            return null;
        }
        return (
            <Center key={feature.label}>
                <feature.icon
                    size="1.05rem"
                    className={classes.icon}
                    stroke={1.5}
                />
                <Text size="xs">
                    {feature.label}
                </Text>
            </Center>
        )
    });

    return (
        <Card withBorder radius="md" className={classes.card}>
            <Card.Section className={classes.imageSection}>
                <Image className="w-full h-48" src={photo ?? 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'} alt={"" + title}/>
            </Card.Section>

            <Group justify="space-between" mt="md" h={40}>
                <div>
                    <Text fw={500}>{title}</Text>
                    {description && (
                        <Text fz="xs" c="dimmed">
                            {description}
                        </Text>
                    )}
                </div>
            </Group>

            <Card.Section className={classes.section} h={70} mt="md">
                <Group>
                    {features}
                </Group>
            </Card.Section>

            <Card.Section className={classes.section}>
                <Group gap={30}>
                    <Button radius="xl" style={{flex: 1}}>
                        Детальніше
                    </Button>
                </Group>
            </Card.Section>
        </Card>
    );
}
