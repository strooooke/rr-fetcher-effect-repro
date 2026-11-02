import { Link, Links, Meta, Outlet, Scripts } from "react-router";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body>
        <nav>
          <Link to="/">home</Link> | <Link to="/fetcher">fetcher page</Link>
        </nav>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
