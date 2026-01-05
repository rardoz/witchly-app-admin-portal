import { BsMoon } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import Navbar from "@/components/navbar";

const TYPE_TO_COMPONENTS = {
  "moon-phases-all": {
    title: (
      <>
        <BsMoon /> All Moon Phases
      </>
    ),
    variant: "success",
    href: {
      url: "/moon-phases/create",
      label: (
        <>
          <FaPlus /> Create Moon Phase
        </>
      ),
    },
  },
  "moon-phases-create": {
    title: (
      <>
        <FaPlus /> Create Moon Phase
      </>
    ),
    href: {
      url: "/moon-phases",
      label: (
        <>
          <BsMoon /> All Moon Phases
        </>
      ),
    },
  },
  "moon-phases-edit": {
    title: (
      <>
        <BsMoon /> Edit Moon Phase
      </>
    ),
    href: {
      url: "/moon-phases",
      label: (
        <>
          <BsMoon /> All Moon Phases
        </>
      ),
    },
  },
};

const MoonPhasesNav: React.FC<
  React.PropsWithChildren<{
    type?: "moon-phases-all" | "moon-phases-create" | "moon-phases-edit";
  }>
> = ({ type = "moon-phases-all", children }) => {
  return (
    <Navbar type={type} componentMap={TYPE_TO_COMPONENTS}>
      {children}
    </Navbar>
  );
};

export default MoonPhasesNav;
