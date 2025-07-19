export const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString('he-IL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return timestamp;
  }
};

export const formatDate = (date: string): string => {
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return date;
  }
};

export const getActionColor = (action: string) => {
  switch (action) {
    case 'לקנות':
      return 'success';
    case 'למכור':
      return 'danger';
    case 'להחזיק':
      return 'warning';
    default:
      return 'neutral';
  }
};

export const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'חיובי':
      return 'success';
    case 'שלילי':
      return 'danger';
    case 'ניטרלי':
      return 'warning';
    default:
      return 'neutral';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'גבוה':
      return 'danger';
    case 'בינוני':
      return 'warning';
    case 'נמוך':
      return 'success';
    default:
      return 'neutral';
  }
}; 