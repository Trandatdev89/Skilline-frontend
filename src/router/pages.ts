

const Pages = {
    layoutDefault: {name:'layout-default',path:'/'},
    home : {name:'home',path:'/'},
    about : {name:'about',path:'/about'},
    feedback : {name:'feedback',path:'/feedback'},
    login : {name:'login',path:'/login'},
    logout : {name:'logout',path:'/logout'},
    fobiden : {name:'fobiden',path:'/fobiden'},
    notfound : {name:'notfound',path: '/:pathMatch(.*)*',},
    register : {name:'register',path:'/register'},
    post : {name:'post',path:'/post'},
    course : {name:'course',path:'/course'},
    lecture : {name:'lecture',path:'/lecture'},
    order : {name:'order',path:'/order'},
    cart : {name:'cart',path:'/cart'},
    resultPage : {name:'resultPage',path:'/result-page'},
    category : {name:'category',path:'/category'},
    bought : {name:'bought',path:'/bought'},
    blog: {name:'blog',path:'/blog'},
    info:{name:'info',path:'/info'},

    //Teacher:
    manageQuiz:{name:'manage-quiz',path:'/admin/quiz'},

    //ADMIN:
    layoutAdmin:{name:'layout-admin',path:'/admin/dashboard'},
    dashboard:{name:'dashboard',path:'/admin/dashboard'},
    manageCourses:{name:'manage-courses',path:'/admin/courses'},
    manageOrder:{name:'manage-order',path:'/admin/order'},
    manageCategory:{name:'manage-category',path:'/admin/category'},
    setting:{name:'setting',path:'/admin/setting'},
    manageLecture : {name:'manage-lecture',path:'/admin/lecture'},
}

export default Pages;