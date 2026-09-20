const DB_NAME = "eyelid-handbook"
const STORE = "figures"
const VERSION = 1

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function loadAllFigureBlobs(): Promise<Record<string, Blob>> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, "readonly").objectStore(STORE).openCursor()
    const out: Record<string, Blob> = {}
    request.onsuccess = () => {
      const cursor = request.result
      if (!cursor) {
        resolve(out)
        return
      }
      if (cursor.value instanceof Blob) out[String(cursor.key)] = cursor.value
      cursor.continue()
    }
    request.onerror = () => reject(request.error)
  })
}

export async function putFigureBlob(id: string, blob: Blob) {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const request = db.transaction(STORE, "readwrite").objectStore(STORE).put(blob, id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function deleteFigureBlob(id: string) {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const request = db.transaction(STORE, "readwrite").objectStore(STORE).delete(id)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function clearFigureBlobs() {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const request = db.transaction(STORE, "readwrite").objectStore(STORE).clear()
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export function fileToJpegBlob(file: File, maxSide = 1800, quality = 0.86): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new window.Image()
    image.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height))
      const canvas = document.createElement("canvas")
      canvas.width = Math.max(1, Math.round(image.width * scale))
      canvas.height = Math.max(1, Math.round(image.height * scale))
      const context = canvas.getContext("2d")
      if (!context) {
        URL.revokeObjectURL(url)
        reject(new Error("无法处理图片"))
        return
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          if (blob) resolve(blob)
          else reject(new Error("图片压缩失败"))
        },
        "image/jpeg",
        quality
      )
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("无法读取该文件，请换一张 PNG/JPG 图"))
    }
    image.src = url
  })
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl)
  return response.blob()
}
