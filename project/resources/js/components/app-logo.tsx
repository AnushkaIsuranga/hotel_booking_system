import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-9 items-center justify-center rounded-xl shadow-sm">
                <AppLogoIcon className="size-6 text-white" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">Asteria Desk</span>
                <span className="text-sidebar-foreground/70 truncate text-xs">Hotel operations</span>
            </div>
        </>
    );
}
