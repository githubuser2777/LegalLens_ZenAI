# BÁO CÁO THIẾT KẾ UX PROTOTYPE - LEGALLENS AI

Tài liệu này mô tả chi tiết thiết kế Trải nghiệm Người dùng (UX) và Giao diện (UI) Prototype cho hệ thống **LegalLens AI** - Nền tảng phân tích hợp đồng thông minh hỗ trợ bởi trí tuệ nhân tạo.

---

## 1. Tổng quan & Mục tiêu của UX Prototype

### 1.1. Mục tiêu
Mục tiêu chính của bản UX Prototype này là hiện thực hóa tầm nhìn của **LegalLens AI**: **Giúp người dùng phổ thông (học sinh, sinh viên, người lao động tự do) hiểu được các điều khoản cốt lõi và rủi ro ẩn giấu trong hợp đồng chỉ trong vòng 5 phút.**

Bản mẫu tập trung vào luồng tương tác cốt lõi của MVP (Minimum Viable Product):
* **F01 (Tải lên PDF):** Tải lên tài liệu hợp đồng định dạng PDF một cách nhanh chóng.
* **F02 & F03 (Đọc & Hiển thị):** Hiển thị văn bản hợp đồng đã trích xuất trực quan.
* **F04 & F05 (Phân tích & Dashboard RAG):** Nhận diện rủi ro, phân loại theo mức độ nghiêm trọng và giải thích bằng ngôn ngữ dễ hiểu.
* **F06 (Đối chiếu & Trích dẫn):** Kết nối trực tiếp giữa cảnh báo rủi ro với điều khoản gốc trong hợp đồng để đảm bảo tính minh bạch.

### 1.2. Đối tượng hướng đến (Target Personas)
* **Minh Nguyễn (20 tuổi) - Sinh viên đi thuê trọ:** Không biết thuật ngữ pháp lý, sợ bị mất tiền cọc hoặc chịu các khoản phí phạt vô lý.
* **Linh Trần (24 tuổi) - Freelancer thiết kế:** Cần kiểm tra kỹ điều khoản thanh toán, bản quyền bàn giao và trách nhiệm bồi thường.
* **Huy Phạm (22 tuổi) - Nhân viên mới đi làm:** Cần làm rõ nghĩa vụ bảo mật (NDA), điều khoản không cạnh tranh (non-compete) và thủ tục chấm dứt hợp đồng.

---

## 2. Nguyên tắc Thiết kế Trải nghiệm (UX Principles)

Để giải quyết vấn đề "Người dùng ngại đọc hợp đồng dài và khó hiểu", giao diện LegalLens AI tuân thủ các nguyên tắc thiết kế sau:

* **Bố cục "Google Docs + AI Audit" (Không dùng Chatbot truyền thống):** Tránh thiết kế dạng cửa sổ chat đơn thuần vì người dùng dễ mất dấu văn bản gốc. Hợp đồng gốc luôn hiển thị ở 2/3 màn hình bên trái; bảng phân tích rủi ro và khung giải thích của AI nằm ở 1/3 bên phải.
* **Rõ ràng trước phức tạp (Clarity Over Complexity):** Thuật ngữ pháp lý ("legalese") phức tạp phải được dịch trực tiếp sang ngôn ngữ phổ thông. Cảnh báo rủi ro phải đi kèm với câu hỏi tự vấn thực tế (Ví dụ: *"Tôi có bị mất tiền cọc không?"*, *"Tôi phải báo trước bao nhiêu ngày?"*).
* **Độ tin cậy qua tính minh bạch (Trust through Transparency):** Tránh hiện tượng AI "ảo tưởng" (hallucination) bằng cách bắt buộc hiển thị trích dẫn gốc (Citation Source). Khi nhấn vào một rủi ro, hệ thống tự động cuộn đến và tô sáng điều khoản tương ứng trong hợp đồng gốc.
* **Hạn chế lựa chọn để giảm tải nhận thức:** Luồng đi từ Tải lên -> Đợi xử lý -> Đọc kết quả phân tích là luồng tuyến tính, hạn chế menu rườm rà.

