import { FaPlus } from "react-icons/fa6";
import { TbPlayCard } from "react-icons/tb";
import Navbar from "@/components/navbar";

const TYPE_TO_COMPONENTS = {
  "tarot-decks-all": {
    title: (
      <>
        <TbPlayCard /> All Tarot Decks
      </>
    ),
    href: {
      url: "/tarot/decks/create",
      label: (
        <>
          <FaPlus /> Create Tarot Deck
        </>
      ),
    },
  },
  "tarot-decks-create": {
    title: (
      <>
        <FaPlus /> Create Tarot Deck
      </>
    ),
    href: {
      url: "/tarot/decks",
      label: (
        <>
          <TbPlayCard /> All Tarot Decks
        </>
      ),
    },
  },
  "tarot-decks-edit": {
    title: (
      <>
        <TbPlayCard /> Edit Tarot Deck
      </>
    ),
    href: {
      url: "/tarot/decks",
      label: (
        <>
          <TbPlayCard /> All Tarot Decks
        </>
      ),
    },
  },
};

const TarotDecksNav: React.FC<
  React.PropsWithChildren<{
    type?: "tarot-decks-all" | "tarot-decks-create" | "tarot-decks-edit";
    id?: string;
  }>
> = ({ type = "tarot-decks-all", children }) => {
  return (
    <Navbar type={type} componentMap={TYPE_TO_COMPONENTS}>
      {children}
    </Navbar>
  );
};

export default TarotDecksNav;
