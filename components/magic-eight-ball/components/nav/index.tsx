import { FaPlus } from "react-icons/fa6";
import { GiEightBall } from "react-icons/gi";
import Navbar from "@/components/navbar";

const TYPE_TO_COMPONENTS = {
  "magic-eight-ball-all": {
    title: (
      <>
        <GiEightBall /> All Magic Eight Ball Sides
      </>
    ),
    variant: "success",
    href: {
      url: "/magic-eight-ball/create",
      label: (
        <>
          <FaPlus /> Create Magic Eight Ball Side
        </>
      ),
    },
  },
  "magic-eight-ball-create": {
    title: (
      <>
        <FaPlus /> Create Magic Eight Ball Side
      </>
    ),
    href: {
      url: "/magic-eight-ball",
      label: (
        <>
          <GiEightBall /> All Magic Eight Balls Sides
        </>
      ),
    },
  },
  "magic-eight-ball-edit": {
    title: (
      <>
        <GiEightBall /> Edit Magic Eight Ball Side
      </>
    ),
    href: {
      url: "/magic-eight-ball",
      label: (
        <>
          <GiEightBall /> All Magic Eight Ball Sides
        </>
      ),
    },
  },
};

const MoonPhasesNav: React.FC<
  React.PropsWithChildren<{
    type?:
      | "magic-eight-ball-all"
      | "magic-eight-ball-create"
      | "magic-eight-ball-edit";
  }>
> = ({ type = "magic-eight-ball-all", children }) => {
  return (
    <Navbar type={type} componentMap={TYPE_TO_COMPONENTS}>
      {children}
    </Navbar>
  );
};

export default MoonPhasesNav;
