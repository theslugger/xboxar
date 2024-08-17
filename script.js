console.log("Script started");

// 尝试读取已存储的ID
let storedIdsRaw = $persistentStore.read("idsToReplace");
let storedIds = storedIdsRaw ? JSON.parse(storedIdsRaw) : null;
console.log("Stored IDs: " + storedIdsRaw);

if ($response.body) {
    console.log("Response body found");
    try {
        let body = JSON.parse($response.body);
        if (body && body.cart && body.cart.lineItems && body.cart.lineItems.length > 0) {
            let item = body.cart.lineItems[0];
            let ids = {
                productId: item.productId,
                availabilityId: item.availabilityId,
                skuId: item.skuId
            };

            if (!storedIds || !storedIds.productId) {
                $persistentStore.write(JSON.stringify(ids), "idsToReplace");
                console.log("First set of IDs stored: " + JSON.stringify(ids));
                $notification.post("第一次ID存储", "成功存储以下ID为待替换ID:", `产品ID: ${ids.productId}, 可用性ID: ${ids.availabilityId}, SKU ID: ${ids.skuId}`);
            } else {
                $persistentStore.write(JSON.stringify(ids), "idsToTarget");
                console.log("Second set of IDs stored: " + JSON.stringify(ids));
                $notification.post("第二次ID存储", "成功存储以下ID为目标替换ID:", `产品ID: ${ids.productId}, 可用性ID: ${ids.availabilityId}, SKU ID: ${ids.skuId}`);
            }
        } else {
            console.log("No line items found in the cart");
            $notification.post("购物车数据错误", "购物车中没有找到条目", "");
        }
    } catch (e) {
        console.log("Error parsing response: " + e.toString());
        $notification.post("解析错误", "响应体解析失败", e.toString());
    }
    $done({});
} else {
    console.log("No response body found.");
    $notification.post("响应体未找到", "请检查请求类型或内容是否正确。", "");
    $done({});
}
