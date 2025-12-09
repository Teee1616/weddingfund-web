// app/projects/[slug]/_components/ProfileSection.tsx
import type { PersonProfile } from "../types";

type Props = {
  groom: PersonProfile | null;
  bride: PersonProfile | null;
};

export function ProfileSection({ groom, bride }: Props) {
  if (!groom && !bride) return null;

  return (
    <section className="bg-white rounded-3xl shadow-sm px-8 py-10 space-y-8">
      <header className="space-y-1">
        <p className="text-xs tracking-[0.2em] text-neutral-500">PROFILE</p>
        <h2 className="text-lg font-semibold text-[#7b4a3a]">
          新郎新婦のプロフィール
        </h2>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {groom && <ProfileCard roleLabel="YUDAI" profile={groom} />}
        {bride && <ProfileCard roleLabel="NATSU" profile={bride} />}
      </div>
    </section>
  );
}

type CardProps = {
  roleLabel: string;
  profile: PersonProfile;
};

function ProfileCard({ roleLabel, profile }: CardProps) {
  return (
    <div className="flex gap-6">
      <div className="w-32 h-40 rounded-xl bg-[#e7f3fb] overflow-hidden flex-shrink-0">
        {profile.profileImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.profileImageUrl}
            alt={profile.fullNameJa}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-400">
            PHOTO
          </div>
        )}
      </div>

      <div className="flex-1 space-y-2 text-sm leading-relaxed">
        {profile.fullNameRomaji && (
          <p className="text-[11px] tracking-[0.25em] text-neutral-500 uppercase">
            {profile.fullNameRomaji}
          </p>
        )}
        <p className="text-base font-semibold">{profile.fullNameJa}</p>

        <dl className="mt-2 space-y-1 text-xs">
          {profile.birthDate && (
            <div className="flex">
              <dt className="w-16 text-neutral-500">誕生日</dt>
              <dd>{profile.birthDate}</dd>
            </div>
          )}
          {profile.birthPlace && (
            <div className="flex">
              <dt className="w-16 text-neutral-500">出身地</dt>
              <dd>{profile.birthPlace}</dd>
            </div>
          )}
          {profile.bloodType && (
            <div className="flex">
              <dt className="w-16 text-neutral-500">血液型</dt>
              <dd>{profile.bloodType}</dd>
            </div>
          )}
        </dl>

        {profile.oneLiner && (
          <p className="mt-2 text-xs text-neutral-700 whitespace-pre-line">
            {profile.oneLiner}
          </p>
        )}

        <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-neutral-500">
          {roleLabel}
        </p>
      </div>
    </div>
  );
}
