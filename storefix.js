var body = $response.body;

// 确保响应体存在并且是一个有效的JSON字符串
if (body) {
  var obj = JSON.parse(body);

  // 检查并删除特定的events部分
  if (obj && obj.events && obj.events.cart) {
    delete obj.events;  // 删除整个events对象
  }

  // 返回修改后的响应体
  $done({body: JSON.stringify(obj)});
} else {
  // 如果响应体不存在，直接返回未修改的响应体
  $done({});
}
