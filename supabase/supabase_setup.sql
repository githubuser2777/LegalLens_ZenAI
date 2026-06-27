-- Kích hoạt extension pgvector trên PostgreSQL của Supabase
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    raw_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own contracts" 
ON public.contracts 
FOR ALL 
USING (auth.uid() = user_id);

CREATE TABLE public.contract_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(768) NULL,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

ALTER TABLE public.contract_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read chunks of their contracts" 
ON public.contract_chunks 
FOR SELECT 
USING (
    contract_id IN (
        SELECT id FROM public.contracts WHERE user_id = auth.uid()
    )
);

CREATE TABLE public.risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
    category VARCHAR(100) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('HIGH', 'MEDIUM', 'LOW')) NOT NULL,
    explanation TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    location_meta JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage risks of their contracts" 
ON public.risks 
FOR ALL 
USING (
    contract_id IN (
        SELECT id FROM public.contracts WHERE user_id = auth.uid()
    )
);

CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
    sender VARCHAR(10) CHECK (sender IN ('USER', 'AI')) NOT NULL,
    content TEXT NOT NULL,
    citations JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage chat messages of their contracts" 
ON public.chat_messages 
FOR ALL 
USING (
    contract_id IN (
        SELECT id FROM public.contracts WHERE user_id = auth.uid()
    )
);

CREATE OR REPLACE FUNCTION match_contract_chunks (
  query_embedding VECTOR(768),
  match_threshold FLOAT,
  match_count INT,
  filter_contract_id UUID
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    contract_chunks.id,
    contract_chunks.content,
    1 - (contract_chunks.embedding <=> query_embedding) AS similarity -- Cosine Similarity
  FROM contract_chunks
  WHERE contract_chunks.contract_id = filter_contract_id
    AND 1 - (contract_chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY contract_chunks.embedding <=> query_embedding ASC
  LIMIT match_count;
END;
$$;
