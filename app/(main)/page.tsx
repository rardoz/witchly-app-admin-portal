import { auth } from "@/lib/auth/auth";
export default async function Home() {
  await auth();
  return <div>This will be a home page if we ever need one</div>;
}
