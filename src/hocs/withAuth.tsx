import { FC, useEffect } from "react";
import { useRouter } from "next/router";

const withAuth = (Component: FC) => {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    useEffect(() => {
      // Perform localStorage action
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
      }
    }, [router]);

    return <Component {...props} />;
  };
};

export default withAuth;
