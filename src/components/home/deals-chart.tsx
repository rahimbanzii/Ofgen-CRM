import { DollarOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import React from 'react';
import { Text } from '../text';
import config from '../../../graphql.config';
import { Area, AreaConfig } from '@ant-design/plots';
import { useList } from '@refinedev/core';
import { DASHBOARD_DEALS_CHART_QUERY } from '../../graphql/queries';
import { mapDealsData } from '../../utilities/helpers';
import { GetFieldsFromList } from '@refinedev/nestjs-query';
import { DashboardDealsChartQuery } from '../../graphql/types';

const DealsChart: React.FC = () => {
    const { data } = useList<GetFieldsFromList<DashboardDealsChartQuery>>({
        resource: 'dealStages',
        filters: [
            {
                field: 'title',
                operator: 'in',
                value: ['WON', 'LOST'],
            },
        ],
        meta: {
            gqlQuery: DASHBOARD_DEALS_CHART_QUERY,
        },
    });

    const dealData = React.useMemo(() => {
        return mapDealsData(data?.data || []); // Provide a fallback to an empty array
    }, [data]);

    const config: AreaConfig = {
        data: dealData,
        xField: 'timeText',
        yField: 'value',
        isStack: false,
        seriesField: 'state',
        animation: true,
        startOnZero: false,
        smooth: true,
        legend: {
            offsetY: -6,
        },
        yAxis: {
            tickCount: 6,
            label: {
                formatter: (v: string) => {
                    return `$${Number(v) / 1000}k`;
                },
            },
        },
        tooltip: {
            formatter: (data) => {
                return {
                    name: data.state,
                    value: `$${Number(data.value) / 1000}k`, // Use data.value instead of v
                };
            },
        },
    };

    return (
        <Card
            style={{ height: '100%', padding: '10px 10px 0 0px' }} // Apply padding directly
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <DollarOutlined />
                    <Text size="sm" style={{ marginLeft: '0.5rem' }}>
                        Deals
                    </Text>
                </div>
            }
        >
            <Area {...config} height={325} />
        </Card>
    );
};

export default DealsChart;