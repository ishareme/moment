function upload(Vue, data, callbackSuccess, callbackFail) {
    Vue.prototype.$axios.getUploadToken().then(res => {
        if (typeof data === 'string'){
            const token = res.data.upToken
            Vue.prototype.$axios.uploadBase64File(data, token).then(res => {
                if (res.status === 200){
                    callbackSuccess && callbackSuccess({
                        data: res.data,
                        result_url: `http://p89inamdb.bkt.clouddn.com/${res.data.key}`
                    })
                }
            }).catch((error) => {
                console.log(error)
                callbackFail && callbackFail({
                    error
                })
            })
        }
        else if (data instanceof FormData){
            data.append('token', res.data.upToken)
            data.append('key', `moment${Date.now()}${Math.floor(Math.random() * 100)}`)
            Vue.prototype.$axios.uploadFile(data).then(res => {
                if (res.status === 200){
                    callbackSuccess && callbackSuccess({
                        data: res.data,
                        result_url: `http://p89inamdb.bkt.clouddn.com/${res.data.key}`
                    })
                }
            }).catch((error) => {
                console.log(error)
                callbackFail && callbackFail({
                    error
                })
            })
        }
        else {
            const formdata = new FormData()
            formdata.append('token', res.data.upToken)
            formdata.append('file', data.file)
            formdata.append('key', `moment${Date.now()}${Math.floor(Math.random() * 100)}.${data.file.type.split('/')[1]}`)
            // 获取到凭证之后再将文件上传到七牛云空间
            Vue.prototype.axios.uploadFile(formdata).then(res => {
                if (res.status === 200){
                    callbackSuccess && callbackSuccess({
                        data: res.data,
                        result_url: `http://p89inamdb.bkt.clouddn.com/${res.data.key}`
                    })
                }
            }).catch((error) => {
                console.log(error)
                callbackFail && callbackFail({
                    error
                })
            })
        }

    })
}

export default upload
