import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

const { mockChangeLanguage, mockI18n } = vi.hoisted(() => {
  const mockChangeLanguage = vi.fn();
  const state: { language: string } = { language: 'en' };
  const mockI18n = {
    get i18n() {
      return {
        language: state.language,
        changeLanguage: mockChangeLanguage,
      };
    },
  };
  return { mockChangeLanguage, mockI18n };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => mockI18n,
}));

import LanguageSwitcher from '../LanguageSwitcher';

describe('LanguageSwitcher', () => {
  it('renders correctly', () => {
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button', { name: /toggle language/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('DE');
  });

  it('toggles language when clicked', () => {
    render(<LanguageSwitcher />);
    
    const button = screen.getByRole('button', { name: /toggle language/i });
    fireEvent.click(button);
    
    expect(mockChangeLanguage).toHaveBeenCalledWith('de');
  });
});
