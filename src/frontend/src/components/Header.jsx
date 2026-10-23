import React from "react";

export default function ArtisanHeader() {
  return (
    <header className="artisan-top-nav">
      <div className="brand-box">
        <div className="logo-square">H</div>
        <div>
          <strong>Tinh Hoa Việt</strong>
          <small>Nền tảng di sản - Tinh hoa tương lai</small>
        </div>
      </div>
      <div className="top-nav-right">
        <span className="nav-link-item">Cộng đồng</span>
        <span className="nav-link-item">Tài liệu hướng dẫn</span>
        <span className="bell-icon">🔔</span>
        <div className="hotline-pill">
          <span>📞</span> Gọi trợ giúp ngay: <strong>1900 8888</strong>
        </div>
      </div>
    </header>
  );
}