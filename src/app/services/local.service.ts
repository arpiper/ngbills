function getLocalStorage(key: string): Array<any> {
  let ls = localStorage.getItem(key)
  if (!ls) {
    return []
  }
  return JSON.parse(ls)
}

function saveLocalStorage(key: string, val: any): void {
  localStorage.setItem(key, JSON.stringify(val))
}

export {
  getLocalStorage as getLS,
  saveLocalStorage as saveLS
}
