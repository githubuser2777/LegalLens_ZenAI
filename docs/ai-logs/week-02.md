# Nhật ký Sử dụng AI - Tuần 02

## Dự án

LegalLens AI

## Tuần phát triển

Tuần 02 - Phân tích Sản phẩm & Đề xuất Tính năng AI (Product Analysis & AI Feature Proposal)

## Mục tiêu của Nhóm

Phân tích sâu ý tưởng sản phẩm, xác định phạm vi thực tế cho phiên bản MVP, và đánh giá xem AI nên đóng vai trò là thành phần cốt lõi hay là tính năng bổ trợ.

---

# Các công việc đã thực hiện

## Công việc 1: Phân tích Sản phẩm (Product Analysis)

### Mục tiêu

Thấu hiểu không gian vấn đề, đối tượng người dùng mục tiêu và khoanh vùng phạm vi MVP trước khi bắt tay vào viết code.

### Hỗ trợ từ AI

AI đóng vai trò là Chuyên viên Phân tích Sản phẩm (Product Analyst) để:

* Phân tích bài toán rà soát hợp đồng pháp lý trong đời sống.
* Xác định các phân khúc người dùng mục tiêu.
* So sánh và đánh giá các giải pháp thay thế hiện có trên thị trường.
* Gợi ý ranh giới phạm vi cho phiên bản MVP.
* Nhận diện các rủi ro tiềm ẩn của dự án.

### Prompt đã sử dụng

Phân tích một nền tảng phân tích hợp đồng hỗ trợ bởi AI cho một dự án môn học kỹ nghệ phần mềm của sinh viên.

Cung cấp các thông tin:

1. Người dùng mục tiêu
2. Khó khăn của người dùng (Pain points)
3. Phạm vi MVP
4. Các tính năng cốt lõi
5. Rủi ro dự án
6. Tiêu chí thành công

Thiết kế phạm vi MVP sao cho thực tế và khả thi trong vòng 10 tuần phát triển của sinh viên.

### Tóm tắt phản hồi của AI

AI đã xác định rõ các đối tượng người dùng:

* Sinh viên
* Người lao động
* Freelancer
* Người tiêu dùng nói chung

Đồng thời, AI khuyến nghị giới hạn phạm vi MVP tập trung vào:

* Tải lên tài liệu PDF
* Trích xuất văn bản hợp đồng
* Phát hiện rủi ro (Risk Detection)
* Trình xem và rà soát hợp đồng cơ bản

thay vì cố gắng xây dựng một nền tảng pháp lý đồ sộ và phức tạp.

### Đánh giá của Con người

Nhóm phát triển đã xem xét kỹ lưỡng các gợi ý từ AI và điều chỉnh phạm vi công việc để đảm bảo tính khả thi cao nhất theo tiến độ môn học.

Quyết định cuối cùng:

Chấp nhận các đề xuất của AI và thực hiện một số điều chỉnh nhỏ.

---

## Công việc 2: Đánh giá Tính năng AI (AI Feature Evaluation)

### Mục tiêu

Xác định xem liệu hệ thống có thực sự cần tích hợp nhiều tính năng AI khác nhau hay không.

### Các ý tưởng ban đầu

Nhóm đã cân nhắc một số tính năng AI tiềm năng:

* Tóm tắt hợp đồng tự động
* Phát hiện rủi ro trong hợp đồng
* Dịch thuật pháp lý sang ngôn ngữ bình dân
* Trò chuyện hỏi đáp về hợp đồng (Contract QA)

### Hỗ trợ từ AI

AI được yêu cầu đánh giá giá trị thực tiễn, độ phức tạp công nghệ và tính khả thi của từng tính năng đối với nhóm sinh viên.

### Prompt đã sử dụng

Đối với một dự án môn học công nghệ phần mềm kéo dài 10 tuần, hãy đánh giá các tính năng AI sau:

- Tóm tắt hợp đồng
- Phát hiện rủi ro
- Dịch ngôn ngữ pháp lý sang ngôn ngữ bình dân
- Hỏi đáp về hợp đồng (QA)

Tính năng nào mang lại giá trị thực tiễn cao nhất trong khi vẫn đảm bảo tính khả thi để nhóm sinh viên triển khai?

### Tóm tắt phản hồi của AI

AI kết luận rằng:

* **Phát hiện rủi ro (Risk Detection)** mang lại sự cân bằng tốt nhất giữa giá trị thực tế và độ phức tạp kỹ thuật.
* **Hỏi đáp về hợp đồng (QA)** đòi hỏi xây dựng kiến trúc hệ thống RAG phức tạp hơn rất nhiều.
* **Dịch thuật** có phần trùng lặp nhiều với tính năng tóm tắt nội dung.
* Việc nhồi nhét quá nhiều tính năng AI sẽ khiến dự án bị quá tải và khó kiểm soát chất lượng.

### Đánh giá của Con người

Nhóm phát triển đồng tình với kết quả phân tích phân loại của AI.

Quyết định cuối cùng:

Chỉ tập trung phát triển duy nhất một tính năng AI cốt lõi cho phiên bản MVP.

---

## Công việc 3: Đề xuất Tính năng AI (AI Feature Proposal)

### Mục tiêu

Thiết kế chi tiết tính năng AI được lựa chọn phù hợp với yêu cầu của môn học.

### Tính năng được chọn

