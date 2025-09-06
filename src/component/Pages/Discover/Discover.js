import SRSOverview from "./Srs";
import Syntax from "./Syntax";

export default function Discover() {
  return (
    <div className="p-8 mt-20 bg-black min-h-screen flex flex-col items-center w-full">
      <SRSOverview />
      <Syntax />
    </div>
  );
}
