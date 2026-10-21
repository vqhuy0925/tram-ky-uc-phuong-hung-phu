/**
 * TRẠM KÝ ỨC - MẸ VIỆT NAM ANH HÙNG PHƯỜNG HƯNG PHÚ, THÀNH PHỐ CẦN THƠ
 * 
 * Lưu ý địa giới hành chính:
 * - Thực hiện theo mô hình chính quyền 2 cấp của Thành phố Cần Thơ (Thành phố -> Phường/Xã, không sử dụng cấp quận).
 * - Các phường trực thuộc Thành phố Cần Thơ: Phường Hưng Phú...
 * 
 * ĐỢT 1: 7 Bà Mẹ Việt Nam Anh Hùng
 * Nguồn tư liệu: Hồ sơ lưu trữ và giấy chứng nhận danh hiệu vinh dự Nhà nước Bà mẹ VNAH.
 */

const MOTHERS_DATA = [
  {
    id: 1,
    stt: 1,
    name: "VÕ THỊ BA",
    title: "Truy tặng",
    birth_death: "1916 - 2003",
    status: "Đã từ trần",
    has_portrait: false,
    batch: "Đợt 1",
    batch_num: 1,
    hometown: "Xã Phú An, huyện Châu Thành, tỉnh Hậu Giang",
    decision: "Mẹ được truy tặng theo Quyết định số 3168/QĐ-CTN ngày 08/12/2014 của Chủ tịch nước Cộng hòa xã hội chủ nghĩa Việt Nam",
    relatives: [
      { name: "Phạm Văn Dài", relation: "con", sacrifice_date: "03/01/1968" },
      { name: "Phạm Văn Chính", relation: "con", sacrifice_date: "" }
    ],
    relatives_text: "Mẹ có 2 người thân là liệt sĩ: + Liệt sĩ Phạm Văn Dài (con), hy sinh ngày 03/01/1968 + Liệt sĩ Phạm Văn Chính (con)",
    worship_address: "Phường Hưng Phú, Thành phố Cần Thơ",
    worship_type: "Địa chỉ gia đình đang thờ cúng",
    photo: "assets/images/mothers/thumb-me-vo-thi-ba.jpg",
    full_photo: "assets/images/mothers/me-vo-thi-ba.jpg",
    ward: "Phường Hưng Phú"
  },
  {
    id: 2,
    stt: 2,
    name: "NGÔ THỊ CHÈ",
    title: "Truy tặng",
    birth_death: "1910 - 2001",
    status: "Đã từ trần",
    has_portrait: false,
    batch: "Đợt 1",
    batch_num: 1,
    hometown: "Huyện Kim Sơn, tỉnh Ninh Bình",
    decision: "Mẹ được truy tặng theo Quyết định số 705/QĐ-CTN ngày 15/4/2015 của Chủ tịch nước Cộng hòa xã hội chủ nghĩa Việt Nam",
    relatives: [
      { name: "Lê Văn Hoanh", relation: "chồng", sacrifice_date: "05/9/1959" },
      { name: "Lê Văn Xứng", relation: "con", sacrifice_date: "07/01/1964" }
    ],
    relatives_text: "Mẹ có 2 người thân là liệt sĩ: + Liệt sĩ Lê Văn Hoanh (chồng), hy sinh ngày 05/9/1959 + Liệt sĩ Lê Văn Xứng (con), hy sinh ngày 07/01/1964",
    worship_address: "Phường Hưng Phú, Thành phố Cần Thơ",
    worship_type: "Địa chỉ gia đình đang thờ cúng",
    photo: "assets/images/mothers/thumb-me-ngo-thi-che.jpg",
    full_photo: "assets/images/mothers/me-ngo-thi-che.jpg",
    ward: "Phường Hưng Phú"
  },
  {
    id: 3,
    stt: 3,
    name: "MAI THỊ CHỮ",
    title: "Truy tặng",
    birth_death: "1917 - 1990",
    status: "Đã từ trần",
    has_portrait: false,
    batch: "Đợt 1",
    batch_num: 1,
    hometown: "Xã Phú Thứ, huyện Châu Thành, tỉnh Hậu Giang",
    decision: "Mẹ được truy tặng theo Quyết định số 705/QĐ-CTN ngày 15/4/2015 của Chủ tịch nước Cộng hòa xã hội chủ nghĩa Việt Nam",
    relatives: [
      { name: "Trương Văn Tư", relation: "chồng", sacrifice_date: "" },
      { name: "Trương Văn Gấm", relation: "con", sacrifice_date: "" }
    ],
    relatives_text: "Mẹ có 2 người thân là liệt sĩ: + Liệt sĩ Trương Văn Tư (chồng) + Liệt sĩ Trương Văn Gấm (con)",
    worship_address: "Phường Hưng Phú, Thành phố Cần Thơ",
    worship_type: "Địa chỉ gia đình đang thờ cúng",
    photo: "assets/images/mothers/thumb-me-mai-thi-chu.jpg",
    full_photo: "assets/images/mothers/me-mai-thi-chu.jpg",
    ward: "Phường Hưng Phú"
  },
  {
    id: 4,
    stt: 4,
    name: "LÊ THỊ CHÍNH",
    title: "Phong tặng",
    birth_death: "1925 - 2014",
    status: "Đã từ trần",
    has_portrait: false,
    batch: "Đợt 1",
    batch_num: 1,
    hometown: "Phường Hưng Phú, Thành phố Cần Thơ",
    decision: "Mẹ được phong tặng theo Quyết định số 628/QĐ-CTN ngày 12/3/2014 của Chủ tịch nước Cộng hòa xã hội chủ nghĩa Việt Nam",
    relatives: [
      { name: "Nguyễn Văn Xệ", relation: "con", sacrifice_date: "tháng 02/1968" },
      { name: "Nguyễn Văn Săn", relation: "con", sacrifice_date: "25/10/1971" }
    ],
    relatives_text: "Mẹ có 2 người thân là liệt sĩ: + Liệt sĩ Nguyễn Văn Xệ (con), hy sinh tháng 02/1968 + Liệt sĩ Nguyễn Văn Săn (con), hy sinh ngày 25/10/1971",
    worship_address: "Phường Hưng Phú, Thành phố Cần Thơ",
    worship_type: "Địa chỉ gia đình đang thờ cúng",
    photo: "assets/images/mothers/thumb-me-le-thi-chinh.jpg",
    full_photo: "assets/images/mothers/me-le-thi-chinh.jpg",
    ward: "Phường Hưng Phú"
  },
  {
    id: 5,
    stt: 5,
    name: "NGUYỄN THỊ BẢY",
    title: "Truy tặng",
    birth_death: "1899 - 1991",
    status: "Đã từ trần",
    has_portrait: false,
    batch: "Đợt 1",
    batch_num: 1,
    hometown: "Xã Phú An, huyện Châu Thành, tỉnh Hậu Giang",
    decision: "Mẹ được truy tặng theo Quyết định số 705/QĐ-CTN ngày 15/4/2015 của Chủ tịch nước Cộng hòa xã hội chủ nghĩa Việt Nam",
    relatives: [
      { name: "Trần Văn Giáp", relation: "chồng", sacrifice_date: "" },
      { name: "Trần Văn Đen", relation: "con", sacrifice_date: "" }
    ],
    relatives_text: "Mẹ có 2 người thân là liệt sĩ: + Liệt sĩ Trần Văn Giáp (chồng) + Liệt sĩ Trần Văn Đen (con)",
    worship_address: "Phường Hưng Phú, Thành phố Cần Thơ",
    worship_type: "Địa chỉ gia đình đang thờ cúng",
    photo: "assets/images/mothers/thumb-me-nguyen-thi-bay.jpg",
    full_photo: "assets/images/mothers/me-nguyen-thi-bay.jpg",
    ward: "Phường Hưng Phú"
  },
  {
    id: 6,
    stt: 6,
    name: "LÊ THỊ BA",
    title: "Truy tặng",
    birth_death: "1922 - từ trần",
    status: "Đã từ trần",
    has_portrait: false,
    batch: "Đợt 1",
    batch_num: 1,
    hometown: "Phường Hưng Phú, Thành phố Cần Thơ",
    decision: "Mẹ được truy tặng theo Quyết định số 629/QĐ-CTN ngày 12/3/2014 của Chủ tịch nước Cộng hòa xã hội chủ nghĩa Việt Nam",
    relatives: [
      { name: "Nguyễn Thành Long", relation: "con", sacrifice_date: "04/02/1954" },
      { name: "Nguyễn Văn Đen", relation: "con", sacrifice_date: "08/12/1967" }
    ],
    relatives_text: "Mẹ có 2 người thân là liệt sĩ: + Liệt sĩ Nguyễn Thành Long (con), hy sinh ngày 04/02/1954 + Liệt sĩ Nguyễn Văn Đen (con), hy sinh ngày 08/12/1967",
    worship_address: "Phường Hưng Phú, Thành phố Cần Thơ",
    worship_type: "Địa chỉ gia đình đang thờ cúng",
    photo: "assets/images/mothers/thumb-me-le-thi-ba.jpg",
    full_photo: "assets/images/mothers/me-le-thi-ba.jpg",
    ward: "Phường Hưng Phú"
  },
  {
    id: 7,
    stt: 7,
    name: "NGUYỄN THỊ BÊ",
    title: "Phong tặng",
    birth_death: "1935",
    status: "Đang phụng dưỡng",
    has_portrait: true,
    batch: "Đợt 1",
    batch_num: 1,
    hometown: "Xã Phú An, huyện Châu Thành, tỉnh Hậu Giang",
    decision: "Mẹ được phong tặng theo Quyết định số 3167/QĐ-CTN ngày 08/12/2014 của Chủ tịch nước Cộng hòa xã hội chủ nghĩa Việt Nam",
    relatives: [
      { name: "Võ Văn Điệu", relation: "chồng", sacrifice_date: "21/8/1968" },
      { name: "Võ Văn Lâm", relation: "con", sacrifice_date: "1971" }
    ],
    relatives_text: "Mẹ có 2 người thân là liệt sĩ: + Liệt sĩ Võ Văn Điệu (chồng), hy sinh ngày 21/8/1968 + Liệt sĩ Võ Văn Lâm (con), hy sinh năm 1971",
    worship_address: "Phường Hưng Phú, Thành phố Cần Thơ",
    worship_type: "Địa chỉ gia đình đang phụng dưỡng",
    photo: "assets/images/mothers/thumb-me-nguyen-thi-be.jpg",
    full_photo: "assets/images/mothers/me-nguyen-thi-be.jpg",
    ward: "Phường Hưng Phú"
  }
];

if (typeof window !== "undefined") {
  window.MOTHERS_DATA = MOTHERS_DATA;
}
