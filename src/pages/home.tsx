import { createSignal, createEffect, For } from "solid-js";
import { createStore } from "solid-js/store";

import {
  FaSolidDownload,
  FaSolidFloppyDisk,
  FaSolidFileImport,
  FaSolidD,
} from "solid-icons/fa";

import { stringify } from "csv-stringify/browser/esm/sync";
import { saveAs } from "file-saver";

import { useStorage } from "@/lib/storage";
import type { State } from "@/lib/models";

import ArrayEditor from "@/components/array-editor";
import SelectedEditor from "@/components/selected-editor";
import Errors from "@/components/errors";

export default function Home() {
  const [rolePasteErrors, setRolePasteErrors] = createSignal([]);
  const [storage, setStorage] = useStorage();
  const [state, setState] = createStore<State>({
    idGen: 0,
    people: [],
    roles: [],
  });

  let stateUploadForm;
  let stateUploadInput;

  if (storage.state) {
    setState(JSON.parse(storage.state));
  }

  createEffect(() => setStorage("state", JSON.stringify(state)));

  function nextId() {
    const id = state.idGen;
    setState("idGen", id + 1);
    return id;
  }

  function createPerson(person: { name; nusnetID }) {
    setState("people", (p) => [
      ...p,
      {
        id: nextId(),
        ...person,
      },
    ]);
  }

  function updatePerson(id: number, person: { name; nusnetID }) {
    setState("people", (people) => people.map((p) => p.id == id ? {...p,...person}: p))
  }

  function createRole(role: { name; startDate; endDate }) {
    setState("roles", (r) => [
      ...r,
      {
        id: nextId(),
        people: [],
        ...role,
      },
    ]);
  }

  function updateRole(id: number, role: { name; startDate; endDate }) {
    setState("roles", (roles) => roles.map((r) => r.id == id ? {...r,...role}: r))
  }

  function toggleRole(roleIdx, personId) {
    if (state.roles[roleIdx].people.includes(personId)) {
      setState("roles", roleIdx, "people", (people) =>
        people.filter((p) => p != personId)
      );
    } else {
      setState("roles", roleIdx, "people", (people) => [...people, personId]);
    }
  }

  function setRole(roleIdx, personId, selected) {
    if (state.roles[roleIdx].people.includes(personId)) {
      if (!selected) {
        setState("roles", roleIdx, "people", (people) =>
          people.filter((p) => p != personId)
        );
      }
    } else {
      if (selected) {
        setState("roles", roleIdx, "people", (people) => [...people, personId]);
      }
    }
  }

  function roleDescriptor(role) {
    if (role.people.length == 1) {
      return `[${state.people.find((p) => p.id == role.people[0]).name}]`;
    } else if (role.people.length == 0) {
      return "";
    } else {
      return `(${role.people.length})`
    }
  }

  function onDownloadState() {
    saveAs(
      new Blob([JSON.stringify(state, null, 2)], {
        type: "application/json;charset=utf-8",
      }),
      "NUSync-Generator-save.json"
    );
  }

  function onUploadState() {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setState(JSON.parse(reader.result as string));
    });
    reader.readAsText(stateUploadInput.files[0]);
  }

  function onExport() {
    const records = [];
    for (const person of state.people) {
      for (const role of state.roles) {
        if (role.people.includes(person.id)) {
          records.push({
            "Username (nusstu\\nusnet)": person.nusnetID,
            PositionName: role.name,
            StartDate: role.startDate,
            EndDate: role.endDate,
          });
        }
      }
    }
    const output = stringify(records, {
      header: true,
    });
    saveAs(
      new Blob([output], { type: "text/csv;charset=utf-8" }),
      "NUSync-Generator-export.csv"
    );
  }

  return (
    <>
      <form ref={stateUploadForm} style={{ "display": "none" }}>
        <input
          ref={stateUploadInput}
          type="file"
          name="upload"
          accept="application/json"
          onChange={onUploadState}
        />
      </form>
      <Errors errors={rolePasteErrors()}></Errors>
      <section class="section">
        <h1 class="title">NUSync Role Table Generator</h1>
      </section>
      <section class="section">
        <nav class="level">
          <div class="level-left">
            <div class="level-item">
              <button class="button" onClick={onDownloadState}>
                <FaSolidFloppyDisk />
                &nbsp;Save
              </button>
            </div>
            <div class="level-item">
              <button class="button" onClick={() => stateUploadInput.click()}>
                <FaSolidFileImport />
                &nbsp;Load
              </button>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item">
              <button class="button" onClick={onExport}>
                <FaSolidDownload />
                &nbsp;Export
              </button>
            </div>
          </div>
        </nav>
        <div class="columns">
          <div class="column is-5">
            <div class="mb-2">
              <ArrayEditor
                title="People"
                fields={[
                  { name: "name", display: "Name" },
                  { name: "nusnetID", display: "NUSNET ID" },
                ]}
                unique="name"
                data={state.people}
                addItem={createPerson}
                updateItem={updatePerson}
              />
            </div>
            <div class="mb-2">
              <ArrayEditor
                title="Roles"
                fields={[
                  { name: "name", display: "Name" },
                  { name: "startDate", display: "Start Date" },
                  { name: "endDate", display: "End Date" },
                ]}
                unique="name"
                data={state.roles}
                addItem={createRole}
                updateItem={updateRole}
              />
            </div>
          </div>
          <div class="column is-7">
            <For each={state.roles}>
              {(role, index) => (
                <div class="mb-2">
                  <SelectedEditor
                    title={`Role — ${role.name} ${roleDescriptor(role)}`}
                    selectFrom={state.people.map((p) => ({
                      id: p.id,
                      display: p.name,
                    }))}
                    selected={role.people}
                    toggleSelected={(id) => {
                      toggleRole(index(), id);
                    }}
                    setSelected={(id) => setRole(index(), id, true)}
                    setErrors={setRolePasteErrors}
                  />
                </div>
              )}
            </For>
          </div>
        </div>
      </section>
    </>
  );
}
