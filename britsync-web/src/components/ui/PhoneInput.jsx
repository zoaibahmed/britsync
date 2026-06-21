import React, { useState } from 'react';
import './PhoneInput.css';

const countries = [
    { code: '+1', name: 'United States', flag: '🇺🇸', iso: 'US' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧', iso: 'GB' },
    { code: '+92', name: 'Pakistan', flag: '🇵🇰', iso: 'PK' },
    { code: '+971', name: 'United Arab Emirates', flag: '🇦🇪', iso: 'AE' },
    { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦', iso: 'SA' },
    { code: '+91', name: 'India', flag: '🇮🇳', iso: 'IN' },
    { code: '+880', name: 'Bangladesh', flag: '🇧🇩', iso: 'BD' },
    { code: '+86', name: 'China', flag: '🇨🇳', iso: 'CN' },
    { code: '+81', name: 'Japan', flag: '🇯🇵', iso: 'JP' },
    { code: '+82', name: 'South Korea', flag: '🇰🇷', iso: 'KR' },
    { code: '+65', name: 'Singapore', flag: '🇸🇬', iso: 'SG' },
    { code: '+61', name: 'Australia', flag: '🇦🇺', iso: 'AU' },
    { code: '+49', name: 'Germany', flag: '🇩🇪', iso: 'DE' },
    { code: '+33', name: 'France', flag: '🇫🇷', iso: 'FR' },
    { code: '+39', name: 'Italy', flag: '🇮🇹', iso: 'IT' },
    { code: '+34', name: 'Spain', flag: '🇪🇸', iso: 'ES' },
    { code: '+7', name: 'Russia', flag: '🇷🇺', iso: 'RU' },
    { code: '+55', name: 'Brazil', flag: '🇧🇷', iso: 'BR' },
    { code: '+27', name: 'South Africa', flag: '🇿🇦', iso: 'ZA' },
    { code: '+234', name: 'Nigeria', flag: '🇳🇬', iso: 'NG' },
    { code: '+20', name: 'Egypt', flag: '🇪🇬', iso: 'EG' },
    { code: '+90', name: 'Turkey', flag: '🇹🇷', iso: 'TR' },
    { code: '+60', name: 'Malaysia', flag: '🇲🇾', iso: 'MY' },
    { code: '+62', name: 'Indonesia', flag: '🇮🇩', iso: 'ID' },
    { code: '+63', name: 'Philippines', flag: '🇵🇭', iso: 'PH' },
    { code: '+66', name: 'Thailand', flag: '🇹🇭', iso: 'TH' },
    { code: '+84', name: 'Vietnam', flag: '🇻🇳', iso: 'VN' },
    { code: '+52', name: 'Mexico', flag: '🇲🇽', iso: 'MX' },
    { code: '+54', name: 'Argentina', flag: '🇦🇷', iso: 'AR' },
    { code: '+56', name: 'Chile', flag: '🇨🇱', iso: 'CL' },
];

const PhoneInput = ({ value, onChange, required = false }) => {
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.includes(searchTerm)
    );

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setIsDropdownOpen(false);
        setSearchTerm('');
    };

    const handlePhoneChange = (e) => {
        const phoneNumber = e.target.value.replace(/[^0-9]/g, ''); // Only numbers
        onChange(`${selectedCountry.code}${phoneNumber}`);
    };

    // Extract phone number without country code for display
    const displayValue = value ? value.replace(selectedCountry.code, '') : '';

    return (
        <div className="phone-input-container">
            <div className="phone-input-wrapper">
                <div className="country-selector" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <span className="country-flag">{selectedCountry.flag}</span>
                    <span className="country-code">{selectedCountry.code}</span>
                    <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                <input
                    type="tel"
                    className="phone-number-input"
                    placeholder="123 456 7890"
                    value={displayValue}
                    onChange={handlePhoneChange}
                    required={required}
                />

                {isDropdownOpen && (
                    <div className="country-dropdown">
                        <div className="dropdown-search">
                            <input
                                type="text"
                                placeholder="Search country..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                        <div className="country-list">
                            {filteredCountries.map((country) => (
                                <div
                                    key={country.iso}
                                    className={`country-option ${selectedCountry.iso === country.iso ? 'selected' : ''}`}
                                    onClick={() => handleCountrySelect(country)}
                                >
                                    <span className="country-flag">{country.flag}</span>
                                    <span className="country-name">{country.name}</span>
                                    <span className="country-code-option">{country.code}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhoneInput;
