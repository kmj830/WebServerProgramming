import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" />
        <Meta />
        <Links />
      </head>
      <body className="bg-[#f7f7f7] text-[#222222] min-h-screen antialiased selection:bg-[#ff385c] selection:text-white">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "문제가 발생했습니다";
  let details = "요청을 처리하는 도중 예상치 못한 오류가 발생했습니다.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "페이지를 찾을 수 없습니다 (404)" : "오류가 발생했습니다";
    details =
      error.status === 404
        ? "요청하신 포켓몬 페이지를 찾을 수 없습니다."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#f7f7f7]">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-[#ebebeb] text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          !
        </div>
        <h1 className="text-xl font-bold text-[#222222] mb-2">{message}</h1>
        <p className="text-sm text-[#6a6a6a] mb-6">{details}</p>
        <a
          href="./"
          className="inline-flex items-center justify-center px-6 py-2.5 bg-[#222222] hover:bg-black text-white font-medium rounded-full text-sm transition-all"
        >
          도감 목록으로 돌아가기
        </a>
        {stack && (
          <pre className="mt-6 p-4 bg-gray-50 text-left text-xs text-gray-700 rounded-xl overflow-x-auto border border-gray-200">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}
