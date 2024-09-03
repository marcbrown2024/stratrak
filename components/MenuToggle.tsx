import React from "react";
import { FiMenu } from "react-icons/fi";

const MenuToggle = ({ toggle }: { toggle: any }) => (
  <button
    onClick={toggle}
    className="absolute right-4 top-[14px] text-blue-500 pointer-events-auto z-30"
  >
    <FiMenu size={36}/>
  </button>
);

export default MenuToggle;
