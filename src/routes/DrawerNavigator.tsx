import React, {
   type ReactNode,
   useEffect,
   useMemo,
   useState,
   createContext,
   useContext,
   type CSSProperties,
} from "react";
import {
   Routes,
   Route,
   Navigate,
   useLocation,
   useNavigate,
} from "react-router-dom";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { useAutenticacao } from "../hooks/useAutenticacao";

/**
 * Tipos
 */
export type DrawerIconProps = { color: string; size?: number };

type DrawerToggleProps = {
   size?: number;
   ariaLabel?: string;
   style?: CSSProperties;
};

export type ScreenOptions = {
   headerShown?: boolean;
   headerTitle?: string;
   headerRight?: () => ReactNode;
   headerLeft?: () => ReactNode;
   drawerLabel?: string;
   drawerIcon?: (props: DrawerIconProps) => ReactNode;
   drawerItemStyle?: React.CSSProperties;
};

export type ScreenConfig = {
   name: string;              // identificador (ex: EnumRotaPrivada.Principal)
   path?: string;             // opcional (ex: "principal" ou "/principal")
   component: React.ComponentType<any>;
   options?: ScreenOptions;
};

export type NavigatorProps = {
   children: React.ReactElement<any>[]; // <Screen .../>
   initialRouteName: string;            // "Principal" ou "CalcTaxas"
};

type NavigationSetOptions =
   | ScreenOptions
   | ((prev?: ScreenOptions) => ScreenOptions | undefined);

export type DrawerNavigation = {
   navigate: (to: string) => void;
   goBack: () => void;
   setOptions: (opts: NavigationSetOptions) => void;
   openDrawer: () => void;
   closeDrawer: () => void;
   toggleDrawer: () => void;
};

const NavigationContext = createContext<DrawerNavigation | undefined>(undefined);

export const useDrawerNavigation = () => {
   const ctx = useContext(NavigationContext);
   if (!ctx) throw new Error("useDrawerNavigation must be used inside Navigator");
   return ctx;
};

export const Screen = (_props: any) => null;


