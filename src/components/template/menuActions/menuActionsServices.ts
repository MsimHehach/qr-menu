export type MenuActionItems = {
  title?: string
  hidden?: boolean
  items: {
    title: string
    icon?: string
    click?: () => void
    loading?: boolean
    disabled?: boolean
    hidden?: boolean
  }[]
}
