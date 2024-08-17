// 检查是否存在请求体
if ($request.body) {
    let idsToReplace = JSON.parse($persistentStore.read("idsToReplace"));
    let idsToTarget = JSON.parse($persistentStore.read("idsToTarget"));
    
    console.log("Original Body: " + $request.body); // 打印原始请求体

    // 执行替换操作
    var modifiedBody = $request.body
        .replace(new RegExp(idsToReplace.productId, 'g'), idsToTarget.productId)   // 替换产品ID
        .replace(new RegExp(idsToReplace.availabilityId, 'g'), idsToTarget.availabilityId)  // 替换可用性ID
        .replace(new RegExp(idsToReplace.skuId, 'g'), idsToTarget.skuId);                // 替换 SKU ID

    console.log("Modified Body: " + modifiedBody); // 打印修改后的请求体

    // 发送通知
    $notification.post("请求修改成功", "请求体已根据目标ID修改", "");

    // 完成修改并返回修改后的请求体
    $done({body: modifiedBody});
} else {
    console.log("No request body found.");
    $notification.post("请求体未找到", "请检查请求类型或内容是否正确。", "");
    $done({});
}