function toRelPath(input: string) {
   // garante "calcTaxas" (sem barra no início)
   return (input ?? "").replace(/^\//, "");
}
function toAbsPath(input: string) {
   const rel = toRelPath(input);
   return `/${rel}`;
}

export function Navigator({ children, initialRouteName }: NavigatorProps) {
   const { usuario, logout } = useAutenticacao();
   const navigateRR = useNavigate();
   const location = useLocation();

   const [drawerOpen, setDrawerOpen] = useState(false);

   // options dinâmicas por rota (setOptions)
   const [dynamicOptionsMap, setDynamicOptionsMap] = useState<
      Record<string, ScreenOptions>
   >({});

   // extrai screens do JSX
   const screens: ScreenConfig[] = useMemo(() => {
      return React.Children.toArray(children)
         .filter(React.isValidElement)
         .map((child: React.ReactElement<any>) => {
            const { name, path, component, options } = child.props;

            // IMPORTANTE: padronizar paths INTERNOS como RELATIVOS
            // se não informar path, vira o próprio name (ex: "principal")
            const relPath = toRelPath(path ?? String(name));

            return {
               name: String(name),
               path: relPath,
               component,
               options,
            } as ScreenConfig;
         });
   }, [children]);

   // pathname atual (ABS) -> REL
   const currentPathRel = toRelPath(location.pathname);

   // encontra a screen atual por path REL (preferência) ou por name fallback
   const currentScreen =
      screens.find((s) => (s.path ?? "").toLowerCase() === currentPathRel.toLowerCase()) ??
      screens.find((s) => s.name === initialRouteName) ??
      screens[0];

   const currentRouteName = currentScreen?.name ?? initialRouteName;

   const mergedOptions: ScreenOptions = {
      ...(currentScreen?.options ?? {}),
      ...(dynamicOptionsMap[currentRouteName] ?? {}),
   };

   const navigation: DrawerNavigation = useMemo(
      () => ({
         navigate: (to: string) => {
            // aceita: "CalcTaxas" (name), "calcTaxas" (path rel), "/calcTaxas" (abs)
            if (to.startsWith("/")) {
               navigateRR(to);
               return;
            }

            // 1) tenta achar por name
            const byName = screens.find((s) => s.name === to);
            if (byName) {
               navigateRR(toAbsPath(byName.path ?? byName.name));
               return;
            }

            // 2) assume que é path relativo
            navigateRR(toAbsPath(to));
         },
         goBack: () => navigateRR(-1),
         setOptions: (opts: NavigationSetOptions) => {
            setDynamicOptionsMap((prev) => {
               const prevForRoute = prev[currentRouteName] ?? {};
               const next =
                  typeof opts === "function" ? (opts(prevForRoute) ?? {}) : opts;
               return {
                  ...prev,
                  [currentRouteName]: { ...prevForRoute, ...next },
               };
            });
         },
         openDrawer: () => setDrawerOpen(true),
         closeDrawer: () => setDrawerOpen(false),
         toggleDrawer: () => setDrawerOpen((v) => !v),
      }),
      [navigateRR, screens, currentRouteName]
   );

   // sempre que mudar rota, fecha drawer
   useEffect(() => {
      setDrawerOpen(false);
   }, [location.pathname]);

   const initialRel = toRelPath(
      screens.find((s) => s.name === initialRouteName)?.path ?? initialRouteName
   );

   return (
      <NavigationContext.Provider value={navigation}>
         <div
            style={{
               display: "flex",
               width: "100vw",
               height: "100vh",
               overflow: "hidden",
               backgroundColor: 'var(--bg)',
            }}
         >
            {/* Backdrop */}
            <div
               onClick={() => setDrawerOpen(false)}
               style={{
                  position: "fixed",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.45)",
                  opacity: drawerOpen ? 1 : 0,
                  visibility: drawerOpen ? "visible" : "hidden",
                  transition: "opacity 180ms, visibility 180ms",
                  zIndex: 50,
               }}
            />

            {/* Drawer */}
            <aside
               style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: 290,
                  transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
                  transition: "transform 240ms cubic-bezier(0.4,0,0.2,1)",
                  zIndex: 60,
                  backgroundColor: 'var(--drawerCard)',
                  boxShadow: "4px 0 14px rgba(0,0,0,0.18)",
                  display: "flex",
                  flexDirection: "column",
               }}
            >
               {/* Cabeçalho do drawer com info do usuário */}
               <div
                  style={{
                     padding: "20px 16px 16px",
                     borderBottom: `1px solid var(--bg)30`,
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "space-between",
                  }}
               >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                     {usuario?.photoURL ? (
                        <img
                           src={usuario.photoURL}
                           alt={usuario.displayName ?? ''}
                           style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }}
                        />
                     ) : (
                        <div
                           style={{
                              width: 44, height: 44, borderRadius: "50%",
                              backgroundColor: 'var(--text)',
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 18, fontWeight: 700, color: "#fff",
                           }}
                        >
                           {(usuario?.displayName ?? "U")[0].toUpperCase()}
                        </div>
                     )}
                     <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>
                           {usuario?.displayName ?? "Usuário"}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-h)', marginTop: 2 }}>
                           {usuario?.email ?? ""}
                        </div>
                     </div>
                  </div>
                  <button
                     onClick={() => setDrawerOpen(false)}
                     aria-label="Fechar menu"
                     style={{ border: 0, background: "transparent", cursor: "pointer", color: 'var(--text-h)' }}
                  >
                     <FiX size={20} />
                  </button>
               </div>

               <nav style={{ padding: 12, overflowY: "auto" }}>
                  {screens.map((screen) => {
                     const hidden = screen.options?.drawerItemStyle?.display === "none";
                     if (hidden) return null;

                     const pathRel = toRelPath(screen.path ?? screen.name);
                     const isActive =
                        pathRel.toLowerCase() === currentPathRel.toLowerCase();

                     return (
                        <button
                           key={screen.name}
                           onClick={() => navigateRR(toAbsPath(pathRel))}
                           style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              padding: "12px 14px",
                              marginBottom: 8,
                              border: "none",
                              borderRadius: 12,
                              cursor: "pointer",
                              textAlign: "left",
                              backgroundColor: isActive
                                 ? 'var(--text)' + "18"
                                 : "transparent",
                              color: isActive
                                 ? 'var(--text)'
                                 : 'var(--text-h)',
                              fontSize: 16,
                              fontWeight: isActive ? 700 : 500,
                              ...screen.options?.drawerItemStyle,
                           }}
                        >
                           {screen.options?.drawerIcon?.({
                              color: isActive
                                 ? 'var(--text)'
                                 : 'var(--text-h)',
                              size: 20,
                           })}
                           <span>{screen.options?.drawerLabel ?? screen.name}</span>
                        </button>
                     );
                  })}
               </nav>


               <button
                  onClick={async () => { await logout(); navigateRR("/login"); }}
                  style={{
                     display: "flex", alignItems: "center", gap: 12,
                     width: "100%", padding: "16px 20px",
                     border: "none", borderTop: `1px solid var(--bg)30`,
                     background: "transparent", cursor: "pointer",
                     color: 'var(--text-h)', fontSize: 15,
                     position: "absolute", bottom: 10, left: 0, right: 0,
                  }}
               >
                  <FiLogOut size={20} />
                  <span>Sair</span>
               </button>
            </aside>

            {/* Main */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
               {/* Header */}
               {mergedOptions.headerShown !== false && (
                  <header
                     style={{
                        height: 56,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 16px",
                        backgroundColor: 'var(--bg-input',
                        borderBottom: `1px solid var(--bg)10`,
                        boxShadow: "4px 0 14px rgba(0,0,0,0.18)",
                     }}
                  >
                     <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <button
                           onClick={() => setDrawerOpen(true)}
                           aria-label="Abrir menu"
                           style={{
                              border: 0,
                              background: "transparent",
                              cursor: "pointer",
                              color: 'var(--text)',
                           }}
                        >
                           <FiMenu size={22} />
                        </button>

                        <div style={{ fontWeight: 500, color: 'var(--text)', fontSize: 14 }}>
                           {mergedOptions.headerTitle ?? currentScreen?.options?.headerTitle ?? currentScreen?.name}
                        </div>
                     </div>

                     <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {mergedOptions.headerRight ? mergedOptions.headerRight() : null}
                     </div>
                  </header>
               )}

               {/* Content */}
               <main style={{ flex: 1, overflowY: "auto" }}>
                  <Routes>
                     {/* rotas internas (RELATIVAS) */}
                     {screens.map((screen) => (
                        <Route
                           key={screen.name}
                           path={toRelPath(screen.path ?? screen.name)}
                           element={React.createElement(screen.component)}
                        />
                     ))}

                     {/* default: abre a tela inicial (index) */}
                     <Route index element={<Navigate to={initialRel} replace />} />

                     {/* fallback */}
                     <Route path="*" element={<Navigate to={initialRel} replace />} />
                  </Routes>
               </main>
            </div>
         </div>
      </NavigationContext.Provider>
   );
}

export function DrawerToggleButton({
   size = 22,
   ariaLabel = "Abrir menu",
   style,
}: DrawerToggleProps) {
   const nav = useDrawerNavigation();

   return (
      <button
         onClick={nav.openDrawer}
         aria-label={ariaLabel}
         style={{
            border: 0,
            background: "transparent",
            cursor: "pointer",
            color: 'var(--text)',
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            paddingRight: 14,
            ...style,
         }}
      >
         <FiMenu size={size} />
      </button>
   );
}