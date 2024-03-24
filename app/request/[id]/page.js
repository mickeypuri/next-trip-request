import TripDetail from "./detail-components/TripDetail";

export const metadata = {
  title: "Trip Details | Next course",
  description: "More information about your trip request | Connect with a driver",
};

export default function RequestDetail({ params : { id } }) {
  return <TripDetail id={id} />;
}
