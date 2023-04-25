import "@/styles/globals.css";
import "@/styles/components.css";
import "@/styles/utils.css";
import { SessionProvider } from "next-auth/react";
import { useLoading } from "@/shared/hooks/useLoading";
import { LoadingBar } from "@/shared/components/loading-bar/LoadingBar";
import { createContext, useEffect, useState } from "react";
import { Router, useRouter } from "next/router";
import { Modal } from "@/shared/components/modal/Modal";
import { ModalProvider } from "@/shared/contexts/modalContext";
import { InputBoxProvider } from "@/shared/contexts/InputBoxContext";
import { ToastProvider } from "@/shared/contexts/ToastContext";
import { MessageProvider } from "@/core/Providers/MessageProvider";
const PageContext = createContext();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const loading = useLoading();

  useEffect(() => {
    Router.events.on("routeChangeStart", (url) => {
      loading.start();
    });
    Router.events.on("routeChangeComplete", (url) => {
      loading.complete();
    });
    Router.events.on("routeChangeError", (url) => {
      loading.complete();
    });
  }, [Router]);

  const router = useRouter()

  return (
    <SessionProvider session={session}>
      <ModalProvider>
        <ToastProvider>
          <MessageProvider>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              zIndex: 10,
            }}
          >
            <LoadingBar loading={loading.loading} />
          </div>
          <Component {...pageProps} key={router.asPath} />
          </MessageProvider>
        </ToastProvider>
      </ModalProvider>
    </SessionProvider>
  );
}