Trình Phân Tích Rủi Ro AI (AI Risk Analyzer).

### Lý do lựa chọn

Tính năng này:

* Giải quyết trực tiếp một khó khăn thực tế và lớn nhất của người dùng.
* Minh chứng rõ nét năng lực ứng dụng AI vào sản phẩm phần mềm thực tế.
* Dễ dàng kiểm soát độ phức tạp triển khai hơn là xây dựng một chatbot RAG tự do hoàn chỉnh ngay từ đầu.
* Định vị AI như một công cụ hỗ trợ đáng tin cậy, không lấn át giá trị vận hành cốt lõi của phần mềm.

### Dữ liệu đầu vào dự kiến (Inputs)

* Văn bản hợp đồng thô.

### Dữ liệu đầu ra dự kiến (Outputs)

* Danh mục rủi ro của điều khoản.
* Mức độ nghiêm trọng tương ứng.
* Giải thích chi tiết bằng ngôn ngữ dễ hiểu.
* Chỉ ra nguồn trích dẫn điều khoản cụ thể.

---

# Các Quyết định Quan trọng

## Quyết định 1

AI đóng vai trò hỗ trợ tăng tốc trải nghiệm, không quyết định thay thế hoặc làm biến dạng giá trị cốt lõi của sản phẩm.

Trạng thái:

Đã thông qua.

---

## Quyết định 2

Sản phẩm phải luôn hữu ích và vận hành bình thường ngay cả khi tính năng AI bị tắt hoặc gặp sự cố ngoại tuyến.

Trạng thái:

Đã thông qua.

Lý do:

Đây là một trong những câu hỏi bảo vệ cốt lõi bắt buộc của môn học nhằm chứng minh tính bền vững của phần mềm.

---

## Quyết định 3

Chỉ phát triển một tính năng AI duy nhất trong phiên bản MVP.

Trạng thái:

Đã thông qua.

Tính năng được chọn:

Trình Phân Tích Rủi Ro AI (AI Risk Analyzer).

---

# Bài học Kinh nghiệm rút ra

### Bài học 1

Bắt đầu viết code ngay lập tức khi chưa tiến hành phân tích kỹ lưỡng sản phẩm có thể dẫn đến sự phình to công nghệ và lãng phí nguồn lực không cần thiết.

### Bài học 2

Không phải bất kỳ tính năng hữu ích nào cũng cần phải nhồi nhét vào phiên bản MVP đầu tiên.

### Bài học 3

Một tính năng AI nhỏ, có mục tiêu rõ ràng sẽ dễ dàng triển khai, kiểm thử, giải thích cấu trúc và bảo vệ thành công hơn trước hội đồng.

### Bài học 4

Mọi đề xuất và kết quả do AI khởi tạo đều bắt buộc phải có sự đánh giá, kiểm duyệt và quyết định cuối cùng từ con người.

---

# Các Công cụ AI đã sử dụng

| Công cụ | Mục đích sử dụng |
| ------- | ---------------------- |
| ChatGPT | Phân tích sản phẩm |
| ChatGPT | Khoanh vùng phạm vi MVP |
| ChatGPT | Đánh giá so sánh các tính năng AI |
| ChatGPT | Hỗ trợ soạn thảo tài liệu thô |

---

# Đóng góp của Thành viên trong Nhóm

Các thành viên đã chủ động:

* Kiểm duyệt toàn bộ nội dung do AI đề xuất.
* Cắt giảm đáng kể phạm vi tính năng để đảm bảo tiến độ.
* Quyết định hướng đi MVP tập trung nhất.
* Thống nhất thiết kế cho Trình Phân Tích Rủi Ro AI.
* Phê duyệt các quyết định thiết kế hệ thống quan trọng.

---

# Thách thức và Cách giải quyết

### Thách thức gặp phải

Ý tưởng ban đầu của nhóm bị quá tải do muốn đưa vào quá nhiều tính năng AI phức tạp.

### Cách thức giải quyết

Nhóm đã ngồi lại, sử dụng phân tích độ phức tạp của AI làm cơ sở để đơn giản hóa thiết kế, giữ lại duy nhất tính năng có tỷ lệ giá trị/độ phức tạp tốt nhất.

---

# Các tài liệu bàn giao Tuần 02

Đã hoàn thành xuất sắc:

* PRODUCT_ANALYSIS.md (Đã dịch sang tiếng Việt)
* AI_FEATURE_PROPOSAL.md (Đã dịch sang tiếng Việt)
* ai-logs/week-02.md (Tài liệu này)

Trạng thái:

Đã hoàn thành thành công.

---

# Phản hồi & Tự vấn (Reflection)

AI đóng vai trò cực kỳ hiệu quả trong việc hỗ trợ brainstorm ý tưởng, phân tích cơ cấu sản phẩm và cung cấp góc nhìn đa chiều để so sánh các phương án thiết kế.

Tuy nhiên, các quyết định cuối cùng về mặt phạm vi, mức độ ưu tiên công việc và tính khả thi kỹ thuật thực tế đều được các thành viên trong nhóm thống nhất đưa ra sau khi thảo luận kỹ lưỡng trên cơ sở các khuyến nghị của AI.

Nhóm nhận thức sâu sắc rằng thành công của một dự án công nghệ phần mềm nằm ở việc kiểm soát tốt độ phức tạp hệ thống hơn là việc liên tục bổ sung tính năng mới.
