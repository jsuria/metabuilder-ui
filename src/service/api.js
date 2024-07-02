/* import axios from 'axios'
import queries from '@/config/queries'
import { API_BASE_URL, API_SEARCH_IMAGES, 
        AUTH_LOGIN_URL, AUTH_TOKEN_REFRESH_URL } from '@/config/endpoints';
 */

import image_listing from '@/service/images-listing.json';

/* axios.interceptors.request.use(config => {
    var token = sessionStorage.getItem('access_token');
    config.headers = {
      Authorization: `JWT ${token}`
    };

    config.baseURL = `${API_BASE_URL}/`;
    
    return config;
});
 */
export default {

    async getMockImages(){
        return image_listing
    },

   /*  async login(userName, passWord, rememberMe){
        const payload = {
            params: {
                username: userName,
                password: passWord,
                rememberMe: rememberMe
            },
        }
        return axios.post(`${AUTH_LOGIN_URL}`, payload)
    },

    async getImages(){
        const payload = {
            params: {
                q: queries.drawing,
                page_size: 300,
                page_from: 0 
            },
        }

        return axios.get(`${API_SEARCH_IMAGES}`, payload)
    },

    getAuthToken(){
        return sessionStorage.getItem('mb_auth_token')
    },

    async refreshToken(){
        const payload = {
            params: {
                token: this.getAuthToken(),
            },
        }
        return axios.post(`${AUTH_TOKEN_REFRESH_URL}`, payload)
    }, */


}