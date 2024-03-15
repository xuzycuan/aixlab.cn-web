import request from "@/http/request";


export   function getCuswareList(page, cusId){
    let data = {
        pageNo:page,
        pageSize: request.pageSize,
        courseId: cusId
    }
    return request.post("/courseware/list",data,{
        headers:{
            "Content-Type":"application/json"
        }
    })
}

export   function createCusware(data){
    let jsonData = {
        courseId: data.courseId,
        name: data.name,
        file: data.file
    }
    return request.post("/courseware/create", jsonData, {
        "Content-Type":"application/json"
    })
}

export   function deleteCusware(id){
    return request.get("/courseware/delete?id="+id)
}

export const  pageSize = request.pageSize