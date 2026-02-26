"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import ProfileForm from "@/components/ProfileForm";
import GrantResearchGuide from "@/components/GrantResearchGuide";

export default function StartPage() {
  const router = useRouter();
  const { profile, setProfile } = useApp();

  const handleSubmit = () => {
    if (profile.location === "not_england") {
      router.push("/not-eligible");
    } else {
      router.push("/route-picker");
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="space-y-4">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">
          Start your application
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
          Answer a few quick questions. This version supports Arts Council England routes only.
        </p>
      </header>

      <GrantResearchGuide />

      <ProfileForm
        value={profile}
        onChange={setProfile}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