---

## 3. Kiến trúc thông tin (Information Architecture - IA)

Cấu trúc trang web của bản mẫu được thiết kế tối giản:

```
[Trang chủ / Tải lên] (Landing & Upload Page)
       │
       ▼
[Trạng thái xử lý] (Processing State Page)
       │
       ▼
[Màn hình Workspace chính] (Main Workspace Dashboard)
       ├── Phân khu bên trái (2/3): Contract Viewer (Trình xem hợp đồng gốc)
       └── Phân khu bên phải (1/3): AI Sidebar
             ├── Tab 1: Risk Analysis Dashboard (Danh sách rủi ro & phân loại)
             └── Tab 2: AI Contract QA (Hỏi đáp nhanh dựa trên tài liệu)
```

---

## 4. Luồng Người dùng Chi tiết (Interactive User Flows)

### Luồng 1: Tải lên và Xử lý tài liệu (Upload & Extraction Flow)
1. Người dùng truy cập trang chủ, thấy khu vực kéo thả tệp tin hoặc nhấn nút **Tải hợp đồng lên**.
2. Người dùng kéo thả file PDF (Kích thước tối đa 10MB).
3. Hệ thống hiển thị tiến trình xử lý trực quan qua 4 giai đoạn liên tiếp:
   * `[Giai đoạn 1/4]` Tải lên file PDF (Uploading PDF...)
   * `[Giai đoạn 2/4]` Trích xuất văn bản (Extracting contract text...)
   * `[Giai đoạn 3/4]` Định danh và phân loại điều khoản (Indexing clauses...)
   * `[Giai đoạn 4/4]` Phân tích rủi ro bằng AI (AI Risk Analysis running...)
4. Chuyển hướng tự động sang màn hình Workspace sau khi hoàn tất.

### Luồng 2: Xem kết quả rủi ro và Đối chiếu nguồn (Risk Audit & Citation Interaction)
1. Trên màn hình Workspace, Sidebar bên phải mở sẵn Tab **Risk Dashboard**.
2. Sidebar hiển thị tổng số rủi ro: `3 Rủi ro được phát hiện (1 Cao | 1 Trung bình | 1 Thấp)`.
3. Người dùng đọc qua danh sách thẻ rủi ro. Mỗi thẻ chứa: Mức độ nghiêm trọng, Danh mục, Giải thích ngôn ngữ dân dã, Trích dẫn gốc sơ bộ.
4. Người dùng nhấn vào nút **"Xem điều khoản gốc" (View Source Clause)** trên một thẻ rủi ro (Ví dụ: Rủi ro mất cọc).
5. Phân khu bên trái (Contract Viewer) tự động cuộn (scroll) tới vị trí điều khoản đó trong văn bản hợp đồng và tô sáng (highlight) bằng màu tương ứng với mức độ nghiêm trọng (ví dụ: đỏ nhạt cho rủi ro Cao).

### Luồng 3: Hỏi đáp dựa trên hợp đồng (AI Grounded Q&A Flow)
1. Người dùng chuyển từ Tab **Risk Dashboard** sang Tab **AI Assistant**.
2. Hệ thống hiển thị các câu hỏi gợi ý nhanh dựa trên loại hợp đồng (Ví dụ với hợp đồng thuê trọ: *"Làm sao lấy lại cọc?"*, *"Thời hạn hợp đồng bao lâu?"*, *"Chấm dứt sớm phạt thế nào?"*).
3. Người dùng nhấn vào câu hỏi gợi ý hoặc tự nhập câu hỏi vào ô Chat.
4. Hệ thống hiển thị trạng thái AI đang gõ... sau đó đưa ra câu trả lời ngắn gọn, kèm link trích dẫn dạng `[Điều 5.1]` hoặc `[Khoản 2]`.
5. Người dùng nhấn vào link trích dẫn trong ô chat, Contract Viewer bên trái lập tức cuộn và tô sáng điều khoản tương ứng để đối chiếu.

