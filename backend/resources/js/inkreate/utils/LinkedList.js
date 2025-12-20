class Node {
  constructor(value) {
    this.value = value
    this.next = null
  }
}

export class LinkedList {
  constructor() {
    this.head = null
  }

  addFirst(value) {
    const node = new Node(value)
    node.next = this.head
    this.head = node
  }

  addLast(value) {
    const node = new Node(value)

    if (!this.head) {
      this.head = node

      return
    }

    let current = this.head

    while (current.next) {
      current = current.next
    }

    current.next = node
  }

  removeFirst() {
    if (!this.head) return 

    this.head = this.head.next 
  }

  removeLast() {
    if (!this.head) return 

    if (!this.head.next) {
      this.head = null 

      return 
    }

    let current = this.head 

    while (current.next && current.next.next) {
      current = current.next 
    }

    current.next = null 
  }

  removeByValue(property, value) {
    if (!this.head) return

    if (this.head.value[property] === value) {
      this.head = this.head.next

      return
    }

    let current = this.head

    while (current.next) {
      if (current.next.value[property] === value) {
        current.next = current.next.next
        return
      }

      current = current.next
    }
  }

  toArray() {
    const result = []
    let current = this.head

    while (current) {
      result.push(current.value)
      current = current.next
    }

    return result
  }

  clone() {
    const newList = new LinkedList()
    this.toArray().forEach(v => newList.addLast(v))

    return newList
  }

  clear() {
    this.head = null 
  }

  print() {
    let current = this.head 
    let values = [] 

    while (current) {
      values.push(current.value) 
      current = current.next 
    }
    
    console.log(values) 
  }
}
