import { useNavigate } from "react-router-dom";

export default function Landing() {
    const navigate = useNavigate();
    return (
        <div>
            <div className="text-center mt-48">
                <h1 className="text-4xl md:text-8xl mb-10">
                    Introducing SRSense
                </h1>
                <div className="flex justify-center flex-wrap gap-4 mb-16">
                    <button className="bg-neon text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition flex items-center gap-2" onClick={() => navigate("/chat")}>
                        Try SRSense
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
                            />
                        </svg>
                    </button>

                    <button className="text-white hover:text-gray-300 px-6 py-3 rounded-full font-semibold transition bg-black flex items-center" onClick={() => navigate("/discover")}>
                        Discover SRS
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5 ml-2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="max-w-2xl mx-auto text-center mt-10 px-4">
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                    SRS AI is an intelligent tool that automatically generates a Software Requirements Specification (SRS) document for any given topic. It creates clear, well-structured, and correctly formatted SRS documents easily, saving time and ensuring accuracy in capturing all essential requirements.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                    Whether you're a software developer, project manager, or student, SRS AI streamlines the documentation process by leveraging AI to understand project needs and deliver precise technical content — reducing manual effort and improving collaboration across teams.
                </p>
            </div>

        </div>
    );
} 