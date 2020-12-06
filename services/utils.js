import { format } from 'date-fns'

export default {
  maskDate(date) {
    return format(date, 'HH:mm:ss dd/MM/yy');
  }
}