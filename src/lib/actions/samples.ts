"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ENGINE_VERSION, SAMPLE_CATEGORIES } from "../style-engine/constants";
import { analyzeText } from "../style-engine/features";
import { createClient } from "../supabase/server";
import { regenerateProfile } from "./profile";

export async function addSampleAction(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "其他");
  const content = String(formData.get("content") ?? "").trim();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!title || !content || !SAMPLE_CATEGORIES.includes(category as never)) {
    redirect("/samples/new?error=请填写标题、分类和正文");
  }

  const features = analyzeText(content);
  const { data: sample, error } = await supabase
    .from("writing_samples")
    .insert({
      user_id: user.id,
      title,
      category,
      content,
      char_count: features.charCount,
    })
    .select("id")
    .single();

  if (error || !sample) {
    redirect(`/samples/new?error=${encodeURIComponent(error?.message ?? "保存失败")}`);
  }

  const { error: featureError } = await supabase.from("sample_features").insert({
    sample_id: sample.id,
    user_id: user.id,
    engine_version: ENGINE_VERSION,
    features_json: features,
  });

  if (featureError) {
    redirect(`/samples/new?error=${encodeURIComponent(featureError.message)}`);
  }

  await regenerateProfile(user.id);
  revalidatePath("/dashboard");
  revalidatePath("/samples");
  revalidatePath("/profile");
  redirect(`/samples/${sample.id}`);
}

export async function deleteSampleAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { error } = await supabase.from("writing_samples").delete().eq("id", id).eq("user_id", user.id);
  if (error) {
    throw new Error(error.message);
  }

  await regenerateProfile(user.id);
  revalidatePath("/dashboard");
  revalidatePath("/samples");
  revalidatePath("/profile");
  redirect("/samples");
}
