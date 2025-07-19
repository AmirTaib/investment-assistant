# 🎯 Dynamic Popup System

A comprehensive, Apple-like popup system for React applications with TypeScript support.

## ✨ Features

- **🎨 Apple-like Design**: Clean, modern interface following Apple design principles
- **📱 Responsive**: Works perfectly on desktop and mobile
- **♿ Accessible**: Keyboard navigation (Escape key), focus management
- **🎭 Multiple Types**: Success, warning, danger, info with appropriate colors and icons
- **📏 Flexible Sizes**: Small, medium, large, extra-large
- **🔄 Auto-close**: Configurable auto-close timers
- **🎪 Animations**: Smooth slide-in animations
- **🌐 RTL Support**: Perfect Hebrew text support
- **🎯 Specialized Components**: Alert, Confirm, and Custom popups

## 🚀 Quick Start

### Basic Usage

```typescript
import { AlertPopup, useAlert } from '../components';

const MyComponent = () => {
  const { alert, showSuccess, hideAlert } = useAlert();

  const handleClick = () => {
    showSuccess('הצלחה!', 'הפעולה בוצעה בהצלחה.', 3000);
  };

  return (
    <>
      <button onClick={handleClick}>Show Success</button>
      
      <AlertPopup
        isOpen={alert.isOpen}
        onClose={hideAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
    </>
  );
};
```

### Custom Popup

```typescript
import { Popup } from '../components';

const [isOpen, setIsOpen] = useState(false);

<Popup
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Custom Popup"
  type="info"
  size="lg"
>
  <div>Your custom content here...</div>
</Popup>
```

### Confirm Popup

```typescript
import { ConfirmPopup } from '../components';

const [showConfirm, setShowConfirm] = useState(false);

const handleConfirm = () => {
  // Your confirmation logic
  console.log('Confirmed!');
};

<ConfirmPopup
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleConfirm}
  title="אישור פעולה"
  message="האם אתה בטוח שברצונך לבצע פעולה זו?"
  confirmText="אישור"
  cancelText="ביטול"
  type="warning"
/>
```

## 🎨 Components

### 1. `Popup` - Base Component

The foundation popup component with full customization options.

**Props:**
- `isOpen: boolean` - Controls popup visibility
- `onClose: () => void` - Close handler
- `title: string` - Popup title
- `children: React.ReactNode` - Popup content
- `type?: 'info' | 'success' | 'warning' | 'danger'` - Visual type
- `size?: 'sm' | 'md' | 'lg' | 'xl'` - Popup size
- `showCloseButton?: boolean` - Show/hide close button
- `closeOnOverlayClick?: boolean` - Close on background click
- `closeOnEscape?: boolean` - Close on Escape key

### 2. `AlertPopup` - Simple Alert

Quick alert popup for simple messages.

**Props:**
- `isOpen: boolean`
- `onClose: () => void`
- `title: string`
- `message: string`
- `type?: 'info' | 'success' | 'warning' | 'danger'`

### 3. `ConfirmPopup` - Confirmation Dialog

Confirmation popup with action buttons.

**Props:**
- `isOpen: boolean`
- `onClose: () => void`
- `onConfirm: () => void`
- `title: string`
- `message: string`
- `confirmText?: string` - Default: "אישור"
- `cancelText?: string` - Default: "ביטול"
- `type?: 'info' | 'success' | 'warning' | 'danger'`

## 🎣 Hooks

### `useAlert` Hook

Manages alert state and provides convenient methods.

**Returns:**
- `alert: AlertState` - Current alert state
- `showAlert: (config: AlertConfig) => void` - Show custom alert
- `showSuccess: (title: string, message: string, duration?: number) => void`
- `showWarning: (title: string, message: string, duration?: number) => void`
- `showError: (title: string, message: string, duration?: number) => void`
- `showInfo: (title: string, message: string, duration?: number) => void`
- `hideAlert: () => void` - Hide current alert

**Example:**
```typescript
const { showSuccess, showWarning, showError, showInfo } = useAlert();

// Auto-close after 3 seconds
showSuccess('הצלחה!', 'הפעולה בוצעה בהצלחה.', 3000);

// No auto-close
showWarning('אזהרה!', 'יש לשים לב לפרטים.', 0);
```

## 🎨 Design System

### Colors
- **Primary**: `#007AFF` (Apple Blue)
- **Success**: `#34C759` (Apple Green)
- **Warning**: `#FF9500` (Apple Orange)
- **Danger**: `#FF3B30` (Apple Red)

### Sizes
- **Small**: 400px max-width
- **Medium**: 600px max-width (default)
- **Large**: 800px max-width
- **Extra Large**: 1200px max-width

### Animations
- Smooth slide-in animation (0.3s ease-out)
- Scale and translate effects
- Opacity transitions

## 📱 Mobile Support

- Responsive design with viewport units
- Touch-friendly button sizes
- Proper spacing for mobile devices
- RTL support for Hebrew text

## ♿ Accessibility

- **Keyboard Navigation**: Escape key to close
- **Focus Management**: Prevents body scroll when open
- **Screen Reader**: Proper ARIA labels and roles
- **High Contrast**: Clear visual hierarchy

## 🎯 Usage Examples

### 1. Success Notification
```typescript
showSuccess('הקונטקסט הועתק!', 'הקונטקסט הועתק ללוח בהצלחה.', 3000);
```

### 2. Error Handling
```typescript
try {
  await someAsyncOperation();
  showSuccess('הצלחה!', 'הפעולה בוצעה בהצלחה.');
} catch (error) {
  showError('שגיאה!', 'אירעה שגיאה בביצוע הפעולה.');
}
```

### 3. Confirmation Dialog
```typescript
const handleDelete = () => {
  setShowConfirm(true);
};

const confirmDelete = () => {
  // Delete logic here
  showSuccess('נמחק!', 'הפריט נמחק בהצלחה.');
};
```

### 4. Custom Content
```typescript
<Popup
  isOpen={showCustom}
  onClose={() => setShowCustom(false)}
  title="פופאפ מותאם"
  size="lg"
>
  <div>
    <h3>תוכן מותאם</h3>
    <p>אפשר להוסיף כאן כל תוכן שתרצה.</p>
    <button onClick={handleAction}>פעולה</button>
  </div>
</Popup>
```

## 🔧 Customization

### Custom Styles
```typescript
// Override default styles
const customStyles = {
  backgroundColor: '#your-color',
  borderRadius: '12px',
  // ... other styles
};
```

### Custom Icons
```typescript
// The popup automatically shows appropriate icons based on type
// You can customize by modifying the getTypeIcon function
```

## 🚀 Performance

- **Lightweight**: Minimal bundle size impact
- **Efficient**: Uses React hooks for state management
- **Optimized**: Prevents unnecessary re-renders
- **Memory Safe**: Proper cleanup of event listeners

## 📦 Installation

The popup system is included in the main components package:

```typescript
import { Popup, AlertPopup, ConfirmPopup, useAlert } from '../components';
```

## 🎯 Best Practices

1. **Use appropriate types**: Choose the right alert type for your message
2. **Set reasonable durations**: Don't make alerts disappear too quickly
3. **Provide clear messages**: Be specific about what happened
4. **Use confirmations for destructive actions**: Always confirm before deleting
5. **Keep content concise**: Don't overload popups with too much information

## 🔮 Future Enhancements

- [ ] Toast notifications
- [ ] Stacked popups
- [ ] Custom animations
- [ ] Theme customization
- [ ] Internationalization support 