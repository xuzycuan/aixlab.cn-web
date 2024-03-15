import request from "@/http/request";
import tunnel from "@/http/tunnel";

export function checkConnect(username) {
    return new Promise((resolve, reject) => {
      tunnel.get('/client/user_login/' + username)
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  }

export function getProjectDetail(id) {
    return request.get("/project/detail?id=" + id)
}

export function getBlockList() {
    return request.get("/project/getBlockList")
}


export function getBlockDetail(id) {
    return request.get("/project/getBlockDetail?id=" + id)
}


export function projectSave(data) {
    return request.post("/project/save", data, {
        "Content-Type": "application/json"
    })
}


export function projectModel(id) {
    return request.get("/project/getModel?id=" + id)
}


export function projectTraining(data) {
    return request.post("/project/training", data, {
        "Content-Type": "application/json"
    })
}

export function stopProject(data) {
    return request.post("/project/stop", data, {
        "Content-Type": "application/json"
    })
}

export function getTrainResult(id) {
    return request.get("/project/trainRet?id="+id)
}

export function getTrainCheck() {
    return request.get("/project/checkTrain")
}


export function projectRun(data) {
    return request.post("/project/run", data, {
        "Content-Type": "application/json"
    })
}

export function getRunResult(id) {
    return request.get("/project/runRet?id="+id)
}

export function projectVal(data) {
    return request.post("/project/val", data, {
        "Content-Type": "application/json"
    })
}

export function getValResult(id) {
    return request.get("/project/valRet?id="+id)
}
export const pageSize = request.pageSize