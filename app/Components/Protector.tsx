"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
  redirectTo?: string;
};

export default function Protector({ children, redirectTo = "/login" }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push(redirectTo);
    } else {
      setReady(true);
    }
  }, [router, redirectTo]);
  if (!ready) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Checking authentication...</p>
      </div>
    );
  }
  return <>{children}</>;
}

export const withProtector = (Component: React.ComponentType<any>, redirectTo = "/login") => {
  return function Wrapped(props: any) {
    return (
      <Protector redirectTo={redirectTo}>
        <Component {...props} />
      </Protector>
    );
  };
};