---

## 5. Thiết kế Giao diện Chi tiết (Wireframes)

### 5.1. Màn hình 1: Welcome & Upload Page (Trang tải lên hợp đồng)
Trang thiết kế theo phong cách tối giản hiện đại.

```
+-----------------------------------------------------------------------------+
|  LegalLens AI  [ Logo ]                                    [Trợ giúp] [FAQ] |
+-----------------------------------------------------------------------------+
|                                                                             |
|                      THẤU HIỂU HỢP ĐỒNG TRONG 5 PHÚT                        |
|             Trợ lý AI giúp bạn nhận diện rủi ro pháp lý trước khi ký        |
|                                                                             |
|         +---------------------------------------------------------+         |
|         |                                                         |         |
|         |                     [ Biểu tượng PDF ]                  |         |
|         |                                                         |         |
|         |              Kéo và thả file hợp đồng PDF vào đây       |         |
|         |                       - Hoặc -                          |         |
|         |                  [ Chọn tệp tin từ máy tính ]           |         |
|         |                                                         |         |
|         |               Hỗ trợ file PDF tối đa dung lượng 10MB    |         |
|         +---------------------------------------------------------+         |
|                                                                             |
|         Hoặc dùng thử nhanh hợp đồng mẫu của chúng tôi:                     |
|         [ Hợp đồng thuê nhà mẫu.pdf ]   [ Hợp đồng Freelance mẫu.pdf ]      |
|                                                                             |
+-----------------------------------------------------------------------------+
| Tuyên bố miễn trừ trách nhiệm: Hệ thống cung cấp thông tin tham khảo giáo   |
| dục, không thay thế lời khuyên pháp lý chuyên nghiệp từ luật sư.           |
+-----------------------------------------------------------------------------+
```

### 5.2. Màn hình 2: Processing Page (Màn hình xử lý trung gian)
Hiển thị để giảm thời gian chờ đợi nhận thức của người dùng thông qua các thông báo rõ ràng.

