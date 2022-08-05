import { Show, For } from "solid-js";

export default function Errors(props) {
  return (
    <Show when={props.errors && props.errors.length}>
      <section class="section">
        <article class="message is-danger">
          <div class="message-body">
            <ul>
              <For each={props.errors}>
                {(error: string) => <li>{error}</li>}
              </For>
            </ul>
          </div>
        </article>
      </section>
    </Show>
  );
}
