import { FaPlus, FaSignsPost } from "react-icons/fa6";
import Navbar from "@/components/navbar";

const TYPE_TO_COMPONENTS = {
  "signs-all": {
    title: (
      <>
        <FaSignsPost /> All Signs
      </>
    ),
    variant: "success",
    href: {
      url: "/signs/create",
      label: (
        <>
          <FaPlus /> Create Sign
        </>
      ),
    },
  },
  "signs-create": {
    title: (
      <>
        <FaPlus /> Create Sign
      </>
    ),
    href: {
      url: "/signs",
      label: (
        <>
          <FaSignsPost /> All Signs
        </>
      ),
    },
  },
  "signs-edit": {
    title: (
      <>
        <FaSignsPost /> Edit Sign
      </>
    ),
    href: {
      url: "/signs",
      label: (
        <>
          <FaSignsPost /> All Signs
        </>
      ),
    },
  },
};

const SignsNav: React.FC<
  React.PropsWithChildren<{
    type?: "signs-all" | "signs-create" | "signs-edit";
  }>
> = ({ type = "signs-all", children }) => {
  return (
    <Navbar type={type} componentMap={TYPE_TO_COMPONENTS}>
      {children}
    </Navbar>
  );
};

export default SignsNav;
