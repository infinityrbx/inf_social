import React from "react";
import HeaderCom from "../components/headerCom.js";
import SidebarCom from "../components/sidebarCom.js";
import BodyCom from "../components/bodyCom.js";
import RightbarCom from "../components/rightbarCom.js";

export default function Layout() {
  return (
    <div>
      <div className="min-h-full">
        <HeaderCom />
        <div className="py-10">
          <div className="mx-auto max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-8 lg:px-8">
            <SidebarCom />
            <BodyCom />
            <RightbarCom />
          </div>
        </div>
      </div>
    </div>
  );
}
