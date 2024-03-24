"use client";

import { useEffect, useState } from 'react';
import { db } from '../lib/db';

const GetDataClient = () => {
  const [ drivers, setDrivers ] = useState([]);

  useEffect(() => {
    async function getDrivers() {
      try {
        const { data, error } = await db.from('test_table').select();
        console.log(data);
        setDrivers(data);
      } catch(error) {
        console.error(error);
      }
    }
    getDrivers();

  }, [])


  return (
    <div>
      {drivers.map((driver) => (
        <h5 key={driver.id}>Name: {driver.name} *** Distance: {driver.distance}</h5>
      ))}
    </div>
  )
};

export default GetDataClient;
