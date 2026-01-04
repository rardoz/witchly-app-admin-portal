import { FaPlus } from "react-icons/fa6";
import { TbStars } from "react-icons/tb";
import Navbar from "@/components/navbar";

const TYPE_TO_COMPONENTS = {
  "horoscopes-all": {
    title: (
      <>
        <TbStars /> All Horoscopes
      </>
    ),
    variant: "success",
    href: {
      url: "/horoscopes/create",
      label: (
        <>
          <FaPlus /> Create Horoscope
        </>
      ),
    },
  },
  "horoscopes-create": {
    title: (
      <>
        <FaPlus /> Create Horoscope
      </>
    ),
    href: {
      url: "/horoscopes",
      label: (
        <>
          <TbStars /> All Horoscopes
        </>
      ),
    },
  },
  "horoscopes-edit": {
    title: (
      <>
        <TbStars /> Edit Horoscope
      </>
    ),
    href: {
      url: "/horoscopes",
      label: (
        <>
          <TbStars /> All Horoscopes
        </>
      ),
    },
  },
};

const HoroscopesNav: React.FC<
  React.PropsWithChildren<{
    type?: "horoscopes-all" | "horoscopes-create" | "horoscopes-edit";
  }>
> = ({ type = "horoscopes-all", children }) => {
  return (
    <Navbar type={type} componentMap={TYPE_TO_COMPONENTS}>
      {children}
    </Navbar>
  );
};

export default HoroscopesNav;
