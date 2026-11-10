# User flow - Tinh Hoa Việt

Tài liệu mô tả luồng người dùng của hệ thống Tinh Hoa Việt theo các route và giao diện hiện có, kết hợp nghiệp vụ được mô tả trong README.

## Quy ước

- **Hình tròn**: hành động của người dùng/hệ thống.
- **Hình chữ nhật**: màn hình hoặc giao diện.
- **Hình thoi**: điểm người dùng cần chọn hoặc quyết định.
- **Mũi tên liền**: luồng đi tiếp.
- **Mũi tên nét đứt**: quay lại màn trước/danh sách.

## 1. Luồng tổng thể hệ thống

```mermaid
flowchart TD
    start((Truy cập Tinh Hoa Việt)) --> home[Trang chủ giới thiệu]
    home --> role{Chọn vai trò}

    role -->|Du khách| touristHome[Giao diện khám phá du khách]
    role -->|Nghệ nhân| artisanAuth{Đã có tài khoản nghệ nhân}
    role -->|Quản trị viên| adminHome[Trang quản trị /admin]

    artisanAuth -->|Chưa có| artisanRegister[Giao diện đăng ký nghệ nhân]
    artisanRegister --> artisanSubmit((Gửi thông tin đăng ký))
    artisanSubmit --> artisanLogin[Giao diện đăng nhập]
    artisanAuth -->|Đã có| artisanLogin
    artisanLogin --> artisanValid{Đăng nhập thành công}
    artisanValid -->|Có| artisanDashboard[Không gian nghệ nhân]
    artisanValid -->|Không| artisanLogin

    touristHome --> explore((Tìm kiếm và khám phá))
    explore --> touristList[Danh sách nghệ nhân, làng nghề, sản phẩm, văn hóa, hoạt động]
    touristList --> touristDetail[Giao diện chi tiết nội dung]
    touristDetail --> touristAction{Chọn thao tác tiếp theo}
    touristAction -->|Xem tiếp| touristDetail
    touristAction -->|Lưu yêu thích| favorites[Giao diện nội dung yêu thích]
    touristAction -->|Đăng ký hoạt động| booking[Giao diện đăng ký trải nghiệm]
    touristAction -->|Tài khoản| touristAuth{Cần đăng nhập hay đăng ký}
    touristAuth -->|Đăng nhập| visitorLogin[Giao diện đăng nhập du khách]
    touristAuth -->|Tạo tài khoản| visitorRegister[Giao diện đăng ký du khách]
    visitorLogin --> visitorSuccess{Thông tin hợp lệ}
    visitorRegister --> visitorSuccess
    visitorSuccess -->|Có| touristHome
    visitorSuccess -->|Không| visitorLogin
    booking --> bookingSubmit((Gửi yêu cầu đăng ký))
    bookingSubmit --> bookingNotice[Thông báo đã nhận yêu cầu]

    artisanDashboard --> artisanContent((Tạo và cập nhật nội dung nghề))
    artisanContent --> artisanPublic[Hồ sơ, sản phẩm, câu chuyện, hoạt động]
    artisanPublic --> adminReview[Admin kiểm duyệt nội dung]
    adminReview --> approve{Nội dung được chấp nhận}
    approve -->|Có| touristList
    approve -->|Cần sửa| artisanPublic

    adminHome --> adminManage((Quản lý tài khoản và nội dung))
    adminManage --> adminModule[Giao diện quản lý theo phân hệ]
    adminModule --> adminUpdate((Duyệt, sửa, ẩn hoặc xóa nội dung))
    adminUpdate --> adminHome

    touristDetail -. Quay lại danh sách .-> touristList
    favorites -. Tiếp tục khám phá .-> touristHome
    bookingNotice -. Tiếp tục khám phá .-> touristHome
    artisanPublic -. Quay lại tổng quan .-> artisanDashboard
```

## 2. Luồng chi tiết - Du khách

