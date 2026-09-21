// Keeps the API's JSON shape identical to Milestone 2 (id, not _id) so the
// React client — which already expects { id, name, ... } — needs no changes
// now that the data is coming from MongoDB instead of an in-memory array.
export function toDTO(doc) {
  if (!doc) return null;
  const plain = doc.toObject ? doc.toObject() : doc;
  const { _id, ...rest } = plain;
  return { id: _id, ...rest };
}

export function toDTOList(docs) {
  return docs.map(toDTO);
}
