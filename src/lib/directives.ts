import { onCleanup } from "solid-js";

/* eslint @typescript-eslint/no-namespace: "off"*/
declare module "solid-js" {
  namespace JSX {
    interface Directives {
      customFormHandler: (v: any, { form: any }) => any;
      customFormHandlerRaw: (v: any, { form: any }) => any;
      clickOutside: (v: any) => any;
    }
  }
}

export function customFormHandler(el, accessor) {
  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {};
    for (const field of formData) {
      const [key, value] = field;
      data[key] = value;
    }
    accessor()?.(data, { form: el });
  };
  el.addEventListener("submit", onSubmit);

  onCleanup(() => el.removeEventListener("submit", onSubmit, false));
}

export function customFormHandlerRaw(el, accessor) {
  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    accessor()?.(formData, { form: el });
  };
  el.addEventListener("submit", onSubmit);

  onCleanup(() => el.removeEventListener("submit", onSubmit, false));
}

export function clickOutside(el, accessor) {
  const onClick = (e) => !el.contains(e.target) && accessor()?.();
  document.body.addEventListener("click", onClick);

  onCleanup(() => document.body.removeEventListener("click", onClick));
}
