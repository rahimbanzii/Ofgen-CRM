import { Text } from '../text'
import { Card, List, Space, Typography } from 'antd'
import { UnorderedListOutlined } from '@ant-design/icons'
import LatestActivitiesSkeleton from '../skeleton/latest-activities'
import { useList } from '@refinedev/core'
import { DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY } from '@/graphql/queries'
import CustomAvatar from '../custom-avatar'
import { Deal, Audit } from '../../graphql/schema.types';
import dayjs from 'dayjs'

const { Paragraph } = Typography;

const LatestActivities: React.FC = () => {
    const { data: audit, isLoading: isLoadingAudit, isError, error } = useList<Audit>({
        resource: 'audits',
        meta: {
            gqlQuery: DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY,
        },
    });

  const dealIds= audit?.data?.map((auditItem) => auditItem.targetID)
  const { data: deals, isLoading: isLoadingDeals } = useList({
      resource: 'deals',
      queryOptions: { enabled: !!dealIds?.length },
      pagination: {
          mode: 'off'
        },
        filters: [{field: 'id',  operator: 'in', value: dealIds}],
        meta: {
         gqlQuery: DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY
       }
    });
   if (isError) {
      return <Paragraph type="danger">Error: {error.message}</Paragraph>; // Improved error handling
      }

  const isLoading = isLoadingAudit || isLoadingDeals;

    return (
<Card
  style={{
      padding: '16px',
  }}
  title={
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <UnorderedListOutlined />
      <Text size="sm" style={{ marginLeft: '0.5rem' }}>
        Latest Activities
      </Text>
    </div>
  }
>
           {isLoading ? (
              <List
                 itemLayout='horizontal'
                 dataSource={Array.from({ length: 5})
                      .map((_, i) => ({ id: i}))}
                      renderItem={(_, index) => (
                         <LatestActivitiesSkeleton key={index} />
                        )}
                />
         ) : (
             <List 
                itemLayout='horizontal'
                dataSource={audit?.data}
                renderItem={(item) => {
                    const deal = deals?.data?.find(
                        (deal) => deal.id === String (item.targetID)
                       ) || undefined;

                    return (
                        <List.Item>
                            <List.Item.Meta
                            title={dayjs(deal?.createdAt).format('MMM DD, YYYY HH:mm')}
                                avatar={
                                    <CustomAvatar
                                      shape="square"
                                      size={48}
                                      src={deal?.company.avatarUrl}
                                      name={deal?.company.name}
                                    />
                                }
                                description={
                                    <Space size={4}>
                                        <Text strong>{item.user?.name}</Text>
                                        <Text>
                                            {item.action === 'CREATE' ? 'created' : 'moved'}
                                        </Text>
                                        <Text strong>{deal?.title}</Text>
                                        <Text>deal</Text>
                                        <Text>{item.action === 'create' ? 'in' : 'to'}
                                        </Text>
                                        <Text strong>
                                            {deal?.stage?.title}
                                        </Text>
                                        </Space>
                                }
                            />
                        </List.Item>                            
                    );
                }}
             />
            )}
            </Card>
    );
};

export default LatestActivities