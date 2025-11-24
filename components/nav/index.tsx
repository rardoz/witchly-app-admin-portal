import { FaPenToSquare, FaUsers } from "react-icons/fa6";
import readUserAction from "@/actions/user/read";
import Link from "@/components/link";
import { auth } from "@/lib/auth/auth";
import Logo from "../logo";

const routes = [
  {
    name: "Users",
    href: "/users",
    icon: <FaUsers className="inline-block mr-2" />,
  },
];

const Nav: React.FC = async () => {
  const session = await auth();
  const readUser = await readUserAction({ id: session?.user.id || "" });

  return (
    <nav className="w-[300px] shrink-0 border-r border-foreground/10 bg-neutral-900 ">
      <div className="pb-6 px-6 border-b border-foreground/10">
        <Logo />
        <div className="flex items-center">
          <span className="mr-2">
            Hello, {readUser.data?.user?.name || readUser.data?.user?.handle}
          </span>
          <Link href="/profile" className="hover:text-purple-400">
            <FaPenToSquare />
          </Link>
        </div>
      </div>
      {routes.map((route) => (
        <Link
          key={route.name}
          href={route.href}
          className="flex items-center px-6 py-3 hover:bg-neutral-800 border-b border-foreground/10"
        >
          {route.icon}
          {route.name}
        </Link>
      ))}
    </nav>
  );
};

export default Nav;
