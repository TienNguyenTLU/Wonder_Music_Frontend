'use client'
import Image from "next/image";
import TopBar from "./Components/topbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function Home() {
  const router = useRouter()
  const [checkAuth, setCheckAuth] = useState(false)
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      setCheckAuth(true)
      router.push("/home")
    } else {
      router.push("/landingpage")
    }
  }, [])
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <p>Loading...</p>
    </div>
  );
}
