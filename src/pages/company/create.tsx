import { CompanyList } from './list';
import { Form, Input, Modal, Select, Spin } from 'antd';
import { useModalForm, useSelect } from '@refinedev/antd';
import { useGo } from '@refinedev/core';
import { CREATE_COMPANY_MUTATION } from '@/graphql/mutations';
import { USERS_SELECT_QUERY } from '@/graphql/queries';
import SelectOptionWithAvatar from '@/components/select-option-with-avatar';
import { GetFieldsFromList } from '@refinedev/nestjs-query';
import { UsersSelectQuery } from '@/graphql/types';
import React from 'react';

const Create: React.FC = () => {
    const go = useGo();

    const goToListPage = () => {
        go({
            to: { resource: 'companies', action: 'list' },
            options: { keepQuery: true },
            type: 'replace',
        });
    };

    const { formProps, modalProps } = useModalForm({
        action: 'create',
        defaultVisible: true,
        resource: 'companies',
        redirect: false,
        mutationMode: 'pessimistic',
        onMutationSuccess: goToListPage,
        meta: {
            gqlMutation: CREATE_COMPANY_MUTATION,
        },
    });

    const { selectProps, queryResult } = useSelect<GetFieldsFromList<UsersSelectQuery>>({
        resource: 'users',
        optionLabel: 'name',
        meta: {
            gqlQuery: USERS_SELECT_QUERY,
        },
    });

    const options = React.useMemo(() => {
        return queryResult.data?.data.map((user) => ({
            value: user.id,
            label: (
                <SelectOptionWithAvatar
                    name={user.name || 'Unknown User'}
                    avatarUrl={user.avatarUrl ?? undefined}
                />
            ),
        })) ?? [];
    }, [queryResult.data]);

    return (
        <CompanyList>
            <Modal
                {...modalProps}
                mask={true}
                onCancel={goToListPage}
                title="Create Company"
                width={512}
                aria-labelledby="create-company-modal-title"
                aria-describedby="create-company-modal-description"
            >
                <Form {...formProps} layout="vertical">
                    <Form.Item
                        label="Company name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter a Company name' }]}
                    >
                        <Input placeholder="Please enter a Company name" />
                    </Form.Item>
                    <Form.Item
                        label="Lead owner"
                        name="leadOwner"
                        rules={[{ required: true, message: 'Please select Lead owner' }]}
                    >
                        <Select
                            placeholder="Please select Lead owner"
                            {...selectProps}
                            options={options}
                            loading={queryResult.isLoading} // Show loading state
                        />
                        {queryResult.isLoading && <Spin size="small" />}
                    </Form.Item>
                </Form>
            </Modal>
        </CompanyList>
    );
};

export default Create;