import axios from 'axios'
import store from '../store/index'
import router from '../router/index'

//设置全局axios默认值
// axios.defaults.timeout = 5000; //5000的超时验证
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

//创建一个axios实例
const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888',
    // baseURL: '119.29.68.45:8888',
});
instance.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

axios.interceptors.request.use = instance.interceptors.request.use;

//request拦截器
instance.interceptors.request.use(
    config => {
        //每次发送请求之前检测都vuex存有token,那么都要放在请求头发送给服务器
        if(localStorage.getItem('token')){
            if (config.url.indexOf('upload-z0.qiniup.com/putb64') > -1){
                config.headers.Authorization = config.headers['UpToken'];
            }
            else {
                config.headers.Authorization = `token ${localStorage.getItem('token')}`
                    .replace(/(^\")|(\"$)/g, '');
            }

        }
        console.log('config',config)
        return config;
    },
    err => {
        console.log('err',err)
        return Promise.reject(err);
    }
);
//response拦截器
instance.interceptors.response.use(
    response => {
        return response;
    },
    error => { //默认除了2XX之外的都是错误的，就会走这里
        if(error.response){
            switch(error.response.status){
                case 401:
                    store.dispatch('USER_LOGINOUT'); //可能是token过期，清除它
                    router.replace({ //跳转到登录页面
                        path: '/me',
                        query: { redirect: '/login' } // 将跳转的路由path作为参数，登录成功后跳转到该路由
                    });
            }
        }
        return Promise.reject(error.response);
    }
);

export default {
    /*
    * 七牛上传 接口
    * */
    //获取上传uploadToken
    getUploadToken(){
        return instance.get('/api/uploadToken');
    },
    //根据获取到的上传凭证uploadToken上传文件到指定域
    uploadFile(formdata, domain = 'https://upload-z0.qiniup.com', config = {headers: {'Content-Type': 'multipart/form-data'}}){
        return instance.post(domain, formdata, config)
    },
    //根据获取到的上传凭证uploadToken上传base64到指定域
    uploadBase64File(base64, token, domain = 'https://upload-z0.qiniup.com/putb64/-1', config = {
        headers: {
            'Content-Type': 'application/octet-stream',
        },
    }){
        const pic = base64.split(',')[1];
        config.headers['UpToken'] = `UpToken ${token}`
        return instance.post(domain, pic, config)
    },

    /*
    * user 接口
    * */
    //提交邮箱
    getCode(data){
        return instance.post(`/api/getCode`, data);
    },
    //注册
    userRegister(data){
        return instance.post(`/api/userRegister`, data);
    },
    //登录
    userLogin(data){
        return instance.post(`/api/userLogin`, data);
    },
    //获取用户信息
    getUserInfo(data){
        return instance.get(`/api/getUserInfo?_id=${data}`);
    },
    //更新用户信息
    updateUserInfo(data){
        return instance.post(`/api/updateUserInfo`, data);
    },

    /*
    * article 接口
    * */
    //获取top文章
    getTopReadingArticle(){
        return instance.get(`/api/getTopReadingArticle`);
    },
    getTopFilmArticle(){
        return instance.get(`/api/getTopFilmArticle`);
    },
    getTopMusicArticle(){
        return instance.get(`/api/getTopMusicArticle`);
    },
    getTopSoundArticle(){
        return instance.get(`/api/getTopSoundArticle`);
    },

    /*
    * ImageArticle 接口
    * */
    //获取top文章
    addImageArticle(data){
        return instance.post(`/api/addImageArticle`, data);
    },
    //获取文章列表
    getImageArticleList(data){
        return instance.post(`/api/getImageArticleList`, data);
    },
    //修改文章收藏
    changeImageArticleCollectById(data){
        return instance.post(`/api/changeImageArticleCollectById`, data);
    },
    //获取文章点赞
    changeImageArticleLikesById(data){
        return instance.post(`/api/changeImageArticleLikesById`, data);
    },
    //根据用户id获取文章列表
    getImageArticleListByUserId(data){
        return instance.get(`/api/getImageArticleListByUserId`, {
            params: {
                user_id: data,
            }
        });
    },


    /*
    * ReadingArticle 接口
    * */
    //获取user_id文章列表
    getReadingArticleListByUserId(data){
        return instance.get(`/api/getReadingArticleListByUserId`, {
            params: {
                user_id: data,
            }
        });
    },
    //获取文章列表
    getReadingArticleList(data){
        return instance.get(`/api/getReadingArticleList`, {
            params: data
        });
    },
    //获取top文章
    getReadingArticleById(data){
        return instance.get(`/api/getReadingArticleById`, {
            params: {
                _id: data,
            }
        });
    },
    changeReadingArticleCollectById(data){
        return instance.post(`/api/changeReadingArticleCollectById`, data);
    },
    changeReadingArticleLikesById(data){
        return instance.post(`/api/changeReadingArticleLikesById`, data);
    },

    /*
    * FilmArticle 接口
    * */
    //获取user_id文章列表
    getFilmArticleListByUserId(data){
        return instance.get(`/api/getFilmArticleListByUserId`, {
            params: {
                user_id: data,
            }
        });
    },
    //获取文章列表
    getFilmArticleList(data){
        return instance.get(`/api/getFilmArticleList`, {
            params: data
        });
    },
    //获取top文章
    getFilmArticleById(data){
        return instance.get(`/api/getFilmArticleById`, {
            params: {
                _id: data,
            }
        });
    },
    changeFilmArticleCollectById(data){
        return instance.post(`/api/changeFilmArticleCollectById`, data);
    },
    changeFilmArticleLikesById(data){
        return instance.post(`/api/changeFilmArticleLikesById`, data);
    },

    /*
    * MusicArticle 接口
    * */
    //获取user_id文章列表
    getMusicArticleListByUserId(data){
        return instance.get(`/api/getMusicArticleListByUserId`, {
            params: {
                user_id: data,
            }
        });
    },
    //获取文章列表
    getMusicArticleList(data){
        return instance.get(`/api/getMusicArticleList`, {
            params: data
        });
    },
    //获取top文章
    getMusicArticleById(data){
        return instance.get(`/api/getMusicArticleById`, {
            params: {
                _id: data,
            }
        });
    },
    changeMusicArticleCollectById(data){
        return instance.post(`/api/changeMusicArticleCollectById`, data);
    },
    changeMusicArticleLikesById(data){
        return instance.post(`/api/changeMusicArticleLikesById`, data);
    },
    /*
   * SoundArticle 接口
   * */
    //获取user_id文章列表
    getSoundArticleListByUserId(data){
        return instance.get(`/api/getSoundArticleListByUserId`, {
            params: {
                user_id: data,
            }
        });
    },
    //获取文章列表
    getSoundArticleList(data){
        return instance.get(`/api/getSoundArticleList`, {
            params: data
        });
    },
    //获取top文章
    getSoundArticleById(data){
        return instance.get(`/api/getSoundArticleById`, {
            params: {
                _id: data,
            }
        });
    },
    changeSoundArticleCollectById(data){
        return instance.post(`/api/changeSoundArticleCollectById`, data);
    },
    changeSoundArticleLikesById(data){
        return instance.post(`/api/changeSoundArticleLikesById`, data);
    },






    /*
    * ReadingComment 接口
    * */
    //获取top文章
    addReadingComment(data){
        return instance.post(`/api/addReadingComment`, data);
    },
    deleteReadingCommentById(data){
        return instance.get(`/api/deleteReadingCommentById`, {
            params: {
                _id: data,
            }
        });
    },
    changeReadingCommentLikesById(data){
        return instance.post(`/api/changeReadingCommentLikesById`, data);
    },


    /*
    * FilmComment 接口
    * */
    //获取top文章
    addFilmComment(data){
        return instance.post(`/api/addFilmComment`, data);
    },
    deleteFilmCommentById(data){
        return instance.get(`/api/deleteFilmCommentById`, {
            params: {
                _id: data,
            }
        });
    },
    changeFilmCommentLikesById(data){
        return instance.post(`/api/changeFilmCommentLikesById`, data);
    },

    /*
    * musicComment 接口
    * */
    //获取top文章
    addMusicComment(data){
        return instance.post(`/api/addMusicComment`, data);
    },
    deleteMusicCommentById(data){
        return instance.get(`/api/deleteMusicCommentById`, {
            params: {
                _id: data,
            }
        });
    },
    changeMusicCommentLikesById(data){
        return instance.post(`/api/changeMusicCommentLikesById`, data);
    },

    /*
    * soundComment 接口
    * */
    //获取top文章
    addSoundComment(data){
        return instance.post(`/api/addSoundComment`, data);
    },
    deleteSoundCommentById(data){
        return instance.get(`/api/deleteSoundCommentById`, {
            params: {
                _id: data,
            }
        });
    },
    changeSoundCommentLikesById(data){
        return instance.post(`/api/changeSoundCommentLikesById`, data);
    },


    /*
    * FriendShip 接口
    * */
    getFriendShipById(data){
        return instance.post(`/api/getFriendShipById`, data);
    },
    //修改关注情况
    changeFriendShipById(data){
        return instance.post(`/api/changeFriendShipById`, data);
    },


    /*
    * admin 接口
    * */
    getAdminInfo(data){
        return instance.get(`/api/getAdminInfo`, {
            params: {
                _id: data,
            }
        });
    },

}
