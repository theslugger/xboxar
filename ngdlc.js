// 检查是否存在请求体
if ($request.body) {
    let idsToReplace = JSON.parse($persistentStore.read("idsToReplace"));
    let idsToTarget = JSON.parse($persistentStore.read("idsToTarget"));
    
    console.log("Original Body: " + $request.body); // 打印原始请求体

    let modifiedBody = $request.body;

    // 定义一个递归函数来替换 JSON 对象中的 ID
    function replaceIds(obj) {
        for (let key in obj) {
            if (typeof obj[key] === 'object') {
                replaceIds(obj[key]);
            } else if (typeof obj[key] === 'string') {
                if (obj[key] === idsToReplace.productId) {
                    obj[key] = idsToTarget.productId;
                }
                if (obj[key] === idsToReplace.availabilityId) {
                    obj[key] = idsToTarget.availabilityId;
                }
                if (obj[key] === idsToReplace.skuId) {
                    obj[key] = idsToTarget.skuId;
                }
            }
        }
    }

    try {
        // 尝试将请求体解析为 JSON
        var bodyJson = JSON.parse($request.body);

        // 如果解析成功，替换 JSON 对象中的 ID
        replaceIds(bodyJson);

        modifiedBody = JSON.stringify(bodyJson);

    } catch(e) {
        // 如果解析失败，认为请求体是 URL 编码的表单数据

        // 分割请求体为键值对
        let params = $request.body.split('&');
        let newParams = [];

        for (let param of params) {
            let [key, value] = param.split('=');
            value = decodeURIComponent(value);

            // 如果键是 'data'，并且值是 JSON 字符串，替换其中的 ID
            if (key === 'data') {
                try {
                    let dataJson = JSON.parse(value);
                    replaceIds(dataJson);
                    value = encodeURIComponent(JSON.stringify(dataJson));
                } catch(e) {
                    // 如果 data 不是 JSON，跳过
                    value = encodeURIComponent(value);
                }
            } else {
                // 替换值中的 ID
                value = value
                    .replace(new RegExp(idsToReplace.productId, 'g'), idsToTarget.productId)
                    .replace(new RegExp(idsToReplace.availabilityId, 'g'), idsToTarget.availabilityId)
                    .replace(new RegExp(idsToReplace.skuId, 'g'), idsToTarget.skuId);
                value = encodeURIComponent(value);
            }

            newParams.push(`${key}=${value}`);
        }

        modifiedBody = newParams.join('&');
    }

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
