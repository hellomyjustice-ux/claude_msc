import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants/site';

export default function Footer() {
  return (
    <footer className="border-t border-[#D4C49A] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-display text-lg text-[#2B3A4E]">{SITE_NAME}</p>
            <p className="text-xs text-[#7A8E9C] mt-1">{SITE_DESCRIPTION}</p>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-[#D4C49A]">
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
