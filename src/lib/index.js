export const mapAuthorsToSelect = authors => {
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

export const convertSongToJson = song => (
  {
    'title': song.title,
    'text': song.text,
    'authors': song.authors,
    'interpreters': song.interpreters
  }
)
