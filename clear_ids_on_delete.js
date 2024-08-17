// 清空存储的ID
$persistentStore.write("", "idsToReplace");
$persistentStore.write("", "idsToTarget");

console.log("All stored IDs have been cleared due to bulk delete operation.");
$notification.post("购物车项目已删除", "所有相关ID已被清空。", "");

$done({});
