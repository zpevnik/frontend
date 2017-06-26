export const mapAuthorsToSelect = authors => {
  if (!authors) return []
  return authors.map(author => (
    {
      value: author.id,
      label: `${author.firstname} ${author.surname}`
    }
  ))
}

export const mapSongsToSelect = songs => {
  if (!songs) return []
  return songs.map(song => (
    {
      value: song.id,
      label: song.title
    }
  ))
}

export const mapVariantsToSelect = variants => {
  if (!variants) return []
  return variants.map(variant => (
    {
      value: variant.id,
      label: variant.title
    }
  ))
}