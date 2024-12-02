import axios from 'axios'

const api = axios.create({
    baseURL: 'http://ec2-54-91-215-149.compute-1.amazonaws.com/api',
    auth: {
        username: "psAdmin",
        password: "goledger"
      }
  });
  
  export default api;