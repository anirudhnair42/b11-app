import { Poppins } from "next/font/google";
import { useRouter } from "next/router";
import SignupModal from "@/components/SignupModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SigninModal from "@/components/SigninModal";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin-ext"],
});

export default function Home() {
  const router = useRouter();
  return (
    <main
      className={`flex h-screen flex-col items-center p-24 ${poppins.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-center text-sm lg:flex">
        <p className="text-2xl font-bold rounded-xl text-center">
          Base<span className="text-blue-400">11</span>
        </p>
      </div>

      <div className="mt-20">
        <Tabs defaultValue="sign-in">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Login</TabsTrigger>
            <TabsTrigger value="sign-up">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in">
            <SigninModal />
          </TabsContent>
          <TabsContent value="sign-up">
            {" "}
            <SignupModal />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
