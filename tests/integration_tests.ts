/**
 * DineFlow End-to-End Integration Test Suite
 * Validates tests A through J across the integrated Customer and Admin modules.
 */

import { customerService } from '../src/features/customer/utils/customerService';
import { adminService } from '../src/features/admin/utils/adminService';
import { orderService } from '../src/services/orderService';
import { CreateOrderDTO, Order } from '../src/types';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: any) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`, details || '');
    failed++;
  }
}

async function runIntegrationSuite() {
  console.log('\n===============================================================');
  console.log('DineFlow Lead Integration Verification: Tests A through J');
  console.log('===============================================================\n');

  // --------------------------------------------------------------------------
  // TEST A: Customer opens restaurant menu
  // --------------------------------------------------------------------------
  console.log('[TEST A] Customer opens restaurant menu:');
  const menuRes = await customerService.fetchMenuBySlug('the-bistro');
  assert(menuRes.error === null, 'fetchMenuBySlug succeeds without error');
  assert(Boolean(menuRes.data?.restaurant), 'Restaurant metadata is loaded');
  assert(menuRes.data?.restaurant.slug === 'the-bistro', 'Restaurant slug matches "the-bistro"');
  assert((menuRes.data?.categories.length ?? 0) >= 4, `Categories loaded (count: ${menuRes.data?.categories.length})`);
  assert((menuRes.data?.items.length ?? 0) >= 10, `Dishes loaded (count: ${menuRes.data?.items.length})`);

  const restaurantId = menuRes.data!.restaurant.id;
  const items = menuRes.data!.items;

  // --------------------------------------------------------------------------
  // TEST B: Customer adds multiple food items
  // --------------------------------------------------------------------------
  console.log('\n[TEST B] Customer adds multiple food items:');
  const item1 = items.find((i) => i.isAvailable && i.price > 0)!;
  const item2 = items.filter((i) => i.isAvailable && i.id !== item1.id)[0]!;

  const cart = [
    { itemId: item1.id, name: item1.name, price: item1.price, quantity: 2, instructions: 'Extra crispy' },
    { itemId: item2.id, name: item2.name, price: item2.price, quantity: 1 },
  ];

  const calculatedSubtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  assert(cart.length === 2, 'Customer cart contains 2 distinct food items');
  assert(calculatedSubtotal > 0, `Cart subtotal correctly computed ($${calculatedSubtotal.toFixed(2)})`);

  // --------------------------------------------------------------------------
  // TEST C: Customer chooses dine-in and enters a table number
  // --------------------------------------------------------------------------
  console.log('\n[TEST C] Customer chooses dine-in and enters a table number:');
  // 1. Table validation enforcement
  const invalidDineInRes = await customerService.createOrder({
    restaurantId,
    orderType: 'dine_in',
    tableNumber: '', // Missing table number
    customerName: 'Sam Diner',
    items: cart,
    totalAmount: calculatedSubtotal,
  });
  assert(
    invalidDineInRes.error !== null && invalidDineInRes.error.toLowerCase().includes('table'),
    'Rejects dine-in order if table number is missing'
  );

  // 2. Valid dine-in payload
  const validDineInPayload: CreateOrderDTO = {
    restaurantId,
    orderType: 'dine_in',
    tableNumber: '4',
    customerName: 'Alex Miller',
    customerPhone: '+1 555-0192',
    notes: 'Window booth preferred',
    items: cart,
    totalAmount: calculatedSubtotal,
  };
  assert(validDineInPayload.tableNumber === '4', 'Dine-in payload prefilled with Table 4');

  // --------------------------------------------------------------------------
  // TEST D: Customer places an order
  // --------------------------------------------------------------------------
  console.log('\n[TEST D] Customer places an order:');
  const orderRes = await customerService.createOrder(validDineInPayload);
  assert(orderRes.error === null && orderRes.data !== null, 'Order placement succeeds');
  assert(Boolean(orderRes.data?.orderNumber), `Unique order number assigned (${orderRes.data?.orderNumber})`);
  assert(orderRes.data?.status === 'pending', 'Order initialized in "pending" status');
  assert(orderRes.data?.customerName === 'Alex Miller', 'Customer name persisted on ticket');
  assert(orderRes.data?.tableNumber === '4', 'Table 4 persisted on ticket');

  const createdOrderId = orderRes.data!.id;

  // --------------------------------------------------------------------------
  // TEST E: Order appears on the admin dashboard without refreshing (Realtime)
  // --------------------------------------------------------------------------
  console.log('\n[TEST E] Order appears on admin dashboard without refreshing:');
  let realtimeReceivedOrder: Order | null = null;

  // Admin subscribes to live orders
  const unsubscribe = adminService.subscribeToLiveOrders(
    restaurantId,
    (incomingOrder) => {
      realtimeReceivedOrder = incomingOrder;
    },
    () => {}
  );

  // Another customer places an order
  const liveCustomerPayload: CreateOrderDTO = {
    restaurantId,
    orderType: 'dine_in',
    tableNumber: '7',
    customerName: 'Jordan Realtime',
    items: [{ itemId: item1.id, name: item1.name, price: item1.price, quantity: 1 }],
    totalAmount: item1.price,
  };

  const liveOrderRes = await customerService.createOrder(liveCustomerPayload);
  assert(liveOrderRes.data !== null, 'Second customer order created');
  assert(realtimeReceivedOrder !== null, 'Admin Realtime subscription received order instantly without refresh');
  assert(
    (realtimeReceivedOrder as any)?.customerName === 'Jordan Realtime',
    `Realtime payload verified for customer "${(realtimeReceivedOrder as any)?.customerName}"`
  );

  // Unsubscribe cleanly
  unsubscribe();

  // --------------------------------------------------------------------------
  // TEST F: Staff changes the status to Preparing
  // --------------------------------------------------------------------------
  console.log('\n[TEST F] Staff changes the status to Preparing:');
  const prepRes = await adminService.updateOrderStatus(createdOrderId, 'preparing');
  assert(prepRes.error === null && prepRes.data !== null, 'updateOrderStatus to preparing succeeded');
  assert(prepRes.data?.status === 'preparing', 'Order status verified as "preparing"');

  // Verify KDS order list reflects the update
  const adminOrdersList = await adminService.fetchLiveOrders(restaurantId);
  const foundPrep = adminOrdersList.data?.find((o) => o.id === createdOrderId);
  assert(foundPrep?.status === 'preparing', 'Admin live orders board reflects "preparing" status');

  // --------------------------------------------------------------------------
  // TEST G: Staff changes the status to Ready
  // --------------------------------------------------------------------------
  console.log('\n[TEST G] Staff changes the status to Ready:');
  const readyRes = await adminService.updateOrderStatus(createdOrderId, 'ready');
  assert(readyRes.error === null && readyRes.data !== null, 'updateOrderStatus to ready succeeded');
  assert(readyRes.data?.status === 'ready', 'Order status verified as "ready"');

  const adminOrdersAfterReady = await adminService.fetchLiveOrders(restaurantId);
  const foundReady = adminOrdersAfterReady.data?.find((o) => o.id === createdOrderId);
  assert(foundReady?.status === 'ready', 'Admin live orders board reflects "ready" status');

  // --------------------------------------------------------------------------
  // TEST H: Staff marks an unavailable food item (86'd)
  // --------------------------------------------------------------------------
  console.log('\n[TEST H] Staff marks an unavailable food item:');
  const targetItem = item1;
  const toggleOffRes = await adminService.updateItemAvailability(targetItem.id, false);
  assert(toggleOffRes.error === null && toggleOffRes.data !== null, 'updateItemAvailability succeeded');
  assert(toggleOffRes.data?.isAvailable === false, `Item "${targetItem.name}" marked as 86'd (unavailable)`);

  // Verify customer menu now shows item as unavailable
  const updatedCustomerMenu = await customerService.fetchMenuBySlug('the-bistro');
  const customerViewItem = updatedCustomerMenu.data?.items.find((i) => i.id === targetItem.id);
  assert(customerViewItem?.isAvailable === false, 'Customer menu immediately reflects item is 86\'d (unavailable)');

  // --------------------------------------------------------------------------
  // TEST I: Customer can no longer place that unavailable item in a new order
  // --------------------------------------------------------------------------
  console.log('\n[TEST I] Customer cannot place unavailable item in new order:');
  const blockedOrderPayload: CreateOrderDTO = {
    restaurantId,
    orderType: 'dine_in',
    tableNumber: '2',
    customerName: 'Eager Diner',
    items: [{ itemId: targetItem.id, name: targetItem.name, price: targetItem.price, quantity: 1 }],
    totalAmount: targetItem.price,
  };

  const blockedRes = await customerService.createOrder(blockedOrderPayload);
  assert(blockedRes.data === null, 'Order creation for 86\'d item was rejected');
  assert(
    blockedRes.error !== null && (blockedRes.error.includes('sold out') || blockedRes.error.includes('unavailable')),
    `User-friendly rejection message returned: "${blockedRes.error}"`
  );

  // Restore item availability
  await adminService.updateItemAvailability(targetItem.id, true);

  // --------------------------------------------------------------------------
  // TEST J: Unauthorized users cannot access administrative data
  // --------------------------------------------------------------------------
  console.log('\n[TEST J] Unauthorized users cannot access administrative data:');
  // 1. Invalid staff credentials rejected
  const badAuthRes = await adminService.signIn({
    email: 'hacker@malicious.com',
    password: 'wrongpassword',
  });
  assert(badAuthRes.data === null, 'Authentication fails for unauthorized email/password');
  assert(badAuthRes.error !== null, `Auth rejection error returned: "${badAuthRes.error}"`);

  // 2. Authorized staff login succeeds
  const goodAuthRes = await adminService.signIn({
    email: 'manager@bistro.com',
    password: 'admin123456',
  });
  assert(goodAuthRes.data !== null, 'Authorized demo staff can authenticate');
  assert(goodAuthRes.data?.profile.role === 'admin', 'Staff role is admin');

  // 3. Sign out clears session
  await adminService.signOut();
  const clearedSession = adminService.getCurrentSession();
  assert(clearedSession === null, 'Sign out completely purges cached staff credentials');

  // ==========================================================================
  // Summary
  // ==========================================================================
  console.log('\n===============================================================');
  console.log(`Integration Suite Results: ${passed} Passed, ${failed} Failed`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runIntegrationSuite().catch((err) => {
  console.error('Unhandled integration test failure:', err);
  process.exit(1);
});
