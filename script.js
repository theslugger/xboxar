let requestCount = $persistentStore.read("requestCount") || 0;
requestCount++;

// 检查是否存在响应体
if ($response.body) {
    let body = JSON.parse($response.body);
    if (body && body.cart && body.cart.lineItems && body.cart.lineItems.length > 0) {
        let item = body.cart.lineItems[0];
        let ids = {
            productId: item.productId,
            availabilityId: item.availabilityId,
            skuId: item.skuId
        };

        // 使用计数器作为键名
        $persistentStore.write(JSON.stringify(ids), "ids_" + requestCount);
        console.log("IDs stored for request " + requestCount + ": " + JSON.stringify(ids));
        $notification.post("ID存储", "成功存储以下ID (请求次数 " + requestCount + "):", `产品ID: ${ids.productId}, 可用性ID: ${ids.availabilityId}, SKU ID: ${ids.skuId}`);
        
        // 更新请求计数
        $persistentStore.write(requestCount.toString(), "requestCount");
    }
    $done({});
} else {
    console.log("No response body found.");
    $notification.post("响应体未找到", "请检查请求类型或内容是否正确。", "");
    $done({});
}
