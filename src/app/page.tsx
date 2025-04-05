import { getAuthSession } from "@/auth";
import Featured from "@/components/Featured";
import Offer from "@/components/Offer";
import Slider from "@/components/Slider";

export default function Home() {
  // const session = getAuthSession(); // using the server session
  // if (session) {
  //   console.log("Logged in" + session);
  // }
  return (
    <main>
      <Slider />
      <Featured />
      <Offer />
    </main>
  );
}
