import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import initial from './data.json';
export type Content = typeof initial;
const Context = createContext<{data:Content; revision:number; refresh:() => Promise<void>}>({data:initial, revision:1, refresh:async()=>{}});
export function ContentProvider({children}:{children:ReactNode}) {
  const [data,setData]=useState<Content>(initial), [revision,setRevision]=useState(1);
  async function refresh() {
    try {
      const res=await fetch('/api/content');
      if(!res.ok) return;
      const payload=await res.json();
      setData(payload.content); setRevision(payload.revision);
    } catch { /* The bundled catalogue remains available when the API is offline. */ }
  }
  useEffect(()=>{void refresh();},[]);
  return <Context.Provider value={{data,revision,refresh}}>{children}</Context.Provider>;
}
export const useContent=()=>useContext(Context);
