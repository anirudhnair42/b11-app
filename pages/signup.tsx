import SignupModal from "@/components/SignupModal";
import { FC } from "react";

const SignupPage: FC = () => {
  return (
    <div className="flex flex-col h-screen ">
      {" "}
      <SignupModal />
    </div>
  );
};

export default SignupPage;
