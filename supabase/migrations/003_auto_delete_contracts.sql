-- 1. Kích hoạt extension pg_cron nếu chưa có
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Tạo function dọn dẹp hợp đồng quá 24 giờ
CREATE OR REPLACE FUNCTION delete_old_contracts()
RETURNS void AS $$
BEGIN
  -- Xóa thông tin hợp đồng trong Database
  DELETE FROM public.contracts
  WHERE created_at < NOW() - INTERVAL '24 hours';
  
  -- Xóa file vật lý trong Storage (bucket tên là 'contracts')
  DELETE FROM storage.objects
  WHERE bucket_id = 'contracts'
  AND created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Tạo Cronjob tự động chạy function trên mỗi giờ
SELECT cron.schedule(
  'auto-delete-contracts-every-hour', -- Tên job
  '0 * * * *',                        -- Chạy vào phút số 0 mỗi giờ
  $$ SELECT delete_old_contracts(); $$
);
