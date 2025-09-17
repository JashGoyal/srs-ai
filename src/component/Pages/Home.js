import HistoryHome from "./History/HistoryHome";
import Floatinginput from "./Home/Floatinginput";
import Landing from "./Home/Landing";

function Home() {

    return (
        <div className="min-h-screen bg-black text-neon font-sans px-6 py-6">
            <Landing />

            <Floatinginput />

            <HistoryHome />
        </div>
    );
}

export default Home;
