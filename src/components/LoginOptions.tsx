"use client";

import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

export default function LoginOptions() {
  return (
    <div>
      <Button onClick={() => signIn("google")}>Login with Google</Button>
    </div>
  );
}
