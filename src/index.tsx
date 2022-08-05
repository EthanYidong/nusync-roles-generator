/* @refresh reload */
import { render } from "solid-js/web";

import App from "@/app";
import { StorageProvider } from "@/lib/storage";

import "@/index.sass";

render(
  () => (
    <StorageProvider>
      <App />
    </StorageProvider>
  ),
  document.getElementById("root") as HTMLElement
);
