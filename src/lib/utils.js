export const convertSongToJson = song => (
  {
    'title': song.title,
    'text': song.text,
    'authors': song.authors,
    'interpreters': song.interpreters
  }
)

export const isSongEditable = (song, user) => {
  return song.edit_perm === 2 ||
    (song.edit_perm === 1 && song.owner_unit === user.unit) ||
    (song.edit_perm === 0 && song.owner === user.id)
}