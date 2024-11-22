import { useEffect } from 'react';

export const useElementManager = (elementIds) => {
  useEffect(() => {
    elementIds.forEach(id => {
      if (!document.getElementById(id)) {
        const element = document.createElement('div');
        element.id = id;
        document.body.insertBefore(element, document.body.firstChild);
      }
    });

    return () => elementIds.forEach(id => {
      document.getElementById(id)?.remove();
    });
  }, [elementIds]);
}; 