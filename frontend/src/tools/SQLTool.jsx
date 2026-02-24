import React from 'react';
import { API } from '../wailsbridge';
import BaseTool from '../components/BaseTool';

export default function SQLTool() {
  const process = async (val) => await API.sqlFormat(val);
  return (
    <BaseTool
      title="SQL Formatter"
      process={process}
      samples={[
        { label: 'Basic SELECT', value: 'select id, name, email from users where id > 10 and status = "active" order by name limit 10' },
        { label: 'INSERT Statement', value: 'insert into users (id, name, email) values (1, "John", "john@example.com"), (2, "Jane", "jane@example.com")' },
        { label: 'JOIN Query', value: 'select u.name, p.title from users u inner join posts p on u.id = p.user_id where p.published = true' },
      ]}
    />
  );
}
