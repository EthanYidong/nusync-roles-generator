import { createSignal,createSelector, createUniqueId, Show, For } from "solid-js";
import { FaRegularPaste, FaSolidTableList, FaSolidAngleDown, FaSolidAngleUp, FaRegularPenToSquare, FaSolidFloppyDisk } from "solid-icons/fa";

import { customFormHandler } from "@/lib/directives";

export default function ArrayEditor(props) {
  const [pasteMode, setPasteMode] = createSignal(false);
  const [expanded, setExpanded] = createSignal(true);
  const [editing, setEditing] = createSignal(null);
  const isEditing = createSelector(editing);

  const editFormId = createUniqueId();

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

  function onEditSubmit(data) {
    props.updateItem(editing(), data);
    setEditing(null);
  }

  return (
    <>
    <form id={editFormId} use:customFormHandler={onEditSubmit} onSubmit={() => console.log("submit")}/>
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
      <div class="card-content">
        <div class="my-2">
          <Show
            when={pasteMode()}
            fallback={
              <table class="table" style={{"width": "100%"}}>
                <thead>
                  <tr>
                    <For each={props.fields}>
                      {({ display }: any) => <th>{display}</th>}
                    </For>
                    <th style={{"width": "32px"}}></th>
                  </tr>
                </thead>
                <tbody>
                  <For each={props.data}>
                    {(dataEntry: any) => (
                      <tr>
                          <For each={props.fields}>
                            {({ name, edit }: any) =>
                              <td>
                                <Show when={isEditing(dataEntry.id) && edit} fallback={<>{dataEntry[name]}</>}>
                                  <input form={editFormId} class="input is-small" type="text" name={name} value={dataEntry[name]}></input>
                                </Show>
                              </td>
                            }
                          </For>
                          <td>
                            <Show when={isEditing(dataEntry.id)} fallback={
                              <button class="button is-text is-small" onClick={() => setEditing(dataEntry.id)}>
                                <FaRegularPenToSquare/>
                              </button>}>
                              <button class="button is-text is-small" type="submit" form={editFormId}>
                                <FaSolidFloppyDisk/>
                              </button>
                            </Show>
                          </td>
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
              <button form={editFormId} type="submit" class="button">
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
      </Show>
    </div>
    </>
  );
}
