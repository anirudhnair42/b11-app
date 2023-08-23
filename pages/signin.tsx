import { FC, useState } from "react";
import SigninModal from "@/components/SigninModal";

const SignupPage: FC = () => {
  return (
    <div className="flex flex-col h-screen ">
      {" "}
      <SigninModal />
    </div>
  );
};

export default SignupPage;
