let routes = [];

const sessionKey = "m_transition"

let sessionRoutes = sessionStorage.getItem(sessionKey);

if(sessionRoutes){
    routes = JSON.parse(sessionRoutes);
}

let direction = 1;

function syncSessionRoutes(){
    sessionStorage.setItem(sessionKey,JSON.stringify(routes));
}

let replaceFlag = false;

export default function(router){
    let oldReplace = router.replace;
    router.replace = function(location,onComplete,onAbort){
        replaceFlag = true;
        oldReplace.replace.call(router,location,onComplete,onAbort)
    }

    router.afterEach((to,from)=>{
        let key = to.fullPath;
        if(replaceFlag){
            direction = 1;
            routes.splice(routes.length-1,1,key);
        }else{
            let index = routes.lastIndexOf(key);
            if(index === -1){
                direction = 1;
                routes.push(key);
            }else{
                direction = -1;
                routes.splice(index+1,routes.length-1-index);
            }
        }

        replaceFlag = false;
        syncSessionRoutes();

    });

}

export {
    direction,
}
