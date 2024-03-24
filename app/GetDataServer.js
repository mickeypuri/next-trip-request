import { db } from '../lib/db';

async function getDrivers() {
  try {
    return await db.from('test_table__').select();
    //console.log("TestDbServer", data);
  } catch (error) {
    throw new Error(error.message);
  }
}

const GetDataServer = async () => {

  const {data: drivers, error} = await getDrivers();

  if (!error) {
    return (
      <div>
        <div>
          Data from Server
        </div>
        {drivers.map((driver) => (
          <h5 key={driver.id}>Name: {driver.name} *** Distance: {driver.distance}</h5>
        ))}
      </div>
    )
  }

  return (
    <div>
      Server errored while fetching data
      <div>
        Error: {error.message}
      </div>
    </div>
  )


};

export default GetDataServer;
