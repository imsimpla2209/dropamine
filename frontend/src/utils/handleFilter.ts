export const handleFilter = (sortType: any, key?: any) => {
  let temp = sortType

  switch (temp) {
    case 'new':
      return 'tab=new'
    case 'hot':
      return 'tab=hot'
    case 'best':
      return 'tab=best'
    case 'oldest':
      return 'tab=oldest'
    case 'worst':
      return 'tab=worst'
    case 'keyword':
      return `keyword=${key.replace(' ', '-')}`
    default:
      break
  }
}
