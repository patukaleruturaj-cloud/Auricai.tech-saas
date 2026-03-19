-- 1. Update the 'free' plan reference tier
UPDATE public.plans 
SET credits_per_month = 3 
WHERE name = 'free';

-- 2. Update default limits on the wallet table for future rows
ALTER TABLE public.wallet ALTER COLUMN monthly_limit SET DEFAULT 3;
ALTER TABLE public.wallet ALTER COLUMN credits_remaining SET DEFAULT 3;

-- 3. Update the backend RPC that provisions NEW users on signup
CREATE OR REPLACE FUNCTION public.provision_wallet_v2(
    p_clerk_id TEXT,
    p_email TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_profile_id UUID;
    v_safe_email TEXT;
    v_default_credits INTEGER := 3; -- <-- Reduced from 5 to 3
BEGIN
    v_safe_email := COALESCE(p_email, 'user_' || p_clerk_id || '@generated.com');
    
    -- Find existing profile
    SELECT id INTO v_profile_id FROM public.profiles WHERE clerk_id = p_clerk_id;
    
    -- Or create new profile
    IF v_profile_id IS NULL THEN
        INSERT INTO public.profiles (clerk_id, email)
        VALUES (p_clerk_id, v_safe_email)
        ON CONFLICT (clerk_id) DO NOTHING
        RETURNING id INTO v_profile_id;
        
        IF v_profile_id IS NULL THEN
            SELECT id INTO v_profile_id FROM public.profiles WHERE clerk_id = p_clerk_id;
        END IF;
    END IF;

    -- Create Wallet with 3 Credits
    INSERT INTO public.wallet (user_id, monthly_limit, credits_remaining, addon_credits)
    VALUES (v_profile_id, v_default_credits, v_default_credits, 0)
    ON CONFLICT (user_id) DO NOTHING;

    -- Create Free Subscription record
    INSERT INTO public.subscriptions_v2 (user_id, plan_type, billing_cycle, status)
    VALUES (v_profile_id, 'free', 'monthly', 'active')
    ON CONFLICT (user_id) DO NOTHING;

    RETURN v_profile_id;
END;
$$;
