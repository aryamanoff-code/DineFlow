import React, { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';
import { useCart } from '../hooks/useCart';
import { useCustomerOrder } from '../hooks/useCustomerOrder';
import { MenuItem, CreateOrderDTO } from '../../../types';

// Modular Customer Components
import { RestaurantHeader } from '../components/RestaurantHeader';
import { CategoryPills } from '../components/CategoryPills';
import { SearchBar } from '../components/SearchBar';
import { MenuItemCard } from '../components/MenuItemCard';
import { ItemDetailModal } from '../components/ItemDetailModal';
import { CartBar } from '../components/CartBar';
import { CartDrawer } from '../components/CartDrawer';
import { CheckoutModal } from '../components/CheckoutModal';
import { OrderConfirmationModal } from '../components/OrderConfirmationModal';

// Shared UI Components
import { LoadingState } from '../../../components/ui/LoadingState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Button } from '../../../components/ui/Button';

export const MenuPage: React.FC = () => {
  const { slug = 'the-bistro' } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const tableParam = searchParams.get('table');

  // Core Customer Hooks
  const menu = useMenu(slug);
  const cart = useCart();
  const order = useCustomerOrder();

  // Modal / Drawer UI States
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);

  // Handle Loading State
  if (menu.loading) {
    return (
      <div className="p-4 space-y-4">
        <LoadingState
          title="Loading Menu"
          description="Fetching the freshest dishes, prices and availability..."
          fullHeight
        />
      </div>
    );
  }

  // Handle Error State
  if (menu.error || !menu.restaurant) {
    return (
      <div className="p-4">
        <ErrorState
          title="Could not load menu"
          message={menu.error || 'The requested restaurant was not found.'}
          onRetry={menu.refetch}
          retryLabel="Reload Menu"
          fullHeight
        />
      </div>
    );
  }

  // Handle Order Placement Handshake
  const handleCheckoutSubmit = async (payload: CreateOrderDTO) => {
    const confirmed = await order.submitOrder(payload);
    if (confirmed) {
      cart.clearCart();
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      setIsConfirmationOpen(true);
    }
  };

  return (
    <div className="p-3.5 sm:p-4 space-y-4 relative">
      {/* 1. Restaurant Header */}
      <RestaurantHeader
        restaurant={menu.restaurant}
        tableNumber={tableParam}
      />

      {/* 2. Search & Dietary Filter */}
      <SearchBar
        searchQuery={menu.searchQuery}
        onSearchChange={menu.setSearchQuery}
        isVegOnly={menu.isVegOnly}
        onToggleVegOnly={menu.setIsVegOnly}
      />

      {/* 3. Category Filter Navigation */}
      <CategoryPills
        categories={menu.categories}
        selectedCategoryId={menu.selectedCategoryId}
        onSelectCategory={menu.setSelectedCategoryId}
      />

      {/* 4. Filtered Dishes List */}
      <div className="space-y-3.5 pt-1">
        {menu.filteredItems.length === 0 ? (
          <EmptyState
            title="No dishes found"
            description={
              menu.searchQuery
                ? `No items matching "${menu.searchQuery}". Try a different keyword.`
                : 'No items available in this category currently.'
            }
            action={
              (menu.searchQuery || menu.selectedCategoryId || menu.isVegOnly) && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    menu.setSearchQuery('');
                    menu.setSelectedCategoryId(null);
                    menu.setIsVegOnly(false);
                  }}
                >
                  Reset Filters
                </Button>
              )
            }
          />
        ) : (
          menu.filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              currency={menu.restaurant?.currency}
              cartQuantity={cart.getItemQuantity(item.id)}
              onAddToCart={(i) => cart.addItem(i, 1)}
              onIncreaseQuantity={(id, qty) => cart.updateQuantity(id, qty + 1)}
              onDecreaseQuantity={(id, qty) => cart.updateQuantity(id, qty - 1)}
              onOpenCustomizer={(i) => setCustomizingItem(i)}
            />
          ))
        )}
      </div>

      {/* 5. Sticky Floating Cart Summary Trigger */}
      <CartBar
        totalCount={cart.totalCount}
        subtotal={cart.subtotal}
        currency={menu.restaurant.currency}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 6. Item Detail & Customization Modal */}
      <ItemDetailModal
        item={customizingItem}
        currency={menu.restaurant.currency}
        onClose={() => setCustomizingItem(null)}
        onConfirmAdd={(item, qty, instructions) => cart.addItem(item, qty, instructions)}
      />

      {/* 7. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        items={cart.items}
        subtotal={cart.subtotal}
        currency={menu.restaurant.currency}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeItem}
        onClearCart={cart.clearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 8. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        restaurantId={menu.restaurant.id}
        items={cart.items}
        subtotal={cart.subtotal}
        currency={menu.restaurant.currency}
        initialTableNumber={tableParam}
        isSubmitting={order.isSubmitting}
        orderError={order.orderError}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmitOrder={handleCheckoutSubmit}
      />

      {/* 9. Order Confirmation Celebration Modal */}
      <OrderConfirmationModal
        isOpen={isConfirmationOpen}
        order={order.confirmedOrder}
        currency={menu.restaurant.currency}
        onClose={() => {
          setIsConfirmationOpen(false);
          order.resetOrder();
        }}
      />
    </div>
  );
};
