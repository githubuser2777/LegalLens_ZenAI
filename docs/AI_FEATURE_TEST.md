# Kiểm thử Tính năng AI Phân tích rủi ro (Tuần 7)

Dưới đây là kịch bản kiểm thử thủ công và tự động cho tính năng phân tích hợp đồng bằng AI.

## Kịch bản 1: API Endpoint Validation
- **Mục tiêu**: Đảm bảo AI trả về đúng cấu trúc JSON Zod schema.
- **Dữ liệu test**: File PDF "Hợp đồng thuê nhà chuẩn.pdf".
- **Thực hiện**:
  1. Gửi request `GET /api/contracts/<id_hop_dong>/analyze`
  2. Bắt response.
- **Kết quả mong muốn**: Trả về mảng `risks` không có lỗi phân tích. Các trường `excerpt` không bị null.

## Kịch bản 2: Phát hiện rủi ro mức độ HIGH
- **Mục tiêu**: Xác minh AI nhận diện đúng mức độ nghiêm trọng.
- **Dữ liệu test**: Hợp đồng có chứa câu "Bên thuê đơn phương chấm dứt hợp đồng sẽ mất 100% tiền cọc".
- **Thực hiện**: Nhấn "Phân tích rủi ro ngay" trên UI.
- **Kết quả mong muốn**: 
  - Hiển thị 1 thẻ rủi ro màu Đỏ (HIGH).
  - Category: Deposit.

## Kịch bản 3: Chống Hallucination & Tô sáng văn bản
- **Mục tiêu**: Kiểm tra tính trung thực của `excerpt`.
- **Dữ liệu test**: Hợp đồng bất kỳ.
- **Thực hiện**:
  1. Chờ AI trả về kết quả.
  2. Đọc `excerpt` trên thẻ rủi ro.
  3. Click "Xem tại nguồn gốc".
- **Kết quả mong muốn**: Màn hình cuộn chính xác đến dòng chứa câu văn đó. Câu văn khớp 100% từng chữ so với thẻ rủi ro, và được tô sáng nhấp nháy màu đỏ.
