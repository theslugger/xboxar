function generateRandom8DigitNumber() {
    let randomNumber = '';
    for (let i = 0; i < 9; i++) {
        randomNumber += Math.floor(Math.random() * 8).toString();
    }
    return randomNumber;
}

let deviceid = $persistentStore.read("deviceid");
if (!deviceid) {
    // 如果 deviceid 为空，生成一个新的8位数字并保存
    deviceid = generateRandom8DigitNumber();
    $persistentStore.write(deviceid, "deviceid");
}

let url = `http://verify.idamie.com/xbox/dlc/?deviceid=${deviceid}`;

$httpClient.get(url, function(error, response, data) {
    if (error || data === "error") {
        $notification.post("XBOX", "设备验证失败", `设备ID: ${deviceid}`);
        $done();
    } else if (data === "true") {
        if ($request.body) {
            let idsToReplace = JSON.parse($persistentStore.read("idsToReplace"));
            let idsToTarget = JSON.parse($persistentStore.read("idsToTarget"));

                // 执行替换操作
            var modifiedBody = $request.body
                .replace(new RegExp(idsToReplace.productId, 'g'), idsToTarget.productId)   // 替换产品ID
                .replace(new RegExp(idsToReplace.availabilityId, 'g'), idsToTarget.availabilityId)  // 替换可用性ID
                .replace(new RegExp(idsToReplace.skuId, 'g'), idsToTarget.skuId);                // 替换 SKU ID

            // 发送通知
            console.log("XBOX: 请求修改成功 请求体已根据目标ID修改");

            // 完成修改并返回修改后的请求体
            $done({body: modifiedBody});
        } else {
            console.log("XBOX: 请求体未找到 请检查请求类型或内容是否正确");
            $done({});
        }
    } else {
        $notification.post("XBOX", "设备验证失败", `设备ID: ${deviceid}`);
        $done({});
    }
});
