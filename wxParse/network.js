const API_URL = 'https://fruits-api.hnjxwl.com/api/';

let requestHandler = {
  url:"",
  params:{},
  success:(res)=>{
    //success
  },
  fail:()=>{
    //fail
  }
}


function GET(requestHandler){
  request('GET', requestHandler)
}

function POST(requestHandler){
  request('POST', requestHandler)
}


function request(method, requestHandler){
  let params = requestHandler.params;
  let url = requestHandler.url;

  wx.request({
    url: API_URL+url,
    data: params,
    method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: function (res) {
      //注意：可以对参数解密等处理
      requestHandler.success(res)
    },
    fail: function () {
      requestHandler.fail()
    },
    complete: function () {
      // complete
    }
  })
}

module.exports = {
  GET: GET,
  POST: POST
}