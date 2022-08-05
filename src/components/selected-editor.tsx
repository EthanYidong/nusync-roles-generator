import { createSignal, Show, For } from "solid-js";

import { FaRegularPaste, FaSolidListCheck, FaSolidAngleDown, FaSolidAngleUp } from "solid-icons/fa";

import { customFormHandler } from "@/lib/directives";

export default function SelectedEditor(props) {
  const [pasteMode, setPasteMode] = createSignal(false);
  const [expanded, setExpanded] = createSignal(true);

  if (props.selected.length) {
    setExpanded(false);
  }

  function onPasteSubmit(formData) {
    const errors = [];
    for (const entry of formData.pasteData.split("\n")) {
      const entryParts = entry.toLowerCase().split(/[^a-z]/);

      const matches = [];
      for (const choice of props.selectFrom) {
        const choiceParts = choice.display.toLowerCase().split(/[^a-z]/);
        let valid = true;
        for (const part of entryParts) {
          if (!choiceParts.includes(part)) {
            valid = false;
            break;
          }
        }

        if (valid) {
          matches.push(choice);
        }
      }

      if (matches.length == 0) {
        errors.push(`${entry} did not match with any people`);
      } else if (matches.length > 1) {
        const matchesString = matches.map((m) => m.display).join(", ");
        errors.push(
          `${entry} did not matched with multiple people: ${matchesString}`
        );
      } else {
        props.setSelected(matches[0].id, true);
      }
    }
    props.setErrors(errors);
    setPasteMode(false);
  }

  return (
    <div class="card">
      <header class="card-header">
        <p class="card-header-title" style={{"cursor": "pointer"}} onClick={() => setExpanded(!expanded())}>{props.title}</p>
        <button class="card-header-icon" onClick={() => setExpanded(!expanded())}>
          <Show when={expanded()} fallback={
            <FaSolidAngleDown/>
          }>
            <FaSolidAngleUp/>
          </Show>
        </button>
      </header>
      <Show when={expanded()}>
      <div class="card-content" style={{ "height": "300px" }}>
        <div class="my-2" style={{ "height": "100%", "overflow-y": "scroll" }}>
          <Show
            when={pasteMode()}
            fallback={
              <div class="columns">
                <For each={Array.from({ length: 2 }, (x, i) => i)}>
                  {(m) => (
                    <div class="column is-6">
                      <table class="table">
                        <tbody>
                          <For each={props.selectFrom}>
                            {({ id, display }: any, index) => (
                              <Show when={index() % 2 == m}>
                                <tr>
                                  <td>
                                    <input
                                      type="checkbox"
                                      style={{ "cursor": "pointer" }}
                                      onClick={() => props.toggleSelected(id)}
                                      checked={props.selected.includes(id)}
                                    />
                                  </td>
                                  <td>
                                    <p
                                      onClick={() => props.toggleSelected(id)}
                                      style={{ "cursor": "pointer" }}
                                    >
                                      {display}
                                    </p>
                                  </td>
                                </tr>
                              </Show>
                            )}
                          </For>
                        </tbody>
                      </table>
                    </div>
                  )}
                </For>
              </div>
            }
          >
            <form use:customFormHandler={onPasteSubmit}>
              <div class="field">
                <label class="label">Paste Data from Excel/Sheets</label>
                <div class="control">
                  <textarea
                    name="pasteData"
                    rows="8"
                    style={{ "width": "100%" }}
                  ></textarea>
                </div>
              </div>
              <button type="submit" class="button">
                Confirm
              </button>
            </form>
          </Show>
        </div>
      </div>
      <footer class="card-footer">
        <Show
          when={pasteMode()}
          fallback={
            <a class="card-footer-item" onClick={() => setPasteMode(true)}>
              <FaRegularPaste />
              &nbsp;Paste
            </a>
          }
        >
          <a class="card-footer-item" onClick={() => setPasteMode(false)}>
            <FaSolidListCheck />
            &nbsp;Select
          </a>
        </Show>
      </footer>
      </Show>
    </div>
  );
}
