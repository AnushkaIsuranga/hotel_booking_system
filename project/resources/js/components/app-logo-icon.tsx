import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path d="M7 19L24 7L41 19V39C41 40.1 40.1 41 39 41H9C7.9 41 7 40.1 7 39V19Z" fill="currentColor" opacity="0.18" />
            <path d="M24 7L41 19V39C41 40.1 40.1 41 39 41H9C7.9 41 7 40.1 7 39V19L24 7Z" stroke="currentColor" strokeWidth="2.5" />
            <path d="M18 41V27C18 23.6863 20.6863 21 24 21C27.3137 21 30 23.6863 30 27V41" stroke="currentColor" strokeWidth="2.5" />
            <path d="M13 24H16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M32 24H35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M24 11L30 16H18L24 11Z" fill="currentColor" />
        </svg>
    );
}
