import React, { useState } from 'react';
import { Form, Input, Select, Button, Upload, DatePicker, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useMutation, gql } from '@apollo/client';

const { Option } = Select;

//const CREATE_INCIDENT = gql`
   // mutation CreateIncident($input: IncidentInput!) {
    //createIncident(input: $input) {
      //id
    //}
  //}
//`;

const CreateIncident: React.FC = () => {
  const [form] = Form.useForm();
  //const [createIncident] = useMutation(CREATE_INCIDENT);
  const [fileList, setFileList] = useState<any[]>([]); // State to manage uploaded files

  const onFinish = async (values: any) => {
    try {
      const formData = {
        ...values,
        photo: fileList.map(file => file.originFileObj), // Send all uploaded files
      };

      //await createIncident({ variables: { input: formData } });
      message.success('Incident reported successfully!');
      form.resetFields();
      setFileList([]); // Reset file list after successful submission
    } catch (error) {
      const combinedMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error(combinedMessage);
      message.error('Error reporting incident: ' + combinedMessage);
    }
  };

  const handleChange = (info: any) => {
    let newFileList = [...info.fileList];

    // Limit the number of files if needed (optional)
    // newFileList = newFileList.slice(-5); // Example: limit to 5 files

    setFileList(newFileList);
  };

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
        <Upload 
          beforeUpload={() => false} 
          multiple 
          fileList={fileList} 
          onChange={handleChange}
        >
          <Button icon={<UploadOutlined />}>Choose Files</Button>
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
          Submit Incident Report
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateIncident;