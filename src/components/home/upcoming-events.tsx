import { CalendarOutlined } from '@ant-design/icons';
import { Badge, Card, List } from 'antd';
import { Text } from '../text';
import UpcomingEventsSkeleton from '../skeleton/upcoming-events';
import { getDate } from '../../utilities/helpers';
import { DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY } from '../../graphql/queries';
import { useList } from '@refinedev/core';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import styles from './UpcomingEvents.module.css';

const UpcomingEvents = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { data, isLoading: eventsLoading } = useList({
        resource: 'events',
        pagination: { pageSize: 5 },
        sorters: [
            {
                field: 'startDate',
                order: 'asc',
            },
        ],
        filters: [
            {
                field: 'startDate',
                operator: 'gte',
                value: dayjs().toISOString(),
            },
        ],
        meta: {
            gqlQuery: DASHBOARD_CALENDAR_UPCOMING_EVENTS_QUERY,
        },
    });

    useEffect(() => {
        setIsLoading(eventsLoading);
    }, [eventsLoading]);

    return (
        <Card className={styles.card} title={
            <div className={styles.cardTitle}>
                <CalendarOutlined />
                <Text size="sm" className={styles.cardText}>
                    Upcoming Events
                </Text>
            </div>
        }>
            {isLoading ? (
                <List
                    itemLayout="horizontal"
                    dataSource={Array.from({ length: 5 }).map((_, index) => ({
                        id: index,
                    }))}
                    renderItem={() => <UpcomingEventsSkeleton />}
                />
            ) : (
                <List
                    itemLayout="horizontal"
                    dataSource={data?.data || []}
                    renderItem={(Item) => {
                        const renderDate = getDate(Item.startDate, Item.endDate);
                        return (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Badge status="processing" />}
                                    title={<Text size="xs">{renderDate}</Text>}
                                    description={
                                        <Text ellipsis={{ tooltip: { title: Item.title } }} strong>
                                            {Item.title}
                                        </Text>
                                    }
                                />
                            </List.Item>
                        );
                    }}
                />
            )}
            {!isLoading && data?.data.length === 0 && (
                <span className={styles.noEvents}>
                    No Upcoming Events
                </span>
            )}
        </Card>
    );
};

export default UpcomingEvents;