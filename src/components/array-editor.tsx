import { createSignal, Show, For } from "solid-js";
import { FaRegularPaste, FaSolidTableList } from "solid-icons/fa";

import { customFormHandler } from "@/lib/directives";

export default function ArrayEditor(props) {
  const [pasteMode, setPasteMode] = createSignal(false);

  function onPasteSubmit(formData) {
    for (const entry of formData.pasteData.split("\n")) {
      const entryData = entry.split("\t");
      const entryDataObject = {};
      for (const [idx, field] of props.fields.entries()) {
        entryDataObject[field.name] = entryData[idx];
      }

      if(props.data.map((d) => d[props.unique]).includes(entryDataObject[props.unique])) {
        props.updateItem(props.data.find((d) => d[props.unique] == entryDataObject[props.unique]).id, entryDataObject);
      } else {
        props.addItem(entryDataObject);
      }
    }
    setPasteMode(false);
  }

  return (
    <div class="card">
      <header class="card-header">
        <p class="card-header-title">{props.title}</p>
      </header>
      <div class="card-content">
        <div class="my-2">
          <Show
            when={pasteMode()}
            fallback={
              <table class="table">
                <thead>
                  <tr>
                    <For each={props.fields}>
                      {({ display }: any) => <th>{display}</th>}
                    </For>
                  </tr>
                </thead>
                <tbody>
                  <For each={props.data}>
                    {(dataEntry) => (
                      <tr>
                        <For each={props.fields}>
                          {({ name }: any) => <td>{dataEntry[name]}</td>}
                        </For>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
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
            <FaSolidTableList />
            &nbsp;List
          </a>
        </Show>
      </footer>
    </div>
  );
}
