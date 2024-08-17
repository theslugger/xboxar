// 尝试读取先前存储的ID
let storedIds = $persistentStore.read("idsToReplace");

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

        if (!storedIds) {
            // 如果没有先前的ID，存储当前的ID作为待替换ID
            $persistentStore.write(JSON.stringify(ids), "idsToReplace");
            console.log("First set of IDs stored: " + JSON.stringify(ids));
            $notification.post("第一次ID存储", "成功存储以下ID为待替换ID:", `产品ID: ${ids.productId}, 可用性ID: ${ids.availabilityId}, SKU ID: ${ids.skuId}`);
        } else {
            // 如果已经有存储的ID，将当前ID存储为目标替换ID
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
