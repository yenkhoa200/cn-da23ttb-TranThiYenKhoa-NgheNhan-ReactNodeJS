const jwt = require("jsonwebtoken");

function requireArtisan(req, res, next) {
  const authorization = req.get("authorization") || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Vui lòng đăng nhập để tải tệp lên.",
    });
  }

  if (!process.env.JWT_SECRET) {
    return next(new Error("JWT_SECRET chưa được cấu hình."));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const role = typeof payload === "object" ? payload.role : null;
    const accountId = typeof payload === "object" ? Number(payload.sub) : NaN;

    if (!Number.isSafeInteger(accountId) || accountId <= 0) {
      return res.status(401).json({
        success: false,
        message: "Phiên đăng nhập không hợp lệ.",
      });
    }

    if (typeof role !== "string" || role.toUpperCase() !== "NGHE_NHAN") {
      return res.status(403).json({
        success: false,
        message: "Chỉ nghệ nhân mới được tải tư liệu sản phẩm.",
      });
    }

    req.user = { id: accountId };
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.",
      });
    }

    return next(error);
  }
}

module.exports = requireArtisan;
