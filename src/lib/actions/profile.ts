"use server";

import { ENGINE_VERSION } from "../style-engine/constants";
import { buildStyleProfile } from "../style-engine/profile";
import type { TextFeatures } from "../style-engine/types";
import { createClient } from "../supabase/server";

export async function regenerateProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sample_features")
    .select("features_json")
    .eq("user_id", userId)
    .eq("engine_version", ENGINE_VERSION);

  if (error) {
    throw new Error(error.message);
  }

  const features = (data ?? []).map((row) => row.features_json as TextFeatures);
  const { profile, summaryText } = buildStyleProfile(features);

  const { error: upsertError } = await supabase.from("style_profiles").upsert(
    {
      user_id: userId,
      engine_version: ENGINE_VERSION,
      sample_count: profile.sampleCount,
      total_char_count: profile.totalCharCount,
      reliability_level: profile.reliabilityLevel,
      profile_json: profile,
      summary_text: summaryText,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,engine_version" },
  );

  if (upsertError) {
    throw new Error(upsertError.message);
  }
}
