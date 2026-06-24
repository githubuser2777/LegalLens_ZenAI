-- Kích hoạt RLS cho tất cả các bảng
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Bảng profiles
CREATE POLICY "Người dùng chỉ có thể xem profile của chính mình" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Người dùng có thể tự cập nhật profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Bảng contracts
CREATE POLICY "Người dùng chỉ có thể xem hợp đồng của chính mình" 
ON contracts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Người dùng chỉ có thể thêm hợp đồng của chính mình" 
ON contracts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Người dùng chỉ có thể cập nhật hợp đồng của chính mình" 
ON contracts FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Người dùng chỉ có thể xóa hợp đồng của chính mình" 
ON contracts FOR DELETE 
USING (auth.uid() = user_id);

-- Bảng contract_chunks
CREATE POLICY "Người dùng chỉ có thể xem chunk thuộc hợp đồng của mình" 
ON contract_chunks FOR SELECT 
USING (contract_id IN (SELECT id FROM contracts WHERE user_id = auth.uid()));

CREATE POLICY "Người dùng có thể thêm chunk cho hợp đồng của mình" 
ON contract_chunks FOR INSERT 
WITH CHECK (contract_id IN (SELECT id FROM contracts WHERE user_id = auth.uid()));

CREATE POLICY "Người dùng có thể xóa chunk thuộc hợp đồng của mình" 
ON contract_chunks FOR DELETE 
USING (contract_id IN (SELECT id FROM contracts WHERE user_id = auth.uid()));

-- Bảng risks
CREATE POLICY "Người dùng chỉ có thể xem risks thuộc hợp đồng của mình" 
ON risks FOR SELECT 
USING (contract_id IN (SELECT id FROM contracts WHERE user_id = auth.uid()));

CREATE POLICY "Người dùng có thể thêm risks cho hợp đồng của mình" 
ON risks FOR INSERT 
WITH CHECK (contract_id IN (SELECT id FROM contracts WHERE user_id = auth.uid()));

CREATE POLICY "Người dùng có thể cập nhật risks thuộc hợp đồng của mình" 
ON risks FOR UPDATE 
USING (contract_id IN (SELECT id FROM contracts WHERE user_id = auth.uid()));

CREATE POLICY "Người dùng có thể xóa risks thuộc hợp đồng của mình" 
ON risks FOR DELETE 
USING (contract_id IN (SELECT id FROM contracts WHERE user_id = auth.uid()));
