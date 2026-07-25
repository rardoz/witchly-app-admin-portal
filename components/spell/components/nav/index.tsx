import { FaBookOpen, FaPlus } from "react-icons/fa6";
import Navbar from "@/components/navbar";

const TYPE_TO_COMPONENTS = {
  "spell-books-all": {
    title: (
      <>
        <FaBookOpen /> All Spell Books
      </>
    ),
    variant: "success",
    href: {
      url: "/spell/books/create",
      label: (
        <>
          <FaPlus /> Create Spell Book
        </>
      ),
    },
  },
  "spell-books-create": {
    title: (
      <>
        <FaPlus /> Create Spell Book
      </>
    ),
    href: {
      url: "/spell/books",
      label: (
        <>
          <FaBookOpen /> All Spell Books
        </>
      ),
    },
  },
  "spell-books-edit": {
    title: (
      <>
        <FaBookOpen /> Edit Spell Book
      </>
    ),
    href: {
      url: "/spell/books",
      label: (
        <>
          <FaBookOpen /> All Spell Books
        </>
      ),
    },
  },
  "spell-pages-all": {
    title: (
      <>
        <FaBookOpen /> All Spell Pages
      </>
    ),
  },
  "spell-page-create": {
    title: (
      <>
        <FaPlus /> Create Spell Page
      </>
    ),
  },
  "spell-pages-edit": {
    title: (
      <>
        <FaBookOpen /> Edit Spell Page
      </>
    ),
  },
};

const SpellNav: React.FC<
  React.PropsWithChildren<{
    type?:
      | "spell-books-all"
      | "spell-books-create"
      | "spell-books-edit"
      | "spell-pages-all"
      | "spell-page-create"
      | "spell-pages-edit";
  }>
> = ({ type = "spell-books-all", children }) => {
  return (
    <Navbar type={type} componentMap={TYPE_TO_COMPONENTS}>
      {children}
    </Navbar>
  );
};

export default SpellNav;
