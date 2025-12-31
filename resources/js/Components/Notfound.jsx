import React from "react";
import empty from "../../assets/search.png";
const Notfound = () => {
    return (
        <div className="flex flex-col w-full h-[49vh] font-sans items-center justify-center text-xl font-bold text-secondary">
            <img
                src={`/multiskill/public/${empty}`}
                // src={`${empty}`}
                className="w-[200px] lg:w-fit lg:h-[150px] animate-pulse"
            />
            <pre className="text-sm font-bold text-center text-neutral">
                not found . . .
            </pre>
        </div>
    );
};

export default Notfound;
