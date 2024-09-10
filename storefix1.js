var body = $request.body;

// 确保请求体存在
if (body) {
  // 使用正则表达式匹配并替换isChallengeRequired值
  // 考虑"可能被转义的情况（如\"isChallengeRequired\":true）
  body = body.replace(/"isChallengeRequired"\s*:\s*true/g, '"isChallengeRequired": false');
  body = body.replace(/\\\"isChallengeRequired\\\"\s*:\\\s*true/g, '\\"isChallengeRequired\\": false');

  // 返回修改后的请求体
  $done({body: body});
} else {
  // 如果请求体不存在，直接放行未修改的请求
  $done({});
}
