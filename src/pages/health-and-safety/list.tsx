
import React from 'react';
import { Table, Button } from 'antd';
import { Link } from 'react-router-dom';

const incidentsData = [
  // Sample data, replace with data from your GraphQL API
  {
    key: '1',
    type: 'Violation',
    description: 'Improper use of PPE',
    date: '2024-11-17',
    location: 'Project Site Suguna Kajiado',
  },
  {
    key: '2',
    type: 'Accident',
    description: 'Slip and fall',
    date: '2024-10-02',
    location: 'Office',
  },
  {
    key: '3',
    type: 'Violation',
    description: 'Ignoring fall protection',
    date: '2024-10-04',
    location: 'Project Site KCB Mandera',
  },
  {
    key: '4',
    type: 'Accident',
    description: 'Electric hazard',
    date: '2024-11-02',
    location: 'Office',
  },
];

const IncidentList: React.FC = () => {
    function go(arg0: { to: { resource: string; action: string; }; options: { keepQuery: boolean; }; type: string; }) {
        throw new Error('Function not implemented.');
    }

  return (
    <div>
      <h1>Incident List</h1>
      <Link to="/health-and-safety/new">
        <Button       
          onClick={() => {
            go({
              to: {
                resource: 'health-and-safety',
                action: 'create incident'
              },
              options: {
                 keepQuery: true
              },
              type: 'replace'
            })
          }}
        type="primary" style={{ marginBottom: '16px'  }}>
         <strong> Report Incident</strong>
        </Button>
      </Link>
      <Table dataSource={incidentsData}>
        <Table.Column title="Incident Type" dataIndex="type" key="type" />
        <Table.Column title="Description" dataIndex="description" key="description" />
        <Table.Column title="Date" dataIndex="date" key="date" />
        <Table.Column title="Location" dataIndex="location" key="location" />
        <Table.Column
          title="Action"
          key="action"
          render={(text, record) => (
            <Link to={`/health-and-safety/edit/${record.key}`}>
              <Button type="link">Edit</Button>
            </Link>
          )}
        />
      </Table>
    </div>
  );
};

export default IncidentList;