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
    variant: "success",
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
  "tarot-cards-all": {
    title: (
      <>
        <TbPlayCard /> All Tarot Cards
      </>
    ),
  },
  "tarot-card-create": {
    title: (
      <>
        <FaPlus /> Create Tarot Card
      </>
    ),
  },
  "tarot-cards-edit": {
    title: (
      <>
        <TbPlayCard /> Edit Tarot Card
      </>
    ),
  },
};

const TarotDecksNav: React.FC<
  React.PropsWithChildren<{
    type?:
      | "tarot-decks-all"
      | "tarot-decks-create"
      | "tarot-decks-edit"
      | "tarot-cards-all"
      | "tarot-card-create"
      | "tarot-cards-edit";
  }>
> = ({ type = "tarot-decks-all", children }) => {
  return (
    <Navbar type={type} componentMap={TYPE_TO_COMPONENTS}>
      {children}
    </Navbar>
  );
};

export default TarotDecksNav;
