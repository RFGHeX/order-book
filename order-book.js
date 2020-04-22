const reconcileOrder = (existingBook, incomingOrder) => {

  switch (existingBook.length) {
    case 0:
      return toBook(existingBook, incomingOrder)

    default:
      return determineOrder(existingBook, incomingOrder)
  }

}

const determineOrder = (existing, incoming) => {

  for (let i = 0; i < existing.length; i++) {

    switch (incoming.type) {
      case existing[i].type:
        return toBook(existing, incoming)

      default:
        return selectOrder(existing, incoming, i)
    }
  }
}

const toBook = (existing, incoming) => {
  existing.push(incoming)
  return existing
}

const selectOrder = (existing, incoming, index) => {
  switch (incoming.price) {
    case existing[index].price:
      return resolveOrder(existing, incoming, index)
    default:
      return toBook(existing, incoming)
  }
}

const resolveOrder = (existing, incoming, index) => {
  switch (true) {
    case (incoming.quantity === existing[index].quantity):
      return removeExisting(existing, index)
    case (existing[index].quantity > incoming.quantity || incoming.quantity > existing[index].quantity):
      return removeExtra(existing, incoming, index)
    default:
      return toBook(existing, incoming)
  }
}

const removeExisting = (existing, index) => {
  existing.splice(index, 1)
  return existing
}

const removeExtra = (existing, incoming, index) => {
  switch (true) {
    case (existing[index].quantity > incoming.quantity):
      existing[index].quantity -= incoming.quantity
      incoming.quantity = 0

      break
    case (incoming.quantity >= existing[index].quantity):
      incoming.quantity -= existing[index].quantity
      existing = removeExisting(existing, index)

      checkForExtra(existing, incoming)

      switch (true) {
        case (incoming.quantity > 0 && checkForMissing(existing, incoming)):
          existing = toBook(existing, incoming)

          break
      }
      break
  }
  return existing
}

const checkForExtra = (existing, incoming) => {
  for (let x = 0; x < existing.length; x++) {
    if (existing[x].type !== incoming.type) {
      existing = removeExtra(existing, incoming, x)
    }

  }
}

const checkForMissing = (existing, incoming) => {
  for (let object of existing) {
    if (object.price === incoming.price && object.quantity === incoming.quantity) {
      return false
    }
  }
  return true
}

module.exports = reconcileOrder