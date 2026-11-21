export async function readApiResponse(response) {
  const body = await response.text();
  if (!body.trim()) {
    throw new Error(
      `Máy chủ trả về phản hồi rỗng (HTTP ${response.status}). Hãy kiểm tra backend và kết nối cơ sở dữ liệu.`,
    );
  }

  let result;
  try {
    result = JSON.parse(body);
  } catch {
    throw new Error(
      `Máy chủ trả về dữ liệu không phải JSON (HTTP ${response.status}). Hãy kiểm tra backend.`,
    );
  }

  if (!response.ok || !result.success) {
    throw new Error(result.message || `Yêu cầu không thành công (HTTP ${response.status}).`);
  }
  return result.data;
}
