import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

//在路由中基于webpack实现组件的懒加载
const RegisterOne = r => require.ensure([], () => r(require('../pages/RegisterOne')), 'RegisterOne')
const RegisterTwo = r => require.ensure([], () => r(require('../pages/RegisterTwo')), 'RegisterTwo')
const Login = r => require.ensure([], () => r(require('../pages/Login')), 'Login')
const AppMain = r => require.ensure([], () => r(require('../pages/AppMain')), 'AppMain')
const Home = r => require.ensure([], () => r(require('../pages/Home')), 'Home')
const Moment = r => require.ensure([], () => r(require('../pages/Moment')), 'Moment')
const Me = r => require.ensure([], () => r(require('../pages/Me')), 'Me')
const User = r => require.ensure([], () => r(require('../pages/User')), 'User')
const Profile = r => require.ensure([], () => r(require('../pages/Profile')), 'Profile')
const Make = r => require.ensure([], () => r(require('../pages/Make')), 'Make')
const ReadingArticle = r => require.ensure([], () => r(require('../pages/article/reading')), 'ReadingArticle')
const FilmArticle = r => require.ensure([], () => r(require('../pages/article/film')), 'FilmArticle')
const MusicArticle = r => require.ensure([], () => r(require('../pages/article/music')), 'MusicArticle')
const SoundArticle = r => require.ensure([], () => r(require('../pages/article/sound')), 'SoundArticle')
const ReadingList = r => require.ensure([], () => r(require('../pages/list/reading')), 'ReadingList')
const FilmList = r => require.ensure([], () => r(require('../pages/list/film')), 'FilmList')
const MusicList = r => require.ensure([], () => r(require('../pages/list/music')), 'MusicList')
const SoundList = r => require.ensure([], () => r(require('../pages/list/sound')), 'SoundList')
const ImageList = r => require.ensure([], () => r(require('../pages/list/image')), 'ImageList')
const ReadingCollect = r => require.ensure([], () => r(require('../pages/collect/reading')), 'ReadingCollect')
const MusicCollect = r => require.ensure([], () => r(require('../pages/collect/music')), 'MusicCollect')
const FilmCollect = r => require.ensure([], () => r(require('../pages/collect/film')), 'FilmCollect')
const SoundCollect = r => require.ensure([], () => r(require('../pages/collect/sound')), 'SoundCollect')

const UserList = r => require.ensure([], () => r(require('../pages/list/user')), 'UserList')







export default new Router({
  routes: [
      {
          path: '/register1',
          name: 'register1',
          component: RegisterOne,
      },
      {
          path: '/register2',
          name: 'register2',
          component: RegisterTwo,
      },
      {
          path: '/login',
          name: 'login',
          component: Login,
      },
      {
          path: '/',
          name: 'AppMain',
          component: AppMain,
          redirect: 'home',
          children: [
              {
                  path: 'home',
                  name: 'all',
                  component: Home,
                  meta: {
                      title: 'Home',
                  }
              },
              {
                  path: 'moment',
                  name: 'moment',
                  component: Moment,
                  meta: {
                      title: 'Moment',
                  }
              },
              {
                  path: 'me',
                  name: 'me',
                  component: Me,
                  meta: {
                      title: 'Me',
                  }
              }
          ]
      },
      {
          path: '/profile',
          name: 'Profile',
          component: Profile,
      },
      {
          path: '/make',
          name: 'Make',
          component: Make,
      },
      {
          path: '/readinglist',
          name: 'ReadingList',
          component: ReadingList,
      },
      {
          path: '/reading/:id',
          name: 'ReadingArticle',
          component: ReadingArticle,
      },
      {
          path: '/filmlist',
          name: 'FilmList',
          component: FilmList,
      },
      {
          path: '/film/:id',
          name: 'FilmArticle',
          component: FilmArticle,
      },
      {
          path: '/musiclist',
          name: 'MusicList',
          component: MusicList,
      },
      {
          path: '/music/:id',
          name: 'MusicArticle',
          component: MusicArticle,
      },
      {
          path: '/soundlist',
          name: 'SoundList',
          component: SoundList,
      },
      {
          path: '/sound/:id',
          name: 'SoundArticle',
          component: SoundArticle,
      },
      {
          path: '/imagelist',
          name: 'ImageList',
          component: ImageList,
      },
      {
          path: '/user',
          name: 'User',
          component: User,
      },
      {
          path: '/userlist',
          name: 'UserList',
          component: UserList,
      },
      {
          path: '/readingcollect',
          name: 'ReadingCollect',
          component: ReadingCollect,
      },
      {
          path: '/musiccollect',
          name: 'MusicCollect',
          component: MusicCollect,
      },
      {
          path: '/filmcollect',
          name: 'FilmCollect',
          component: FilmCollect,
      },
      {
          path: '/soundcollect',
          name: 'SoundCollect',
          component: SoundCollect,
      },
  ]
})