```mermaid
flowchart TD
    start((Bắt đầu)) --> home[Giao diện du khách /tourist]
    home --> choose{Muốn làm gì}

    choose -->|Tìm kiếm| searchAction((Nhập từ khóa))
    searchAction --> search[Giao diện kết quả tìm kiếm]
    choose -->|Khám phá danh mục| categoryAction((Chọn danh mục))
    categoryAction --> list[Giao diện danh sách]
    list --> listKind{Danh mục nào}
    listKind -->|Nghệ nhân| artisans[Danh sách nghệ nhân]
    listKind -->|Làng nghề| villages[Danh sách làng nghề]
    listKind -->|Sản phẩm| products[Danh sách sản phẩm thủ công]
    listKind -->|Văn hóa| stories[Danh sách câu chuyện văn hóa]
    listKind -->|Trải nghiệm| activities[Danh sách hoạt động trải nghiệm]

    search --> detail[Giao diện chi tiết]
    artisans --> detail
    villages --> detail
    products --> detail
    stories --> detail
    activities --> detail

    detail --> next{Chọn thao tác}
    next -->|Xem nội dung| detail
    next -->|Lưu hoặc bỏ yêu thích| favoriteAction((Cập nhật danh sách yêu thích))
    favoriteAction --> favorites[Giao diện yêu thích]
    next -->|Xem hoạt động| activityDetail[Giao diện chi tiết hoạt động]
    activityDetail --> wantJoin{Muốn gửi đăng ký}
    wantJoin -->|Có| bookingForm[Giao diện form đăng ký]
    bookingForm --> submitBooking((Gửi thông tin đăng ký))
    submitBooking --> notice[Thông báo đã nhận đăng ký]
    wantJoin -->|Chưa| activityDetail
    next -->|Xem thông tin nghệ nhân| artisanDetail[Giao diện chi tiết nghệ nhân]
    artisanDetail --> wantContact{Muốn liên hệ hoặc đặt lịch}
    wantContact -->|Có| contactForm[Giao diện form liên hệ]
    contactForm --> contactAction((Gửi yêu cầu liên hệ))
    contactAction --> notice
    wantContact -->|Chưa| artisanDetail

    next -->|Quản lý thông tin cá nhân| profile[Giao diện hồ sơ du khách]
    next -->|Đăng nhập / đăng ký| authChoice{Đã có tài khoản}
    authChoice -->|Có| login[Giao diện đăng nhập]
    authChoice -->|Chưa| register[Giao diện đăng ký]
    login --> authResult{Thông tin hợp lệ}
    register --> authResult
    authResult -->|Có| home
    authResult -->|Không| login

    list -. Quay lại trang chủ .-> home
    detail -. Quay lại danh sách .-> list
    favorites -. Quay lại khám phá .-> home
    notice -. Tiếp tục khám phá .-> home
```

## 3. Luồng chi tiết - Nghệ nhân

```mermaid
flowchart TD
    start((Bắt đầu)) --> authChoice{Đã có tài khoản}
    authChoice -->|Chưa| register[Giao diện đăng ký nghệ nhân]
    register --> submitRegister((Gửi đăng ký))
    submitRegister --> login[Giao diện đăng nhập]
    authChoice -->|Có| login
    login --> valid{Đăng nhập thành công}
    valid -->|Không| login
    valid -->|Có| dashboard[Giao diện tổng quan nghệ nhân]

    dashboard --> choose{Chọn công việc}
    choose -->|Cập nhật hồ sơ| profile[Giao diện hồ sơ nghệ nhân]
    profile --> editProfile((Nhập hoặc sửa thông tin))
    editProfile --> saveProfile{Lưu thay đổi}
    saveProfile -->|Tiếp tục chỉnh sửa| profile
    saveProfile -->|Xong| dashboard

    choose -->|Quản lý sản phẩm| product[Giao diện thêm và quản lý sản phẩm]
    product --> enterProduct((Nhập tên, danh mục, giá, mô tả, hình ảnh))
    enterProduct --> productDecision{Tiếp tục thao tác}
    productDecision -->|Chỉnh sửa| product
    productDecision -->|Hoàn tất| submittedProduct((Gửi sản phẩm để quản lý))
    submittedProduct --> dashboard

    choose -->|Viết câu chuyện| story[Giao diện câu chuyện văn hóa]
    story --> enterStory((Nhập tiêu đề, thể loại, nội dung, media))
    enterStory --> storyDecision{Tiếp tục thao tác}
    storyDecision -->|Chỉnh sửa| story
    storyDecision -->|Hoàn tất| submittedStory((Gửi câu chuyện để quản lý))
    submittedStory --> dashboard

    choose -->|Quản lý trải nghiệm| experiences[Giao diện danh sách hoạt động]
    experiences --> experienceChoice{Chọn thao tác}
    experienceChoice -->|Tạo mới| createExperience[Giao diện tạo hoạt động]
    createExperience --> enterExperience((Nhập lịch, địa điểm, sức chứa, mô tả, ảnh))
    enterExperience --> saveChoice{Lưu dạng nào}
    saveChoice -->|Lưu nháp| draft((Lưu bản nháp trên trình duyệt))
    saveChoice -->|Đăng hoạt động| publish((Tạo hoạt động trên trình duyệt))
    draft --> experiences
    publish --> experiences
    experienceChoice -->|Xem, sửa hoặc xóa| manageExperience((Quản lý hoạt động))
    manageExperience --> experiences

    dashboard --> signOutChoice{Muốn đăng xuất}
    signOutChoice -->|Có| signOut((Đăng xuất))
    signOut --> login
    profile -. Quay lại tổng quan .-> dashboard
    product -. Quay lại tổng quan .-> dashboard
    story -. Quay lại tổng quan .-> dashboard
    experiences -. Quay lại tổng quan .-> dashboard
```

