"use server";

import { ENGINE_VERSION } from "../style-engine/constants";
import { compareTextToProfile } from "../style-engine/compare";
import type { CompareResult, StyleProfile } from "../style-engine/types";
import { createClient } from "../supabase/server";

export async function compareAction(content: string): Promise<CompareResult | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "请先登录。" };
  }

  const { data, error } = await supabase
    .from("style_profiles")
    .select("profile_json")
    .eq("user_id", user.id)
    .eq("engine_version", ENGINE_VERSION)
    .maybeSingle();

  if (error || !data) {
    return { error: "还没有可用的文风画像，请先添加文本样本。" };
  }

  return compareTextToProfile(content, data.profile_json as StyleProfile);
}
