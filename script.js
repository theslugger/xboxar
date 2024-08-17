// 尝试读取先前存储的ID
let storedIds = $persistentStore.read("idsToReplace");

// 检查是否存在请求体
if ($request.body) {
    let body = JSON.parse($request.body);
    // 确认请求体中包含必要的数据结构
    if (body && body.itemsToAdd && body.itemsToAdd.items && body.itemsToAdd.items.length > 0) {
        let item = body.itemsToAdd.items[0];
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
    } else {
        console.log("No items to add found in the request.");
        $notification.post("请求数据错误", "请求中没有找到要添加的项目。", "");
    }
    $done({});
} else {
​⬤
