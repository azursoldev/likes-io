# Revert guide: SMM panel / YouTube checkout integration (2025-03-22)

This file records changes made so a future request like **“revert the SMM YouTube panel changes documented in REVERT-SMM-YOUTUBE-PANEL-2025-03-22.md”** can be executed without guessing.

## Purpose of the original change

- YouTube final checkout was not sending `packageServiceId` (from URL `serviceId`) to `/api/payments/create`, so orders could bind to a `Service` row with `japServiceId = null` and webhooks skipped the panel.
- Service resolution used a single `findFirst`; it now prefers an active service that already has `japServiceId`.
- Wallet payments did not submit to the panel after success.
- `japAPI.createOrder` now validates panel `error` responses and missing order ids.
- Duplicated JAP-submit logic in webhooks was centralized in `lib/fulfill-jap-order.ts`.

## Fastest revert (Git)

If these edits are contained in one commit (or a known range):

```bash
git log --oneline -- docs/REVERT-SMM-YOUTUBE-PANEL-2025-03-22.md lib/fulfill-jap-order.ts
# Then either:
git revert <commit-sha>
# Or restore files from parent commit:
git checkout <parent-sha> -- <paths listed below>
```

If you use `git checkout <sha> -- path`, include every path in **Files touched** and delete the new file.

## Files touched

| Action    | Path                                                                                    |
| --------- | --------------------------------------------------------------------------------------- |
| **Added** | `lib/fulfill-jap-order.ts`                                                              |
| **Added** | `docs/REVERT-SMM-YOUTUBE-PANEL-2025-03-22.md` (this doc)                                |
| Modified  | `lib/jap-api.ts` (`createOrder` response handling)                                      |
| Modified  | `app/api/payments/create/route.ts` (service lookup, wallet JAP, import)                 |
| Modified  | `app/api/webhooks/checkout/route.ts`                                                    |
| Modified  | `app/api/webhooks/bigpayme/route.ts`                                                    |
| Modified  | `app/api/webhooks/myfatoorah/route.ts`                                                  |
| Modified  | `app/api/webhooks/cryptomus/route.ts`                                                   |
| Modified  | `lib/ziina-order-sync.ts`                                                               |
| Modified  | `app/youtube/views/checkout/final/_components/YouTubeViewsCheckoutForm.tsx`             |
| Modified  | `app/youtube/subscribers/checkout/final/_components/YouTubeSubscribersCheckoutForm.tsx` |
| Modified  | `app/youtube/likes/checkout/final/FinalCheckoutClient.tsx`                              |

## Manual revert steps

### 1. Delete new helper

- Delete `lib/fulfill-jap-order.ts`.

### 2. `lib/jap-api.ts` — `createOrder`

Remove the block after `const response = await this.connect(orderData);` that:

- throws on `response?.error`
- parses `rawId` / `numericId` and throws if invalid

Restore the previous return shape:

```ts
const response = await this.connect(orderData);

return {
  order: response.order || response.id || 0,
  status: response.status,
  remains: response.remains,
  start_count: response.start_count,
  charge: response.charge,
  currency: response.currency,
};
```

### 3. `app/api/payments/create/route.ts`

- Remove: `import { trySubmitOrderToJap } from '@/lib/fulfill-jap-order';`
- Remove: `await trySubmitOrderToJap(order.id);` after the wallet `prisma.$transaction([...])` block.
- Replace the **two-step** service lookup (`platformEnum` / `serviceTypeEnum`, prefer `japServiceId: { not: null }`, then fallback) with a **single** `findFirst` when not resolved by `serviceId` or `packageServiceId`:

```ts
if (!service) {
  service = await prisma.service.findFirst({
    where: {
      platform: platform.toUpperCase() as Platform,
      serviceType: serviceType.toUpperCase() as ServiceType,
      isActive: true,
    },
  });
}
```

Remove the intermediate `const platformEnum` / `const serviceTypeEnum` block if nothing else needs them (or keep using `.toUpperCase()` inline as before).

### 4. Webhooks + Ziina — restore inline `japAPI` usage

For each file, change import from `trySubmitOrderToJap` back to `japAPI` where applicable, and replace `await trySubmitOrderToJap(order.id)` with the **previous** inline pattern.

**`app/api/webhooks/checkout/route.ts` and `app/api/webhooks/bigpayme/route.ts`** (same structure):

- Import: `import { japAPI } from '@/lib/jap-api';` (remove `fulfill-jap-order` import).
- Replace:

```ts
if (order) {
  await trySubmitOrderToJap(order.id);
}
```

with:

```ts
if (order && order.serviceId && order.link) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: order.serviceId },
    });

    if (service && service.japServiceId) {
      const japOrder = await japAPI.createOrder(
        service.japServiceId,
        order.link,
        order.quantity,
      );

      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PROCESSING",
          japOrderId: japOrder.order.toString(),
          japStatus: japOrder.status,
        },
      });
    }
  } catch (error: any) {
    console.error("Failed to create JAP order:", error);
  }
}
```

**`app/api/webhooks/myfatoorah/route.ts`**: same inline block as above (inside the success branch where `trySubmitOrderToJap` was called).

**`app/api/webhooks/cryptomus/route.ts`**:

- Import `japAPI` again; remove `fulfill-jap-order`.
- Replace `await trySubmitOrderToJap(order.id);` with the **Cryptomus-specific** version (JAP update did not set `status` on the order in the JAP block—only `japOrderId` / `japStatus`):

```ts
if (order.serviceId && order.link && order.service?.japServiceId) {
  try {
    const japOrder = await japAPI.createOrder(
      order.service.japServiceId,
      order.link,
      order.quantity,
    );

    await prisma.order.update({
      where: { id: order.id },
      data: {
        japOrderId: japOrder.order.toString(),
        japStatus: japOrder.status,
      },
    });
  } catch (error: any) {
    console.error("Failed to create JAP order after Cryptomus payment:", error);
  }
}
```

(Ensure the payment query still `include: { order: { include: { service: true } } }` if this block relies on `order.service`.)

**`lib/ziina-order-sync.ts`**:

- Import `japAPI` from `@/lib/jap-api`; remove `fulfill-jap-order`.
- Replace `await trySubmitOrderToJap(order.id);` with:

```ts
if (order.serviceId && order.link) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: order.serviceId },
    });
    if (service?.japServiceId) {
      const japOrder = await japAPI.createOrder(
        service.japServiceId,
        order.link,
        order.quantity,
      );
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PROCESSING",
          japOrderId: japOrder.order.toString(),
          japStatus: japOrder.status,
        },
      });
    }
  } catch (err: unknown) {
    console.error("[Ziina sync] JAP order error:", err);
  }
}
```

### 5. YouTube checkout UI — remove `packageServiceId`

**`YouTubeViewsCheckoutForm.tsx`**

- Remove state `packageServiceId` / `setPackageServiceId`.
- Remove `setPackageServiceId(sp.get("serviceId") || "");` from the URL `useEffect`.
- Remove `...(packageServiceId ? { packageServiceId } : {}),` from the `/api/payments/create` body.
- Revert the “Change” button `router.push` to not append `serviceId`.

**`YouTubeSubscribersCheckoutForm.tsx`**

- Remove `const packageServiceId = searchParams.get("serviceId") || "";`
- Remove `...(packageServiceId ? { packageServiceId } : {}),` from the payment body.

**`FinalCheckoutClient.tsx` (YouTube likes)**

- Remove `packageServiceId` state and URL parsing.
- Remove `...(packageServiceId ? { packageServiceId } : {}),` from the payment body.

### 6. This document

- Delete `docs/REVERT-SMM-YOUTUBE-PANEL-2025-03-22.md` after revert if you no longer want the record; or keep it and add a note that the revert was applied.

## Verify after revert

```bash
npx tsc --noEmit
```

Smoke: place a test order and confirm webhook behavior matches expectations for your environment.
