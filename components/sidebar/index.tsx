import { BsMoon } from "react-icons/bs";
import { FaPenToSquare, FaSignsPost, FaUsers } from "react-icons/fa6";
import { GiEightBall, GiHut, GiSpellBook } from "react-icons/gi";
import { IoChatboxEllipses, IoStorefrontSharp } from "react-icons/io5";
import { LuPartyPopper } from "react-icons/lu";
import { MdOutlineCategory } from "react-icons/md";
import { TbPlayCard, TbStars } from "react-icons/tb";
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
  {
    name: "Tarot",
    href: "/tarot/decks",
    icon: <TbPlayCard className="inline-block mr-2" />,
  },
  {
    name: "Signs",
    href: "/signs",
    icon: <FaSignsPost className="inline-block mr-2" />,
  },
  {
    name: "Horoscopes",
    href: "/horoscopes",
    icon: <TbStars className="inline-block mr-2" />,
  },
  {
    name: "Moon Phases",
    href: "/moon-phases",
    icon: <BsMoon className="inline-block mr-2" />,
  },
  {
    name: "Magic Eight Ball",
    href: "/magic-eight-ball",
    icon: <GiEightBall className="inline-block mr-2" />,
  },
  {
    name: "Spellbooks",
    href: "/spell/books",
    icon: <GiSpellBook className="inline-block mr-2" />,
  },
  {
    name: "Covens",
    href: "/covens",
    icon: <GiHut className="inline-block mr-2" />,
  },
  {
    name: "Events",
    href: "/events",
    icon: <LuPartyPopper className="inline-block mr-2" />,
  },
  {
    name: "Market",
    href: "/market",
    icon: <IoStorefrontSharp className="inline-block mr-2" />,
  },
  {
    name: "Categories",
    href: "/categories",
    icon: <MdOutlineCategory className="inline-block mr-2" />,
  },
  {
    name: "Chat",
    href: "/chat",
    icon: <IoChatboxEllipses className="inline-block mr-2" />,
  },
];

const Sidebar: React.FC = async () => {
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

export default Sidebar;
