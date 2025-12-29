import { FaPlus, FaUsers } from "react-icons/fa6";
import LinkButton from "@/components/link-button";
import PageTitle from "@/components/page-title";

const TYPE_TO_COMPONENTS = {
  "users-all": {
    title: (
      <>
        <FaUsers /> All Users
      </>
    ),
    href: {
      url: "/users/create",
      label: (
        <>
          <FaPlus /> Create User
        </>
      ),
    },
  },
  "users-create": {
    title: (
      <>
        <FaPlus /> Create User
      </>
    ),
    href: {
      url: "/users",
      label: (
        <>
          <FaUsers /> All Users
        </>
      ),
    },
  },
  "users-edit": {
    title: (
      <>
        <FaUsers /> Edit User
      </>
    ),
    href: {
      url: "/users",
      label: (
        <>
          <FaUsers /> All Users
        </>
      ),
    },
  },
};

const UsersNav: React.FC<{
  type?: "users-all" | "users-create" | "users-edit";
}> = ({ type = "users-all" }) => {
  return (
    <nav className="flex items-center justify-between border-b border-foreground/10">
      <PageTitle>{TYPE_TO_COMPONENTS[type].title}</PageTitle>
      <LinkButton href={TYPE_TO_COMPONENTS[type].href.url} className="-mt-5">
        {TYPE_TO_COMPONENTS[type].href.label}
      </LinkButton>
    </nav>
  );
};

export default UsersNav;
