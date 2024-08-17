// 尝试读取先前存储的ID
let storedIds = $persistentStore.read("idsToReplace");

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

        if (!storedIds) {
            // 如果没有先前的ID，存储当前的ID作为待替换ID
            $persistentStore.write(JSON.stringify(ids), "idsToReplace");
            console.log("First set of IDs stored: " + JSON.stringify(ids));
            $notification.post("第一次ID存储", "成功存储以下ID为待替换ID:", `产品ID: ${ids.productId}, 可用性ID: ${ids.availabilityId}, SKU ID: ${ids.skuId}`);
        } else {
            // 如果已经有存储的ID，使用新变量来存储当前ID作为目标替换ID
            let item1 = item;  // 这行实际上是多余的，因为item已经包含了需要的信息
            let ids1 = ids;  // 直接使用ids即可
            $persistentStore.write(JSON.stringify(ids1), "idsToTarget");
            console.log("Second set of IDs stored: " + JSON.stringify(ids1));
            $notification.post("第二次ID存储", "成功存储以下ID为目标替换ID:", `产品ID: ${ids1.productId}, 可用性ID: ${ids1.availabilityId}, SKU ID: ${ids1.skuId}`);
        }
    }
    $done({});
} else {
    console.log("No response body found.");
    $notification.post("响应体未找到", "请检查请求类型或内容是否正确。", "");
    $done({});
}
