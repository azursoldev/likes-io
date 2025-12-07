import type { Metadata } from "next";
import MyAccount from "../components/MyAccount";

export const metadata: Metadata = {
  title: "My Account | Likes.io",
  description: "Manage your account details, wallet, password, and notification settings.",
};

export default function Page() {
  return <MyAccount />;
}

