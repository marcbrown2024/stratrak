import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center gap-8 text-4xl font-extrabold">
      Future Updates
      <Image
        src="/chatroom.jpg"
        alt="notification update"
        width={1000}
        height={1000}
      />
      <Image
        src="/chatEmpty.png"
        alt="notification update"
        width={1000}
        height={1000}
      />
    </div>
  );
};

export default page;
