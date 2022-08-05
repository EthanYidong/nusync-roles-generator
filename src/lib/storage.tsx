import { createContext, useContext, runWithOwner } from "solid-js";
import { createLocalStorage } from "@solid-primitives/storage";
import type { StorageObject, StorageSetter } from "@solid-primitives/storage";

const StorageContext = createContext();

export function StorageProvider(props) {
  const [storage, setStorage, { clear: clearStorage }] = createLocalStorage();
  return (
    <StorageContext.Provider value={[storage, setStorage, clearStorage]}>
      {props.children}
    </StorageContext.Provider>
  );
}

export function useStorage(
  owner?
): [StorageObject<string>, StorageSetter<string, unknown>, () => void] {
  if (owner) {
    return runWithOwner(owner, useStorage);
  }
  return useContext(StorageContext) as [
    StorageObject<string>,
    StorageSetter<string, unknown>,
    () => void
  ];
}
