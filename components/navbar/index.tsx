import LinkButton from "@/components/link-button";
import PageTitle from "@/components/page-title";

const Navbar: React.FC<
  React.PropsWithChildren<{
    type: string;
    componentMap: Record<
      string,
      {
        title: React.ReactNode;
        href: { url: string; label: React.ReactNode };
      }
    >;
  }>
> = ({ type = "users-all", children, componentMap }) => {
  return (
    <nav className="flex items-center justify-between border-b border-foreground/10">
      <PageTitle>{componentMap[type].title}</PageTitle>
      <div className="-mt-5 flex items-center gap-4">
        <LinkButton href={componentMap[type].href.url}>
          {componentMap[type].href.label}
        </LinkButton>
        {children}
      </div>
    </nav>
  );
};

export default Navbar;