## 4. Luồng chi tiết - Quản trị viên

```mermaid
flowchart TD
    start((Truy cập /admin)) --> dashboard[Giao diện tổng quan quản trị]
    dashboard --> selectModule((Chọn phân hệ))
    selectModule --> module{Phân hệ cần quản lý}
    module -->|Tài khoản| accounts[Giao diện quản lý tài khoản]
    module -->|Nghệ nhân| artisans[Giao diện quản lý nghệ nhân]
    module -->|Nghề và làng nghề| crafts[Giao diện quản lý nghề truyền thống]
    module -->|Sản phẩm| products[Giao diện quản lý sản phẩm]
    module -->|Nội dung văn hóa| stories[Giao diện quản lý câu chuyện]
    module -->|Trải nghiệm| experiences[Giao diện quản lý hoạt động]
    module -->|Hình ảnh và video| media[Giao diện thư viện media]
    module -->|Đánh giá| reviews[Giao diện quản lý đánh giá]
    module -->|Báo cáo| reports[Giao diện kiểm duyệt nội dung vi phạm]

    accounts --> listAction((Tìm kiếm và lọc))
    artisans --> listAction
    crafts --> listAction
    products --> listAction
    stories --> listAction
    experiences --> listAction
    media --> listAction
    reviews --> listAction
    reports --> listAction
    listAction --> records[Danh sách bản ghi]
    records --> actionChoice{Cần xử lý gì}
    actionChoice -->|Thêm hoặc sửa| edit[Giao diện thêm hoặc chỉnh sửa]
    edit --> save((Lưu thay đổi))
    save --> records
    actionChoice -->|Duyệt| approveChoice{Chấp nhận nội dung}
    approveChoice -->|Chấp nhận| approve((Duyệt và hiển thị))
    approveChoice -->|Từ chối hoặc ẩn| hide((Từ chối hoặc ẩn nội dung))
    approve --> records
    hide --> records
    actionChoice -->|Khóa tài khoản| lock((Khóa hoặc mở khóa))
    lock --> records
    actionChoice -->|Xóa| deleteChoice{Xác nhận xóa}
    deleteChoice -->|Có| delete((Xóa bản ghi))
    deleteChoice -->|Không| records
    delete --> records

    records -. Quay lại tổng quan .-> dashboard
    edit -. Hủy và quay lại .-> records
```

## Ghi chú về phạm vi hiện tại

- Du khách có thể xem danh mục, tìm kiếm, lưu yêu thích và xem các trang chi tiết. Yêu thích, hồ sơ và một số tương tác được lưu trong `localStorage`.
- Form đăng ký hoạt động/liên hệ hiện thông báo kết quả trên giao diện; luồng này chưa thể hiện thành quy trình đặt chỗ, thanh toán hay điều phối tour trên backend.
- Nghệ nhân có các giao diện hồ sơ, sản phẩm, câu chuyện và hoạt động. Tạo hoạt động hiện được lưu trên trình duyệt; các giao diện hồ sơ/sản phẩm/câu chuyện chưa đồng nghĩa với việc dữ liệu đã được đồng bộ backend.
- Admin có các màn hình quản lý tài khoản, nghệ nhân, nghề, sản phẩm, nội dung, hoạt động, media, đánh giá và báo cáo. Dữ liệu/chức năng quản trị trong giao diện hiện là mẫu; route `/admin` hiện chưa có màn đăng nhập hay guard phân quyền.
- Mua bán trực tuyến và thanh toán không nằm trong phạm vi hiện tại.
