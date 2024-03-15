import request from "@/http/request";


export   function getUserUngrant(cuswareId,level){
    return request.get("/courseware/ungrant/list?id="+cuswareId+"&level="+level)
}

export   function getUserGranted(cuswareId,level){
    return request.get("/courseware/grant/list?id="+cuswareId+"&level="+level)
}

export   function commitUserGrant(cuswareId, level, userId){
    return request.get("/courseware/grant/commit?id="+cuswareId+"&level="+level+"&user_id="+userId)
}
