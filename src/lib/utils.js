export const convertSongToJson = song => (
  {
    'title': song.title,
    'text': song.text,
    'authors': song.authors,
    'interpreters': song.interpreters
  }
)
