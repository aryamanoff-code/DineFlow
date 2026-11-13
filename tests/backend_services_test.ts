/**
 * Backend Services Automated Test Suite
 * Validates domain contracts, error boundaries, input validation, and access restrictions.
 */

import { restaurantService } from '../src/services/restaurantService';
import { menuService } from '../src/services/menuService';
import { orderService } from '../src/services/orderService';
import { authService } from '../src/services/authService';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string, details?: any) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`, details || '');
    testsFailed++;
  }
}

async function runTests() {
  console.log('\n==================================================');
  console.log('Running DineFlow Backend Services Verification');
  console.log('==================================================\n');

  // 1. Restaurant Service Tests
  console.log('[1] Testing restaurantService:');
  const slugRes = await restaurantService.getRestaurantBySlug('the-bistro');
  assert(slugRes.data !== null && slugRes.data.slug === 'the-bistro', 'getRestaurantBySlug returns valid restaurant for "the-bistro"');
  assert(slugRes.error === null, 'getRestaurantBySlug returns null error for valid slug');

  const invalidSlugRes = await restaurantService.getRestaurantBySlug('non-existent-restaurant-xyz');
  assert(invalidSlugRes.data === null, 'getRestaurantBySlug returns null data for non-existent slug');
  assert(invalidSlugRes.error !== null, 'getRestaurantBySlug returns error for non-existent slug');

  const emptySlugRes = await restaurantService.getRestaurantBySlug('');
  assert(emptySlugRes.error !== null && emptySlugRes.error.includes('required'), 'getRestaurantBySlug rejects empty slug with validation error');

  // 2. Menu Service Tests
  console.log('\n[2] Testing menuService:');
  const menuRes = await menuService.getMenu('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
  assert(menuRes.data !== null, 'getMenu returns menu payload');
  assert(menuRes.data!.categories.length > 0, `getMenu returns categories (count: ${menuRes.data?.categories.length})`);
  assert(menuRes.data!.items.length > 0, `getMenu returns menu items (count: ${menuRes.data?.items.length})`);

  const categoriesRes = await menuService.getMenuCategories('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
  assert(categoriesRes.data !== null && categoriesRes.data.length >= 4, 'getMenuCategories returns all 4 demo categories');

  // Availability Toggle
  const toggleRes = await menuService.setMenuItemAvailability('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', false);
  assert(toggleRes.data !== null && toggleRes.data.isAvailable === false, 'setMenuItemAvailability sets item to 86\'d (unavailable)');

  const toggleBackRes = await menuService.setMenuItemAvailability('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', true);
  assert(toggleBackRes.data !== null && toggleBackRes.data.isAvailable === true, 'setMenuItemAvailability restores item to available');

  // Dish Validation
  const invalidPriceRes = await menuService.saveMenuItem({
    restaurantId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: 'Test Dish',
    price: -5,
    categoryId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01',
  });
  assert(invalidPriceRes.error !== null, 'saveMenuItem rejects negative price with error');

  const emptyNameRes = await menuService.saveMenuItem({
    restaurantId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    name: '   ',
    price: 10,
    categoryId: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b01',
  });
  assert(emptyNameRes.error !== null, 'saveMenuItem rejects empty name with error');

  // 3. Order Service Tests
  console.log('\n[3] Testing orderService:');
  // Validation checks
  const missingNameOrder = await orderService.createOrder({
    restaurantId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    orderType: 'dine_in',
    tableNumber: '4',
    customerName: '',
    items: [{ itemId: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c04', name: 'Burger', price: 16.5, quantity: 1 }],
    totalAmount: 16.5,
  });
  assert(missingNameOrder.error !== null && missingNameOrder.error.includes('name'), 'createOrder rejects order with empty customer name');

  const missingTableOrder = await orderService.createOrder({
    restaurantId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    orderType: 'dine_in',
    tableNumber: '',
    customerName: 'Sam Diner',
    items: [{ itemId: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c04', name: 'Burger', price: 16.5, quantity: 1 }],
    totalAmount: 16.5,
  });
  assert(missingTableOrder.error !== null && missingTableOrder.error.includes('Table number'), 'createOrder rejects dine-in order without table number');

  const emptyItemsOrder = await orderService.createOrder({
    restaurantId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    orderType: 'takeaway',
    customerName: 'Sam Diner',
    items: [],
    totalAmount: 0,
  });
  assert(emptyItemsOrder.error !== null && emptyItemsOrder.error.includes('item'), 'createOrder rejects order with empty cart');

  // Valid Order Creation
  const validOrder = await orderService.createOrder({
    restaurantId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    orderType: 'dine_in',
    tableNumber: '5',
    customerName: 'Morgan Smith',
    customerPhone: '+1 555-4321',
    items: [
      { itemId: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c04', name: 'Classic Truffle Burger', price: 16.5, quantity: 2, instructions: 'Extra sauce' },
    ],
    totalAmount: 33.0,
  });
  assert(validOrder.data !== null, 'createOrder succeeds for valid payload');
  assert(Boolean(validOrder.data?.orderNumber), `createOrder assigns human-readable orderNumber: ${validOrder.data?.orderNumber}`);
  assert(validOrder.data?.status === 'pending', 'createOrder initializes with "pending" status');
  assert(validOrder.data?.subtotal === 33.0, 'createOrder computes correct line subtotal');

  // Fetch Orders
  const ordersListRes = await orderService.getOrders('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');
  assert(ordersListRes.data !== null && ordersListRes.data.length >= 3, `getOrders returns active orders list (count: ${ordersListRes.data?.length})`);

  // Update Status
  const newOrderId = validOrder.data!.id;
  const advanceRes = await orderService.updateOrderStatus(newOrderId, 'preparing');
  assert(advanceRes.data !== null && advanceRes.data.status === 'preparing', 'updateOrderStatus advances order to "preparing"');

  const readyRes = await orderService.updateOrderStatus(newOrderId, 'ready');
  assert(readyRes.data !== null && readyRes.data.status === 'ready', 'updateOrderStatus advances order to "ready"');

  const invalidStatusRes = await orderService.updateOrderStatus(newOrderId, 'invalid-status' as any);
  assert(invalidStatusRes.error !== null, 'updateOrderStatus rejects invalid status enum string');

  // 4. Auth Service Tests
  console.log('\n[4] Testing authService:');
  const emptyEmailRes = await authService.signIn({ email: '', password: '123' });
  assert(emptyEmailRes.error !== null && emptyEmailRes.error.includes('Email'), 'signIn rejects empty email');

  const emptyPasswordRes = await authService.signIn({ email: 'test@bistro.com', password: '' });
  assert(emptyPasswordRes.error !== null && emptyPasswordRes.error.includes('Password'), 'signIn rejects empty password');

  const demoAuthRes = await authService.signIn({ email: 'manager@bistro.com', password: 'admin123456' });
  assert(demoAuthRes.data !== null, 'signIn succeeds with authorized demo credentials');
  assert(demoAuthRes.data?.profile.role === 'admin', 'signIn assigns correct staff admin role');

  const sessionRes = await authService.getCurrentSession();
  assert(sessionRes.data !== null && sessionRes.data.profile.role === 'admin', 'getCurrentSession restores active session token');

  await authService.signOut();
  const clearedSessionRes = await authService.getCurrentSession();
  assert(clearedSessionRes.data === null, 'signOut terminates session and purges cached token');

  // Summary
  console.log('\n==================================================');
  console.log(`Test Execution Finished: ${testsPassed} Passed, ${testsFailed} Failed.`);
  console.log('==================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Unhandled test runner error:', err);
  process.exit(1);
});
