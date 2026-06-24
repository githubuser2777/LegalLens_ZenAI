export class AIValidator {
  // Danh sách các mẫu (heuristics) phổ biến dùng cho Prompt Injection
  private static injectionPatterns = [
    /ignore (all )?(previous )?instructions/i,
    /bỏ qua (tất cả )?(các )?hướng dẫn/i,
    /you are now (a|an)?/i,
    /bây giờ bạn là/i,
    /system prompt/i,
    /<\|system\|>/i,
    /<\|assistant\|>/i,
    /<\|user\|>/i,
    /forget (everything|all instructions)/i,
    /print (all )?instructions/i,
    /hiển thị (tất cả )?hướng dẫn/i,
    /disregard previous/i,
    /thay đổi vai trò/i,
    /do not follow the (above|below) instructions/i,
    /new instructions/i,
    /hướng dẫn mới/i,
    /from now on/i,
    /từ bây giờ/i,
    /ignore everything above/i
  ];

  /**
   * Kiểm duyệt input của user (hoặc nội dung file) trước khi đưa vào LLM
   */
  public static validatePrompt(input: string): { isValid: boolean; reason?: string; detectedPattern?: string } {
    if (!input || typeof input !== "string") {
      return { isValid: false, reason: "Dữ liệu đầu vào không hợp lệ hoặc trống rỗng" };
    }

    // Heuristics Check (Regex)
    for (const pattern of this.injectionPatterns) {
      if (pattern.test(input)) {
        return { 
          isValid: false, 
          reason: "Phát hiện dấu hiệu thao túng mô hình (Prompt Injection)",
          detectedPattern: pattern.toString()
        };
      }
    }

    // Kiểm tra độ dài an toàn (chống DoS / tràn context)
    if (input.length > 100000) {
      return { isValid: false, reason: "Nội dung vượt quá giới hạn độ dài cho phép" };
    }

    return { isValid: true };
  }

  /**
   * Làm sạch các token hệ thống có thể gây ảnh hưởng đến LLM
   */
  public static sanitize(input: string): string {
    if (!input || typeof input !== "string") return "";
    
    return input
      .replace(/<\|system\|>/gi, "")
      .replace(/<\|user\|>/gi, "")
      .replace(/<\|assistant\|>/gi, "")
      .replace(/<\|endoftext\|>/gi, "");
  }
}
