import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './index.css';
import { InfinitySpin } from 'react-loader-spinner';
import { SERVER_PORT } from './constants';
import { EndpointData } from './types';

const socket = io(SERVER_PORT);

const App: React.FC = () => {
  const [data, setData] = useState<EndpointData[]>([]);

  useEffect(() => {
    socket.on('update', (newData: EndpointData[]) => {
      setData(newData);
    });

    return () => {
      socket.off('update');
    };
  }, []);


  return (
    <div className='container'>
      <h1>DevOps Monitoring Dashboard</h1>
      <div>
        {data?.length > 0 ? data?.map((item, index) => (
          item?.error ? <pre className='monitor-error'>{item?.error ? `Error: ${item?.error}` : JSON.stringify(item?.data, null, 2)}</pre> : (
            <div key={index} className='monitor-data'>
              <div className='monitor-data__section'>
                <h2 className='monitor-data__header'>General Status</h2>
                <ul>
                  <li><strong>Status:</strong> {item?.data?.status}</li>
                  <li><strong>Region:</strong> {item?.data?.region}</li>
                  <li><strong>Roles:</strong> {item?.data?.roles?.join(', ')}</li>
                </ul>
              </div>
              <div className='monitor-data__section'>
                <h2 className='monitor-data__header'>Service Availability</h2>
                <ul>
                  <li><strong>Redis:</strong> {item?.data?.results?.services?.redis ? 'Available' : 'Unavailable'}</li>
                  <li><strong>Database:</strong> {item?.data?.results?.services?.database ? 'Available' : 'Unavailable'}</li>
                </ul>
              </div>
              <div className='monitor-data__section'>
                <h2 className='monitor-data__header'>Server Statistics</h2>
                <ul>
                  <li><strong>Servers Count:</strong> {item?.data?.results?.stats?.servers_count}</li>
                  <li><strong>Online Users:</strong> {item?.data?.results?.stats?.online}</li>
                  <li><strong>Session Count:</strong> {item?.data?.results?.stats?.session}</li>
                </ul>
              </div>
              <div className='monitor-data__section'>
                <h2 className='monitor-data__header'>Server Performance</h2>
                <ul>
                  <li><strong>Active Connections:</strong> {item?.data?.results?.stats?.server?.active_connections}</li>
                  <li><strong>Wait Time:</strong> {item?.data?.results?.stats?.server?.wait_time} ms</li>
                  <li><strong>CPU Load:</strong> {item?.data?.results?.stats?.server?.cpu_load}</li>
                  <li><strong>Timers:</strong> {item?.data?.results?.stats?.server?.timers}</li>
                </ul>
              </div>
              <div className='monitor-data__section'>
                <h2 className='monitor-data__header'>Worker Details</h2>
                <ul>
                  {item?.data?.results?.stats?.server?.workers?.map((worker: any, i: number) => (
                    <li key={i}>
                      <strong>{worker[0]}:</strong>
                      <ul>
                        <li>Wait Time: {worker[1]?.wait_time}</li>
                        <li>Workers: {worker[1]?.workers}</li>
                        <li>Waiting: {worker[1]?.waiting}</li>
                        <li>Idle: {worker[1]?.idle}</li>
                        <li>Time to Return: {worker[1]?.time_to_return}</li>
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='monitor-data__section'>
                <h2 className='monitor-data__header'>Additional Information</h2>
                <ul>
                  <li><strong>Strict Mode:</strong> {item?.data?.strict ? 'Enabled' : 'Disabled'}</li>
                  <li><strong>Server Issue:</strong> {item?.data?.server_issue ?? 'None'}</li>
                </ul>
              </div>
            </div>)
        )) : (
          <div className='monitor-data__spinner'>
            <InfinitySpin width="200" color="#4fa94d" />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
