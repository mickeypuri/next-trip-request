import { db } from "@/lib/db";
import DetailMap from "./DetailMap";

async function getSingleRequest(request_id) {
  let _error;
  try {
    const { data, error } = await db.rpc("get_request_by_id", { request_id })
      

    if (!error) {
      return data;
    }
    else {
      _error = error;
    }
  } catch (error) {
    _error = error;
  }
  throw new Error(_error.message);
}

/* async function getDrivers() {
  let _error;
  try {
    const { data, error } = await db.rpc("fetch_drivers")
      

    if (!error) {
      return data;
    }
    else {
      _error = error;
    }
  } catch (error) {
    _error = error;
  }
  throw new Error(_error.message);
} */

export default async function TripDetail({ id }) {
  const requests = await getSingleRequest(id);
  return <DetailMap request={requests[0]} />;
}
