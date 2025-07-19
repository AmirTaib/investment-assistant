import React from 'react';
import { Popup, AlertPopup, ConfirmPopup } from './Popup';
import { useAlert } from '../hooks/useAlert';

// Apple-like design constants
const appleColors = {
  primary: '#007AFF',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F2F7',
  },
  text: {
    primary: '#000000',
    secondary: '#3C3C43',
  },
  border: {
    light: '#C6C6C8',
  },
};

const appleSpacing = {
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};

const appleBorderRadius = {
  lg: '16px',
};

export const PopupDemo: React.FC = () => {
  const { alert, showSuccess, showWarning, showError, showInfo, hideAlert } = useAlert();
  const [showCustomPopup, setShowCustomPopup] = React.useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = React.useState(false);

  const handleConfirmAction = () => {
    showSuccess('פעולה אושרה!', 'הפעולה בוצעה בהצלחה.', 3000);
  };

  return (
    <div style={{
      padding: appleSpacing.xl,
      direction: 'rtl',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <h2 style={{
        fontSize: '28px',
        fontWeight: 700,
        color: appleColors.text.primary,
        marginBottom: appleSpacing.xl,
        textAlign: 'center',
      }}>
        🎯 דמו של מערכת הפופאפים
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: appleSpacing.lg,
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        {/* Success Alert */}
        <button
          onClick={() => showSuccess('הצלחה!', 'הפעולה בוצעה בהצלחה.', 3000)}
          style={{
            padding: `${appleSpacing.md} ${appleSpacing.lg}`,
            backgroundColor: appleColors.success,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: appleBorderRadius.lg,
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          ✅ הצג הצלחה
        </button>

        {/* Warning Alert */}
        <button
          onClick={() => showWarning('אזהרה!', 'יש לשים לב לפרטים הבאים.', 4000)}
          style={{
            padding: `${appleSpacing.md} ${appleSpacing.lg}`,
            backgroundColor: appleColors.warning,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: appleBorderRadius.lg,
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          ⚠️ הצג אזהרה
        </button>

        {/* Error Alert */}
        <button
          onClick={() => showError('שגיאה!', 'אירעה שגיאה בביצוע הפעולה.', 5000)}
          style={{
            padding: `${appleSpacing.md} ${appleSpacing.lg}`,
            backgroundColor: appleColors.danger,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: appleBorderRadius.lg,
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          🚨 הצג שגיאה
        </button>

        {/* Info Alert */}
        <button
          onClick={() => showInfo('מידע', 'הנה מידע חשוב עבורך.', 3000)}
          style={{
            padding: `${appleSpacing.md} ${appleSpacing.lg}`,
            backgroundColor: appleColors.primary,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: appleBorderRadius.lg,
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          ℹ️ הצג מידע
        </button>

        {/* Custom Popup */}
        <button
          onClick={() => setShowCustomPopup(true)}
          style={{
            padding: `${appleSpacing.md} ${appleSpacing.lg}`,
            backgroundColor: appleColors.background.secondary,
            color: appleColors.text.primary,
            border: `1px solid ${appleColors.border.light}`,
            borderRadius: appleBorderRadius.lg,
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = appleColors.background.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = appleColors.background.secondary;
          }}
        >
          🎨 פופאפ מותאם
        </button>

        {/* Confirm Popup */}
        <button
          onClick={() => setShowConfirmPopup(true)}
          style={{
            padding: `${appleSpacing.md} ${appleSpacing.lg}`,
            backgroundColor: appleColors.warning,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: appleBorderRadius.lg,
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          ❓ אישור פעולה
        </button>
      </div>

      {/* Alert Popup */}
      <AlertPopup
        isOpen={alert.isOpen}
        onClose={hideAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />

      {/* Custom Popup */}
      <Popup
        isOpen={showCustomPopup}
        onClose={() => setShowCustomPopup(false)}
        title="פופאפ מותאם אישית"
        type="info"
        size="lg"
      >
        <div style={{
          fontSize: '16px',
          lineHeight: 1.6,
          color: appleColors.text.primary,
        }}>
          <p>זהו פופאפ מותאם אישית עם תוכן מורכב יותר.</p>
          <p>אפשר להוסיף כאן:</p>
          <ul style={{ paddingRight: appleSpacing.lg }}>
            <li>רשימות</li>
            <li>טבלאות</li>
            <li>תמונות</li>
            <li>טפסים</li>
            <li>וכל תוכן אחר</li>
          </ul>
          <p>הפופאפ תומך בגלילה אם התוכן ארוך מדי.</p>
        </div>
      </Popup>

      {/* Confirm Popup */}
      <ConfirmPopup
        isOpen={showConfirmPopup}
        onClose={() => setShowConfirmPopup(false)}
        onConfirm={handleConfirmAction}
        title="אישור פעולה"
        message="האם אתה בטוח שברצונך לבצע פעולה זו? פעולה זו אינה הפיכה."
        confirmText="אישור"
        cancelText="ביטול"
        type="warning"
      />
    </div>
  );
}; 