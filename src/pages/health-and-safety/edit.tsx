import React, { useEffect } from 'react';
import { Form, Input, Select, Button, Upload, DatePicker, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';

const { Option } = Select;

//* const GET_INCIDENT = gql`
  //query GetIncident($id: ID!) {
    //incident(id: $id) {
     // id
      //incidentType
      //description
      //dateTime
      //location
      //photo
      //correctiveAction
      //personnelCount
    //}
  //}
//`; */

c//onst UPDATE_INCIDENT = gql`
 // mutation UpdateIncident($id: ID!, $input: IncidentInput!) {
   // updateIncident(id: $id, input: $input) {
   //   id
  //  }
  //}
//`;

const EditIncident: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery(GET_INCIDENT, { variables: { id } });
  const [form] = Form.useForm();
  const [updateIncident] = useMutation(UPDATE_INCIDENT);

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data.incident);
    }
  }, [data]);

  const onFinish = async (values: any) => {
    try {
      await updateIncident({ variables: { id, input: values } });
      message.success('Incident updated successfully!');
    } catch (error) {
      message.error('Error updating incident');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading incident</p>;

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item name="incidentType" label="Incident Type" rules={[{ required: true }]}>
        <Select placeholder="Select Incident Type">
          <Option value="violation">Violation</Option>
          <Option value="accident">Accident</Option>
          <Option value="near_miss">Near Miss</Option>
        </Select>
      </Form.Item>
      <Form.Item name="description" label="Description" rules={[{ required: true }]}>
        <Input.TextArea placeholder="Describe the incident" />
      </Form.Item>
      <Form.Item name="dateTime" label="Date & Time" rules={[{ required: true }]}>
        <DatePicker showTime />
      </Form.Item>
      <Form.Item name="location" label="Location" rules={[{ required: true }]}>
        <Select placeholder="Select Location">
          <Option value="office">Office</Option>
          <Option value="project_site">Project Site</Option>
        </Select>
      </Form.Item>
      <Form.Item name="photo" label="Upload Photo">
        <Upload beforeUpload={() => false}>
          <Button icon={<UploadOutlined />}>Choose File</Button>
        </Upload>
      </Form.Item>
      <Form.Item name="correctiveAction" label="Proposed Corrective Action" rules={[{ required: true }]}>
        <Input placeholder="Describe corrective action" />
      </Form.Item>
      <Form.Item name="personnelCount" label="No of Personnel on Site" rules={[{ required: true }]}>
        <Input type="number" placeholder="Enter number of personnel" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update Incident Report
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditIncident;