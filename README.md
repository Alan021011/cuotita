# Cuotita

Fondo de auxilio mutuo P2P para motorepartidores (PedidosYa, Yango Delivery, etc.) en Bolivia.

Un grupo cerrado de repartidores de una misma parada aporta una cuota periódica pequeña a un pozo común en USDC. Cuando a alguien se le rompe algo del trabajo — pantalla de celular, freno, retrovisor, llanta — reporta el daño con una foto, los delegados del grupo lo revisan y aprueban, y el fondo le transfiere el dinero directo a su wallet, sin trámites ni papeleo.

Construido para el Track de Pollar de la Buildathon Ethereum Bolivia (Cochabamba, 2026), sobre la plantilla [`money-pool`](https://github.com/pollar-xyz/pollar-apps/tree/main/apps/money-pool) de `pollar-apps`.

**Demo pública:** [cuotita-delta.vercel.app](https://cuotita-delta.vercel.app) — corriendo en mainnet real.

**Transacción real verificada:** aporte de USDC en mainnet, confirmado — [`0db2e31a4265340aa74b4bd809e1b347e4624887cdc41a3c2a1e45fd30cc469a`](https://stellar.expert/explorer/public/tx/0db2e31a4265340aa74b4bd809e1b347e4624887cdc41a3c2a1e45fd30cc469a).

## El problema

Más del 80% de los trabajadores urbanos en Bolivia operan en el sector informal. Los motorepartidores no tienen seguro de accidentes ni de sus herramientas de trabajo. Un percance material común (una pantalla rota, un freno dañado) cuesta entre Bs 150 y Bs 400 y los deja sin poder trabajar 2-3 días — sin liquidez inmediata para el repuesto ni acceso a un seguro tradicional que cubra daños menores.

## Cómo funciona

1. **Fondo común** (`/pool/[id]`) — el organizador crea el fondo, los repartidores lo encuentran por link/QR y aportan su cuota en USDC directo a la wallet del fondo.
2. **Solicitud de auxilio** (`/pool/[id]/claim/new`) — el repartidor afectado elige el tipo de daño, el monto en USDC que necesita y sube una foto (y opcionalmente la cotización).
3. **Panel de delegados** (`/pool/[id]/claims`) — los delegados designados del grupo revisan la foto y aprueban o rechazan. Se necesitan 2 votos del mismo lado para resolver el reclamo (quórum simétrico).
4. **Pago** — una vez aprobado, el organizador transfiere el monto directo a la wallet Pollar del beneficiario con un clic.

## Integración con Pollar

Esta app usa `@pollar/core` / `@pollar/react` para todo el ciclo de dinero — login, saldo y pagos reales en Stellar. No hay pagos simulados: cada aporte y cada pago de reclamo es una transacción on-chain verificada contra el RPC de Stellar antes de guardarse.

| Dónde | Qué hace |
|---|---|
| [`lib/pollar.tsx`](lib/pollar.tsx) | Inicializa el único `PollarClient` de la app (mainnet o testnet según el prefijo de la publishable key). |
| [`hooks/usePollarAuth.ts`](hooks/usePollarAuth.ts) | Login/logout con Pollar; `user.address` identifica a cada repartidor/delegado. |
| [`components/ContributeButton.tsx`](components/ContributeButton.tsx) | Aporte de cuota: `runTx('payment', ...)` del repartidor a la wallet del fondo (plantilla original, sin modificar). |
| [`components/PayoutButton.tsx`](components/PayoutButton.tsx) | Pago del reclamo aprobado: mismo primitivo `runTx('payment', ...)`, del organizador al beneficiario, con el id del reclamo como memo. |
| [`lib/stellar.ts`](lib/stellar.ts) → `verifyTxOnRPC` | Verifica cada transacción (aporte o pago de reclamo) contra el RPC de Stellar — destino, monto y asset correctos — antes de marcarla como confirmada. Nunca se confía en lo que el cliente dice que pasó. |
| [`app/api/claims/[id]/pay/route.ts`](app/api/claims/[id]/pay/route.ts) | Solo el organizador (dueño de la wallet del fondo) puede ejecutar un pago, y solo si el reclamo ya juntó el quórum de aprobaciones. |
| [`lib/server-auth.ts`](lib/server-auth.ts) | Cada acción sensible (reportar reclamo, votar, pagar) requiere una firma SEP-53 fresca del usuario — no solo confiar en quién dice ser. |

### Por qué el pago va wallet-a-wallet y no vía QR bancario directo

Evaluamos usar el ramp bancario de Pollar (`openRampModal`, SEP-24) para que el pago del reclamo llegue directo a una cuenta en bolivianos. Confirmamos con la documentación oficial del SDK que ese ramp siempre deposita/retira a la wallet del usuario autenticado — no admite un destinatario distinto — y que Bolivia/BOB no está documentado como país soportado. Por eso el flujo real usa el primitivo de pago P2P que el propio SDK ya expone (el mismo que usa `money-pool`): el organizador paga directo a la wallet Pollar del beneficiario. Si el beneficiario quiere retirar a bolivianos después, puede hacer su propio off-ramp desde su cuenta — eso queda fuera del alcance de este MVP.

## Cómo correrlo

```bash
npm install
cp .env.example .env
# Pega tu publishable key de dashboard.pollar.xyz (Build → API Keys) en .env
npm run dev
```

Sin `DATABASE_URL` configurado, la app usa SQLite local (`data/local.db`) automáticamente — no hace falta levantar Neon para desarrollar.

## Estado actual / limitaciones conocidas

- **Custodia**: el fondo no usa un contrato de escrow — los aportes van directo a la wallet Pollar del organizador, que actúa como custodio. Es una limitación deliberada del MVP (mismo patrón usado en otros fondos comunitarios construidos con este equipo), documentada acá, no un bug.
- **Sin tests automatizados** todavía para `lib/claims.ts` / `lib/delegates.ts` (sí corren los 32 tests originales de la plantilla `money-pool`, sin regresiones).
- El pago del reclamo asume que el beneficiario ya tiene o puede crear su propia wallet Pollar — no hay onboarding asistido para eso en este MVP.

## Qué sigue (post-hackathon)

Alianzas con mecánicos, repuesteras y vendedores de equipo de protección (cascos, guantes, chalecos) verificados — cobrando todos a través del mismo riel de Pollar, para que el fondo no solo pague el daño sino conecte directo con quien lo repara.
