import { db } from "@/lib/db";
import PlaceSearch from "./PlaceSearch";

export default function RequestForm({originProps, destProps}) {

  const {searchLat : oLat, searchLng: oLng} = originProps;
  const {searchLat: dLat, searchLng: dLng} = destProps;

  async function formSubmit(e) {
    e.preventDefault();

    const { data, error } = await db.from('requests')
      .insert(
        {
          origin: `POINT(${oLng} ${oLat})`,
          destination: `POINT(${dLng} ${dLat})`,
        })
      .select();

      if (!error) {
        // Note: may be more performant to use useRouter
        window.location.href = `/request/${data[0].id}`
      } 
      else {
        console.error(error);
      }

  }

  return (
    <form onSubmit={formSubmit} className="flex flex-col mt-5 mx-2">

      <PlaceSearch {...originProps} placeholder="Your origin" />

      { originProps.searchLat && originProps.searchLng && 
        <PlaceSearch {...destProps} placeholder="Your destination" />
      }

      <div className="flex justify-center items-center">
        <button 
          className="bg-blue-600 text-white font-bold my-2 px-10 py-2 rounded-2xl disabled:cursor-not-allowed disabled:bg-blue-300"
          disabled={!(oLat && oLng && dLat && dLng)}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
