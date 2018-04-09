export const convertSongToJson = song => (
  {
    'title': song.title,
    'text': song.text,
    'authors': song.authors,
    'interpreters': song.interpreters,
    'visibility': song.visibility
  }
)

export const isSongEditable = (song, user) => {
  return song.owner === user.id
}

export const getSongsOwnerName = (song, users) => {
  if (!song.owner) {
    return ''
  }
  const owner = users.find(user => user.id === song.owner)
  if (!owner) {
    return ''
  } else {
    return owner.name
  }
}