// Example usage in a component
import { clientEnv } from "@/lib/env";

export default function Header() {
  return (
    <header>
      <h1>{clientEnv.PUBLIC_APP_NAME}</h1>
      <span>v{clientEnv.PUBLIC_APP_VERSION}</span>
    </header>
  );
}
