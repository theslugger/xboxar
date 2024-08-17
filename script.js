// 从持久化存储读取第一次存储的ID
let firstStoredIds = $persistentStore.read("idsToReplace");

// 从持久化存储读取第二次存储的ID
let secondStoredIds = $persistentStore.read("idsToTarget");

// 检查是否存在响应体
if ($response.body) {
    let body = JSON.parse($response.body);
    if (body && body.cart && body.cart.lineItems && body.cart.lineItems.length > 0) {
        // 获取当前请求的产品、可用性和SKU ID
        let item = body.cart.lineItems[0];
        let ids = {
            productId: item.productId,
            availabilityId: item.availabilityId,
            skuId: item.skuId
        };

        if (!firstStoredIds) {
            // 如果第一次的ID尚未存储，存储这些ID为第一次的ID
            $persistentStore.write(JSON.stringify(ids), "idsToReplace");
            console.log("First set of IDs stored: " + JSON.stringify(ids));
            $notification.post("第一次ID存储", "成功存储以下ID为待替换ID:", `产品ID: ${ids.productId}, 可用性ID: ${ids.availabilityId}, SKU ID: ${ids.skuId}`);
        } else if (!secondStoredIds) {
            // 如果第一次的ID已经存储，而第二次的ID尚未存储，存储这些ID为第二次的ID
            $persistentStore.write(JSON.stringify(ids), "idsToTarget");
            console.log("Second set of IDs stored: " + JSON.stringify(ids));
            $notification.post("第二次ID存储", "成功存储以下ID为目标替换ID:", `产品ID: ${ids.productId}, 可用性ID: ${ids.availabilityId}, SKU ID: ${ids.skuId}`);
        } else {
            // 如果第一次和第二次的ID都已经存储，可能需要处理额外的逻辑或忽略此次操作
            console.log("Both sets of IDs are already stored. Ignoring this capture.");
        }
    }
    $done({});
} else {
    console.log("No response body found.");
    $notification.post("响应体未找到", "请检查请求类型或内容是否正确。", "");
    $done({});
}
