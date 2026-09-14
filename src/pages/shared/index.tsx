import { createPlaceholderPage } from '../PlaceholderPage';

export const ForgotPasswordPage = createPlaceholderPage('ForgotPasswordPage', 'Shared');
export const ResetPasswordPage = createPlaceholderPage('ResetPasswordPage', 'Shared');
export const VerifyEmailPage = createPlaceholderPage('VerifyEmailPage', 'Shared');
export const TermsPage = createPlaceholderPage('TermsPage', 'Shared');
export const PrivacyPage = createPlaceholderPage('PrivacyPage', 'Shared');
export const CookiesPage = createPlaceholderPage('CookiesPage', 'Shared');
export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="border border-[#E8E4DD] bg-[#FFFFFF] rounded-lg p-6 max-w-md w-full shadow-none">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#D97706] mb-1.5 block">
          404 Not Found
        </span>
        <h1 className="font-serif text-2xl font-bold text-[#1A1F1D]">Page Not Found</h1>
        <p className="text-xs text-[#5F6B66] mt-2 mb-5">
          The requested route is not available in the current portal build.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 bg-[#D97706] text-white text-xs font-semibold rounded hover:bg-[#B45309] transition-colors"
        >
          Return to Portal Home
        </a>
      </div>
    </div>
  );
};
NotFoundPage.displayName = 'NotFoundPage (404)';
