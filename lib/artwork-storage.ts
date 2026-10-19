// Browser-local artwork storage keeps large image data out of localStorage.
export async function artworkStore(key:string,value?:string):Promise<string>{
  return new Promise((resolve,reject)=>{const request=indexedDB.open('magnetic-shades-artwork',1);request.onupgradeneeded=()=>request.result.createObjectStore('images');request.onerror=()=>reject(request.error);request.onsuccess=()=>{const db=request.result;const tx=db.transaction('images',value===undefined?'readonly':'readwrite');const store=tx.objectStore('images');const operation=value===undefined?store.get(key):store.put(value,key);let result='';operation.onsuccess=()=>{result=value??operation.result??'';};tx.oncomplete=()=>{db.close();resolve(result);};tx.onerror=()=>{db.close();reject(tx.error);};};});
}
