export const formatDateDDMMYYYY = (dateString: string): string => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export const parseDDMMYYYY = (dateString: string): Date => {
  const [day, month, year] = dateString.split("/").map(Number)
  return new Date(year, month - 1, day)
}

export const isDateInRange = (date: string, startDate: string, endDate: string): boolean => {
  const checkDate = new Date(date).getTime()
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  return checkDate >= start && checkDate <= end
}
