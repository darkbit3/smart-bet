import { useEffect, useMemo, useState } from "react";

type UseFormRateLimiterOptions = {
  maxAttempts?: number;
  lockoutMinutes?: number;
  cooldownSeconds?: number;
};

export function useFormRateLimiter(options: UseFormRateLimiterOptions = {}) {
  const { maxAttempts = 5, lockoutMinutes = 5, cooldownSeconds = 2 } = options;

  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLocked = useMemo(() => {
    if (!lockedUntil) return false;
    return Date.now() < lockedUntil;
  }, [lockedUntil]);

  const lockoutRemainingMs = useMemo(() => {
    if (!lockedUntil) return 0;
    return Math.max(0, lockedUntil - Date.now());
  }, [lockedUntil]);

  const cooldownRemainingMs = useMemo(() => {
    if (!cooldownUntil) return 0;
    return Math.max(0, cooldownUntil - Date.now());
  }, [cooldownUntil]);

  useEffect(() => {
    if (!isLocked && lockedUntil) {
      setLockedUntil(null);
      setAttempts(0);
    }
  }, [isLocked, lockedUntil]);

  const registerAttempt = () => {
    setAttempts((prev) => {
      const next = prev + 1;
      if (next >= maxAttempts) {
        setLockedUntil(Date.now() + lockoutMinutes * 60 * 1000);
      }
      return next;
    });
  };

  const startCooldown = () => {
    setCooldownUntil(Date.now() + cooldownSeconds * 1000);
  };

  const trySubmit = async (fn: () => Promise<void> | void) => {
    if (isLocked) {
      throw new Error("Form is locked due to repeated attempts. Please wait.");
    }
    if (isSubmitting || (cooldownUntil && Date.now() < cooldownUntil)) {
      throw new Error("Please wait before trying again.");
    }

    setIsSubmitting(true);
    startCooldown();

    try {
      await fn();
      setAttempts(0);
    } catch (error) {
      registerAttempt();
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isLocked,
    lockoutRemainingMs,
    cooldownRemainingMs,
    attempts,
    isSubmitting,
    trySubmit,
  };
}