```
+-----------------------------------------------------------------------------+
|  LegalLens AI  [ Logo ]                                                     |
+-----------------------------------------------------------------------------+
|                                                                             |
|                      ĐANG PHÂN TÍCH HỢP ĐỒNG CỦA BẠN...                     |
|             Vui lòng giữ tab này hoạt động. Quá trình mất khoảng 10-15s.    |
|                                                                             |
|                      [ Thanh tiến trình chạy mịn 65% ]                      |
|                                                                             |
|         Giai đoạn xử lý:                                                    |
|         [ x ] 1. Tải lên tệp hợp đồng thành công (1.2 MB)                   |
|         [ x ] 2. Trích xuất nội dung văn bản (OCR & Parser)                 |
|         [ > ] 3. Đang phân tích rủi ro bằng AI (Gemini 2.5 Flash)...        |
|         [   ] 4. Tạo cơ sở dữ liệu hỏi đáp (RAG Vector Store)               |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 5.3. Màn hình 3: Main Workspace Dashboard (Bố cục chia hai phân khu)
Đây là màn hình cốt lõi của ứng dụng. Giao diện được tối ưu hóa cho màn hình Desktop/Laptop để đọc tài liệu thoải mái nhất.

```
+-----------------------------------------------------------------------------+
| LegalLens AI | [Tên tệp: HopDongThueNha_MinhNguyen.pdf]         [ Tải lại ] |
+------------------------------------+----------------------------------------+
|                                    |  [ TAB 1: RỦI RO ]  |  TAB 2: HỎI ĐÁP  |
|          CONTRACT VIEWER           +----------------------------------------+
|                                    | Tổng quan: 3 Rủi Ro Phát Hiện          |
| HỢP ĐỒNG THUÊ PHÒNG TRỌ            |   [Cao] 1  |  [Trung bình] 1  | [Thấp] 1 |
|                                    |----------------------------------------|
| Điều 1: Đối tượng thuê...          | [CAOOOO] RỦI RO MẤT TIỀN CỌC (Tài chính)|
| Bên A đồng ý cho bên B thuê phòng  | Điều khoản cho phép chủ nhà tịch thu   |
| trọ số 203 tại địa chỉ...          | toàn bộ tiền cọc mà không báo trước    |
|                                    | nếu chấm dứt hợp đồng sớm.             |
| Điều 2: Tiền đặt cọc               | [!] Nguồn: Điều 2.2                    |
| [[ BÊN B PHẢI ĐẶT CỌC 2 THÁNG TIỀN  | [ Xem điều khoản gốc ]                 |
| NHÀ (6.000.000 VNĐ). NẾU BÊN B     |----------------------------------------|
| CHẤM DỨT HỢP ĐỒNG TRƯỚC THỜI HẠN   | [TRUNG BÌNH] TỰ ĐỘNG GIA HẠN (Hợp đồng)|
| THÌ SẼ BỊ MẤT TOÀN BỘ SỐ TIỀN CỌC  | Hợp đồng tự động gia hạn thêm 1 năm    |
| NÀY MÀ KHÔNG ĐƯỢC BỒI HOÀN. ]] <== | nếu bên thuê không thông báo bằng văn  |
| (Tô sáng màu đỏ khi click xem)     | bản trước 30 ngày.                     |
|                                    | [!] Nguồn: Điều 8.3                    |
| Điều 3: Quyền và nghĩa vụ...       | [ Xem điều khoản gốc ]                 |
|                                    |----------------------------------------|
| Điều 8: Thời hạn & Gia hạn         | [THẤP] QUY ĐỊNH NUÔI THÚ CƯNG          |
| Hợp đồng có giá trị 01 năm...      | Không được phép nuôi chó, mèo trong    |
| Hợp đồng tự động gia hạn thêm 1    | khuôn viên phòng trọ để tránh ồn ào.   |
| năm nếu...                         | [!] Nguồn: Điều 11.1                   |
|                                    | [ Xem điều khoản gốc ]                 |
+------------------------------------+----------------------------------------+
| Tuyên bố miễn trừ: Thông tin do AI phân tích chỉ dùng để tham khảo.          |
+-----------------------------------------------------------------------------+
```

### 5.4. Màn hình 3 (Giao diện phụ): Main Workspace - AI Chat Tab Active
Khi chuyển sang Tab **HỎI ĐÁP**, Sidebar bên phải sẽ chuyển đổi cấu trúc:

```
+------------------------------------+----------------------------------------+
|          CONTRACT VIEWER           |  TAB 1: RỦI RO  |  [ TAB 2: HỎI ĐÁP ]  |
|                                    +----------------------------------------+
| HỢP ĐỒNG THUÊ PHÒNG TRỌ            | Trợ lý AI sẵn sàng giải đáp thắc mắc   |
|                                    | câu hỏi của bạn về hợp đồng thuê này.  |
| ...                                    | Câu hỏi gợi ý nhanh:                   |
|                                    | > [ Tôi có thể mất tiền đặt cọc không? ]|
| Điều 2: Tiền đặt cọc               | > [ Muốn chấm dứt sớm cần báo trước    |
| BÊN B PHẢI ĐẶT CỌC 2 THÁNG TIỀN    |   bao nhiêu ngày? ]                    |
| NHÀ (6.000.000 VNĐ). NẾU BÊN B...  |----------------------------------------|
| (Tô sáng xanh khi click Trích dẫn) | USER: Tôi có bị phạt nếu trả phòng     |
|                                    | trước thời hạn không?                  |
|                                    |                                        |
| Điều 8: Thời hạn & Gia hạn         | AI: Có, theo điều khoản hợp đồng bạn   |
| Hợp đồng có giá trị 01 năm...      | sẽ bị phạt nếu chấm dứt sớm:           |
| [[ Bên thuê muốn chấm dứt hợp đồng | - Bạn sẽ mất toàn bộ tiền đặt cọc      |
| trước thời hạn phải thông báo      |   trị giá 6.000.000đ (Xem [Điều 2.2])  |
| bằng văn bản trước ít nhất 30 ngày | - Bạn phải báo trước ít nhất 30 ngày   |
| nếu không sẽ bị phạt 1 tháng tiền  |   bằng văn bản (Xem [Điều 8.4])        |
| nhà. ]] <== (Tô sáng xanh)         |                                        |
|                                    | [ Nhập câu hỏi của bạn tại đây...    ] |
+------------------------------------+----------------------------------------+
```

---

## 6. Kịch bản Kiểm thử & Dữ liệu Mock (Mock Data)

Để xây dựng bản UX Prototype chạy độc lập bằng dữ liệu Mock (nhằm thử nghiệm người dùng trước khi tích hợp Backend thực tế tại tuần 6-7), chúng ta định nghĩa tập dữ liệu mẫu sau.

### 6.1. Dữ liệu Hợp đồng mẫu (Văn bản trích xuất)
**HỢP ĐỒNG THUÊ PHÒNG TRỌ CÁ NHÂN**
* BÊN A (Chủ nhà): Nguyễn Văn A
* BÊN B (Khách thuê): Minh Nguyễn
* Thời hạn thuê: 12 tháng (từ ngày 01/07/2026)
* Giá thuê: 3.000.000 VNĐ/tháng.
* Tiền đặt cọc: 6.000.000 VNĐ.

**Các điều khoản chính được cài cắm rủi ro:**
* **Điều 2.2 (Rủi ro mất cọc):** *"Bên B chấm dứt hợp đồng trước thời hạn sẽ bị mất hoàn toàn tiền cọc mà không có ngoại lệ."*
* **Điều 8.3 (Tự động gia hạn):** *"Hợp đồng sẽ tự động gia hạn thêm 01 chu kỳ thuê mới (12 tháng) với đơn giá thuê giữ nguyên nếu bên B không gửi thông báo bằng văn bản từ chối gia hạn trước ít nhất 30 ngày kể từ ngày kết thúc hợp đồng."*
* **Điều 8.4 (Phạt chấm dứt sớm):** *"Trường hợp bên thuê chấm dứt trước hạn mà không báo trước 30 ngày bằng văn bản, ngoài việc mất tiền cọc, bên thuê phải bồi thường thêm cho bên cho thuê số tiền tương đương 1 tháng tiền thuê phòng (3.000.000 VNĐ)."*

### 6.2. Bản ánh xạ Rủi ro mẫu (Mock Risks Mapping)
Khi người dùng chạy tính năng **"Analyze Risks"** trên hợp đồng mẫu này, dữ liệu Mock trả về định dạng JSON mô tả giao diện như sau:

```json
[
  {
    "id": "risk_01",
    "category": "Tài chính (Financial)",
    "severity": "HIGH",
    "title": "Mất toàn bộ tiền đặt cọc",
    "explanation": "Nếu bạn chuyển đi trước thời hạn 12 tháng, bạn sẽ mất hoàn toàn 6.000.000 VNĐ tiền đặt cọc bất kể lý do gì.",
    "source_clause": "Điều 2.2",
    "excerpt": "Bên B chấm dứt hợp đồng trước thời hạn sẽ bị mất hoàn toàn tiền cọc mà không có ngoại lệ.",
    "start_line": 8,
    "end_line": 9
  },
  {
    "id": "risk_02",
    "category": "Hợp đồng (Contractual)",
    "severity": "MEDIUM",
    "title": "Tự động gia hạn hợp đồng thêm 1 năm",
    "explanation": "Hợp đồng sẽ tự động kéo dài thêm một năm nữa nếu bạn quên gửi thông báo từ chối bằng văn bản trước khi hết hạn 30 ngày.",
    "source_clause": "Điều 8.3",
    "excerpt": "Hợp đồng sẽ tự động gia hạn thêm 01 chu kỳ thuê mới...",
    "start_line": 15,
    "end_line": 17
  },
  {
    "id": "risk_03",
    "category": "Tài chính (Financial)",
    "severity": "HIGH",
    "title": "Phạt bồi thường chấm dứt sớm",
    "explanation": "Nếu bạn chấm dứt hợp đồng sớm và không báo trước 30 ngày bằng văn bản, bạn sẽ vừa mất cọc, vừa bị phạt thêm 3.000.000 VNĐ (1 tháng tiền phòng).",
    "source_clause": "Điều 8.4",
    "excerpt": "Trường hợp bên thuê chấm dứt trước hạn mà không báo trước 30 ngày... phạt thêm 1 tháng tiền thuê...",
    "start_line": 18,
    "end_line": 20
  }
]
```

### 6.3. Kịch bản Hỏi đáp Mock (Mock QA Interactions)
* **Câu hỏi 1:** *"Khi nào tôi được nhận lại tiền cọc?"*
  * **AI trả lời:** *"Theo **Điều 2.3**, tiền đặt cọc 6.000.000 VNĐ sẽ được hoàn trả cho Bên B trong vòng 7 ngày kể từ khi kết thúc hợp đồng thuê và bàn giao phòng trọ sạch sẽ, không hư hỏng thiết bị."*
* **Câu hỏi 2:** *"Chủ nhà có được tăng giá tiền phòng không?"*
  * **AI trả lời:** *"Dựa vào nội dung hợp đồng hiện tại, giá thuê phòng được cam kết cố định là 3.000.000 VNĐ/tháng trong suốt thời gian hiệu lực 12 tháng của hợp đồng (Xem **Điều 3.1**). Không có điều khoản nào cho phép Bên A tự ý tăng giá giữa kỳ."*

---

## 7. Tiêu chí Đánh giá & Thành công của UX Prototype

Bản UX Prototype của nhóm sẽ được coi là hoàn thiện và sẵn sàng để chuyển giao sang giai đoạn thiết kế kiến trúc hệ thống (Tuần 5) khi vượt qua các tiêu chí kiểm thử trải nghiệm người dùng (Usability Tests) dưới đây:

### 7.1. Bài kiểm tra khả năng tự hiểu (Self-Explanation Usability Test)
Người dùng thử (là sinh viên đi thuê nhà) được cung cấp bản Prototype và không có hướng dẫn từ trước. Họ phải trả lời được 3 câu hỏi sau trong vòng dưới 3 phút:
1. *Hợp đồng này có cho phép nuôi thú cưng không? Nằm ở dòng nào?*
2. *Nếu muốn trả phòng sớm vì lý do cá nhân, họ có thể bị thiệt hại bao nhiêu tiền?*
3. *Họ cần làm gì để tránh hợp đồng tự động gia hạn thêm 1 năm khác?*

**Chỉ số đo lường thành công (Target Metrics):**
* **Tỷ lệ hoàn thành nhiệm vụ (Task Completion Rate):** trên 90% người dùng tìm ra thông tin cảnh báo.
* **Thời gian hoàn thành trung bình (Average Time to Identify Risks):** dưới 2 phút.
* **Mức độ hài lòng về tính minh bạch (Trust Rating):** từ 4.5/5 điểm trở lên (Người dùng cảm thấy tự tin vì đối chiếu trực tiếp được từ rủi ro sang dòng text gốc trong hợp đồng).

### 7.2. Kế hoạch Hiện thực hóa Prototype (Tuần 3 & 4)
* Thiết kế mã nguồn tĩnh cho giao diện Workspace chia đôi màn hình (Sử dụng React/Next.js kết hợp Tailwind CSS ở mức cơ bản).
* Tích hợp dữ liệu Mock dạng tĩnh (JSON) để người dùng có thể bấm vào thẻ rủi ro -> màn hình cuộn và đổi màu nổi bật văn bản tương ứng.
* Tích hợp bộ máy chat Mock (gửi câu hỏi -> hiển thị trạng thái loading -> hiển thị câu trả lời có chứa link trích dẫn định trước).
