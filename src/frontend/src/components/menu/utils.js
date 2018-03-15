export function getDescendent (children, index) {
  for (let child of children) {
    if (child.index === index) {
      return child
    }
    if (child.children) {
      let item = getDescendent(child.children, index)
      if (item) {
        return item
      }
    }
  }
}
