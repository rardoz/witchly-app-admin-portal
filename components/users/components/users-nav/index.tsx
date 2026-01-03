import { FaPlus, FaUsers } from "react-icons/fa6";
import Navbar from "@/components/navbar";

const TYPE_TO_COMPONENTS = {
  "users-all": {
    title: (
      <>
        <FaUsers /> All Users
      </>
    ),
    variant: "success",
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

const UsersNav: React.FC<
  React.PropsWithChildren<{
    type?: "users-all" | "users-create" | "users-edit";
    id?: string;
  }>
> = ({ type = "users-all", children }) => {
  return (
    <Navbar type={type} componentMap={TYPE_TO_COMPONENTS}>
      {children}
    </Navbar>
  );
};

export default UsersNav;
