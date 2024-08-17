// 在读取之前强制刷新或确认数据
let storedIds = JSON.parse($persistentStore.read("idsToReplace") || "{}");

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

        if (!storedIds.productId) {  // 使用更明确的条件检查
            $persistentStore.write(JSON.stringify(ids), "idsToReplace");
            console.log("First set of IDs stored: " + JSON.stringify(ids));
            $notification.post("第一次ID存储", "成功存储以下ID为待替换ID:", `产品ID: ${ids.productId}, 可用性ID: ${ids.availabilityId}, SKU ID: ${ids.skuId}`);
        } else {
            $persistentStore.write(JSON.stringify(ids), "idsToTarget");
            console.log("Second set of IDs stored: " + JSON.stringify(ids));
            $notification.post("第二次ID存储", "成功存储以下ID为目标替换ID:", `产品ID: ${ids.productId}, 可用性ID: ${ids.availabilityId}, SKU ID: ${ids.skuId}`);
        }
    }
    $done({});
} else {
    console.log("No response body found.");
    $notification.post("响应体未找到", "请检查请求类型或内容是否正确。", "");
    $done({});
}
}
