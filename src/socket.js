import { io } from 'socket.io-client'

function URL() {
   if (process.env.NODE_ENV === "development") {
      return "http://localhost:8080/"
   } else {
      return "/"
   }
}
var socket = io(URL(), {
   withCredentials: true
})

export default socket