// 尝试读取并增加请求计数
let requestCount = parseInt($persistentStore.read("requestCount") || "0", 10);
requestCount++;

// 检查是否存在请求体
if ($request.body) {
    let body = JSON.parse($request.body);
    if (body.itemsToAdd && body.itemsToAdd.items && body.itemsToAdd.items.length > 0) {
        let item = body.itemsToAdd.items[0];
        if (item.productId && item.availabilityId && item.skuId) {
            let ids = {
                productId: item.productId,
                availabilityId: item.availabilityId,
                skuId: item.skuId
            };

            // 使用计数器作为键名存储IDs
            let key = "ids_" + requestCount;
            $persistentStore.write(JSON.stringify(ids), key);
            console.log("IDs stored for request " + requestCount + ": " + JSON.stringify(ids));

            // 发送存储成功的通知
            $notification.post("ID存储", "成功存储以下ID (请求次数 " + requestCount + "):", `产品ID: ${ids.productId}, 可用性ID: ${ids.availabilityId}, SKU ID: ${ids.skuId}`);

            // 更新请求计数
            $persistentStore.write(requestCount.toString(), "requestCount");
            console.log("Request count updated to: " + requestCount);
        } else {
            console.log("Required IDs are missing in the request.");
            $notification.post("请求数据不完整", "请求中缺少必要的产品ID、可用性ID或SKU ID。", "");
        }
    } else {
        console.log("No items to add found in the request.");
        $notification.post("请求数据错误", "请求中没有找到要添加的项目。", "");
    }
    $done({});
} else {
    console.log("No request body found.");
    $notification.post("请求体未找到", "请检查请求类型或内容是否正确。", "");
    $done({});
}
