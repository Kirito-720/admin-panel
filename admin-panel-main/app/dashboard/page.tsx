import { Navbar } from "@/components/ui/others/Navbar";


import Graph from "@/components/ui/others/Graph";

import Cardstats from "@/components/ui/others/Cardstats";
import { auth } from '@clerk/nextjs';

import PieStats from "@/components/ui/others/PieStats";
import { checkAuthentication } from "../routes";
export default async function Dashboard() {
  const errorMessage = checkAuthentication();
 
  if(errorMessage){
    return new Response("Unauthorized", { status: 401 });
  }


  return (

    <div>
      <div>
        <Navbar />
      </div>
      <div className="mt-2 mx-2">
        <div >
          <Cardstats />
        
        </div>
        <div className="flex ">
          <Graph />
          <PieStats />
        </div>
      </div>
    </div>
  );
}
